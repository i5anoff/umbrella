import { Predicate } from "@thi.ng/api";
import { CommonOpts, ISubscribable, State } from "../api";
import { Subscription } from "../subscription";
import { optsWithID } from "../utils/idgen";

export interface SidechainPartitionOpts<T> extends CommonOpts {
    pred: Predicate<T>;
}

/**
 * Returns a {@link Subscription} which buffers values from `src` until
 * side chain fires, then emits buffer (unless empty) and repeats
 * process until either input is done.
 *
 * @remarks
 * By default, the values read from the side chain are ignored (i.e.
 * only their timing is used), however the `pred`icate option can be
 * used to only trigger for specific values / conditions.
 *
 * @example
 * ```t
 * // merge various event streams
 * events = merge([
 *     fromEvent(document,"mousemove"),
 *     fromEvent(document,"mousedown"),
 *     fromEvent(document,"mouseup")
 * ]);
 *
 * // queue event processing to only execute during the
 * // requestAnimationFrame cycle (RAF)
 * events.subscribe(sidechainPartition(fromRAF())).subscribe(trace())
 * ```
 *
 * @param side -
 * @param opts -
 */
export const sidechainPartition = <A, B>(
    side: ISubscribable<B>,
    opts?: Partial<SidechainPartitionOpts<B>>
): Subscription<A, A[]> => new SidechainPartition<A, B>(side, opts);

export class SidechainPartition<A, B> extends Subscription<A, A[]> {
    sideSub: Subscription<B, B>;
    buf: A[];

    constructor(
        side: ISubscribable<B>,
        opts?: Partial<SidechainPartitionOpts<B>>
    ) {
        opts = optsWithID("sidepart", opts);
        super(undefined, opts);
        this.buf = [];
        const pred = opts.pred || (() => true);
        const $this = this;
        this.sideSub = side.subscribe({
            next(x) {
                if ($this.buf.length && pred!(x)) {
                    $this.dispatch($this.buf);
                    $this.buf = [];
                }
            },
            done() {
                if ($this.buf.length) {
                    $this.dispatch($this.buf);
                }
                $this.done();
                delete $this.buf;
            }
        });
    }

    unsubscribe(sub?: Subscription<any, any>) {
        const res = super.unsubscribe(sub);
        if (!sub || !this.subs.length) {
            this.sideSub.unsubscribe();
        }
        return res;
    }

    next(x: A) {
        if (this.state < State.DONE) {
            this.buf.push(x);
        }
    }

    done() {
        this.sideSub.unsubscribe();
        super.done();
    }
}
