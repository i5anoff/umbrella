import { IDeref, SEMAPHORE } from "@thi.ng/api";
import { peek } from "@thi.ng/arrays";
import { implementsFunction, isFunction, isPlainObject } from "@thi.ng/checks";
import { illegalArity, illegalState } from "@thi.ng/errors";
import {
    comp,
    isReduced,
    push,
    Reducer,
    Transducer,
    unreduced
} from "@thi.ng/transducers";
import {
    CloseMode,
    CommonOpts,
    ISubscribable,
    ISubscriber,
    ITransformable,
    LOGGER,
    State,
    SubscriptionOpts
} from "./api";
import { nextID } from "./utils/idgen";

/**
 * Creates a new {@link Subscription} instance, the fundamental datatype
 * and building block provided by this package.
 *
 * @remarks
 * Most other types in rstream, including {@link Stream}s, are
 * `Subscription`s and all can be:
 *
 * - linked into directed graphs (sync or async & not necessarily DAGs)
 * - transformed using transducers (incl. support for early termination)
 * - can have any number of subscribers (optionally each w/ their own
 *   transducers)
 * - recursively unsubscribe themselves from parent after their last
 *   subscriber unsubscribed (configurable)
 * - will go into a non-recoverable error state if none of the
 *   subscribers has an error handler itself
 * - implement the {@link @thi.ng/api#IDeref} interface
 *
 * Subscription behavior can be customized via the additional (optional)
 * options arg. See `CommonOpts` and `SubscriptionOpts` for further
 * details.
 *
 * @example
 * ```ts
 * // as reactive value mechanism (same as with stream() above)
 * s = subscription();
 * s.subscribe(trace("s1"));
 * s.subscribe(trace("s2"), { xform: tx.filter((x) => x > 25) });
 *
 * // external trigger
 * s.next(23);
 * // s1 23
 * s.next(42);
 * // s1 42
 * // s2 42
 * ```
 *
 * @param sub -
 * @param opts -
 */
export const subscription = <A, B>(
    sub?: ISubscriber<B>,
    opts?: Partial<SubscriptionOpts<A, B>>
) => new Subscription(sub, opts);

export class Subscription<A, B>
    implements
        IDeref<B | undefined>,
        ISubscriber<A>,
        ISubscribable<B>,
        ITransformable<B> {
    id: string;

    closeIn: CloseMode;
    closeOut: CloseMode;

    protected parent?: ISubscribable<A>;
    protected subs: ISubscriber<B>[];
    protected xform?: Reducer<B[], A>;
    protected state: State = State.IDLE;

    protected cacheLast: boolean;
    protected last: any;

    constructor(
        sub?: ISubscriber<B>,
        opts: Partial<SubscriptionOpts<A, B>> = {}
    ) {
        this.parent = opts.parent;
        this.closeIn =
            opts.closeIn !== undefined ? opts.closeIn : CloseMode.LAST;
        this.closeOut =
            opts.closeOut !== undefined ? opts.closeOut : CloseMode.LAST;
        this.cacheLast = opts.cache !== false;
        this.id = opts.id || `sub-${nextID()}`;
        this.last = SEMAPHORE;
        this.subs = [];
        if (sub) {
            this.subs.push(sub);
        }
        if (opts.xform) {
            this.xform = opts.xform(push());
        }
    }

    deref(): B | undefined {
        return this.last !== SEMAPHORE ? this.last : undefined;
    }

    getState() {
        return this.state;
    }

    /**
     * Creates new child subscription with given subscriber and/or
     * transducer and optional subscription ID.
     */
    subscribe(
        sub: Partial<ISubscriber<B>>,
        opts?: Partial<CommonOpts>
    ): Subscription<B, B>;
    subscribe<C>(sub: Subscription<B, C>): Subscription<B, C>;
    subscribe<C>(
        xform: Transducer<B, C>,
        opts?: Partial<CommonOpts>
    ): Subscription<B, C>;
    subscribe<C>(
        sub: Partial<ISubscriber<C>>,
        xform: Transducer<B, C>,
        opts?: Partial<CommonOpts>
    ): Subscription<B, C>;
    subscribe(...args: any[]): any {
        this.ensureState();
        let sub: Subscription<any, any> | undefined;
        let opts: SubscriptionOpts<any, any> =
            args.length > 1 && isPlainObject(peek(args))
                ? { ...args.pop() }
                : {};
        switch (args.length) {
            case 1:
                if (isFunction(args[0])) {
                    opts.xform = args[0];
                    !opts.id && (opts.id = `xform-${nextID()}`);
                } else {
                    sub = args[0];
                }
                break;
            case 2:
                sub = args[0];
                opts.xform = args[1];
                break;
            default:
                illegalArity(args.length);
        }
        if (implementsFunction(sub!, "subscribe")) {
            sub!.parent = this;
        } else {
            // FIXME inherit options from this sub or defaults?
            sub = subscription<B, B>(sub, { parent: this, ...opts });
        }
        this.last !== SEMAPHORE && sub!.next(this.last);
        return this.addWrapped(sub!);
    }

    /**
     * Returns array of new child subscriptions for all given
     * subscribers.
     *
     * @param subs -
     */
    subscribeAll(...subs: ISubscriber<B>[]) {
        const wrapped: Subscription<B, B>[] = [];
        for (let s of subs) {
            wrapped.push(this.subscribe(s));
        }
        return wrapped;
    }

    /**
     * Creates a new child subscription using given transducers and
     * optional subscription ID. Supports up to 4 transducers and if
     * more than one transducer is given, composes them in left-to-right
     * order using {@link @thi.ng/transducers#(comp:1)}.
     *
     * Shorthand for `subscribe(comp(xf1, xf2,...), id)`
     */
    transform<C>(
        a: Transducer<B, C>,
        opts?: Partial<CommonOpts>
    ): Subscription<B, C>;
    // prettier-ignore
    transform<C, D>(a: Transducer<B, C>, b: Transducer<C, D>, opts?: Partial<CommonOpts>): Subscription<B, D>;
    // prettier-ignore
    transform<C, D, E>(a: Transducer<B, C>, b: Transducer<C, D>, c: Transducer<D, E>, opts?: Partial<CommonOpts>): Subscription<B, E>;
    // prettier-ignore
    transform<C, D, E, F>(a: Transducer<B, C>, b: Transducer<C, D>, c: Transducer<D, E>, d: Transducer<E, F>, opts?: Partial<CommonOpts>): Subscription<B, F>;
    transform(...xf: any[]) {
        const n = xf.length - 1;
        return isPlainObject(xf[n])
            ? this.subscribe((<any>comp)(...xf.slice(0, n)), xf[n])
            : this.subscribe((<any>comp)(...xf));
    }

    /**
     * If called without arg, removes this subscription from parent (if
     * any), cleans up internal state and goes into DONE state. If
     * called with arg, removes the sub from internal pool and if no
     * other subs are remaining also cleans up itself and goes into DONE
     * state.
     *
     * @param sub -
     */
    unsubscribe(sub?: Subscription<B, any>) {
        LOGGER.debug(this.id, "unsub start", sub ? sub.id : "self");
        if (!sub) {
            let res = true;
            if (this.parent) {
                res = this.parent.unsubscribe(this);
            }
            this.state = State.DONE;
            this.cleanup();
            return res;
        }
        if (this.subs) {
            LOGGER.debug(this.id, "unsub child", sub.id);
            const idx = this.subs.indexOf(sub);
            if (idx >= 0) {
                this.subs.splice(idx, 1);
                if (
                    this.closeOut === CloseMode.FIRST ||
                    (!this.subs.length && this.closeOut !== CloseMode.NEVER)
                ) {
                    this.unsubscribe();
                }
                return true;
            }
        }
        return false;
    }

    next(x: A) {
        if (this.state < State.DONE) {
            if (this.xform) {
                const acc = this.xform[2]([], x);
                const uacc = unreduced(acc);
                const n = uacc.length;
                for (let i = 0; i < n; i++) {
                    this.dispatch(uacc[i]);
                }
                if (isReduced(acc)) {
                    this.done();
                }
            } else {
                this.dispatch(<any>x);
            }
        }
    }

    done() {
        LOGGER.debug(this.id, "entering done()");
        if (this.state < State.DONE) {
            if (this.xform) {
                const acc = this.xform[1]([]);
                const uacc = unreduced(acc);
                const n = uacc.length;
                for (let i = 0; i < n; i++) {
                    this.dispatch(uacc[i]);
                }
            }
            this.state = State.DONE;
            for (let s of [...this.subs]) {
                try {
                    s.done && s.done();
                } catch (e) {
                    s.error ? s.error(e) : this.error(e);
                }
            }
            this.unsubscribe();
            LOGGER.debug(this.id, "exiting done()");
        }
    }

    error(e: any) {
        this.state = State.ERROR;
        let notified = false;
        if (this.subs && this.subs.length) {
            for (let s of this.subs.slice()) {
                if (s.error) {
                    s.error(e);
                    notified = true;
                }
            }
        }
        if (!notified) {
            LOGGER.warn(this.id, "unhandled error:", e);
            if (this.parent) {
                LOGGER.debug(this.id, "unsubscribing...");
                this.unsubscribe();
                this.state = State.ERROR;
            }
        }
    }

    protected addWrapped(wrapped: Subscription<any, any>) {
        this.subs.push(wrapped);
        this.state = State.ACTIVE;
        return wrapped;
    }

    protected dispatch(x: B) {
        // LOGGER.debug(this.id, "dispatch", x);
        this.cacheLast && (this.last = x);
        const subs = this.subs;
        let s: ISubscriber<B>;
        if (subs.length === 1) {
            s = subs[0];
            try {
                s.next && s.next(x);
            } catch (e) {
                s.error ? s.error(e) : this.error(e);
            }
        } else {
            for (let i = subs.length; --i >= 0; ) {
                s = subs[i];
                try {
                    s.next && s.next(x);
                } catch (e) {
                    s.error ? s.error(e) : this.error(e);
                }
            }
        }
    }

    protected ensureState() {
        if (this.state >= State.DONE) {
            illegalState(`operation not allowed in state ${this.state}`);
        }
    }

    protected cleanup() {
        LOGGER.debug(this.id, "cleanup");
        this.subs.length = 0;
        delete this.parent;
        delete this.xform;
        delete this.last;
    }
}
