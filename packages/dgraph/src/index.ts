import { ICopy } from "@thi.ng/api";
import { ArraySet, EquivMap, union } from "@thi.ng/associative";
import { equiv } from "@thi.ng/equiv";
import { illegalArgs } from "@thi.ng/errors";
import { filter, reduce, reducer } from "@thi.ng/transducers";

export class DGraph<T> implements Iterable<T>, ICopy<DGraph<T>> {
    dependencies: EquivMap<T, ArraySet<T>>;
    dependents: EquivMap<T, ArraySet<T>>;

    constructor() {
        this.dependencies = new EquivMap<T, ArraySet<T>>();
        this.dependents = new EquivMap<T, ArraySet<T>>();
    }

    *[Symbol.iterator]() {
        yield* this.sort();
    }

    get [Symbol.species]() {
        return DGraph;
    }

    copy() {
        const g = new DGraph<T>();
        for (let e of this.dependencies) {
            g.dependencies.set(e[0], e[1].copy());
        }
        for (let e of this.dependents) {
            g.dependents.set(e[0], e[1].copy());
        }
        return g;
    }

    addNode(node: T) {
        !this.dependencies.has(node) &&
            this.dependencies.set(node, new ArraySet());
        return this;
    }

    addDependency(node: T, dep: T) {
        if (equiv(node, dep) || this.depends(dep, node)) {
            illegalArgs(`Circular dependency between: ${node} & ${dep}`);
        }
        let deps = this.dependencies.get(node);
        this.dependencies.set(node, deps ? deps.add(dep) : new ArraySet([dep]));
        deps = this.dependents.get(dep);
        this.dependents.set(dep, deps ? deps.add(node) : new ArraySet([node]));
        return this;
    }

    removeEdge(node: T, dep: T) {
        let deps = this.dependencies.get(node);
        if (deps) {
            deps.delete(dep);
        }
        deps = this.dependents.get(dep);
        if (deps) {
            deps.delete(node);
        }
        return this;
    }

    removeNode(x: T) {
        this.dependencies.delete(x);
        return this;
    }

    depends(x: T, y: T) {
        return this.transitiveDependencies(x).has(y);
    }

    dependent(x: T, y: T) {
        return this.transitiveDependents(x).has(y);
    }

    immediateDependencies(x: T): Set<T> {
        return this.dependencies.get(x) || new ArraySet();
    }

    immediateDependents(x: T): Set<T> {
        return this.dependents.get(x) || new ArraySet();
    }

    isLeaf(x: T) {
        return this.immediateDependents(x).size === 0;
    }

    isRoot(x: T) {
        return this.immediateDependencies(x).size === 0;
    }

    nodes(): Set<T> {
        return union(
            new ArraySet(this.dependencies.keys()),
            new ArraySet(this.dependents.keys())
        );
    }

    leaves() {
        return filter((node: T) => this.isLeaf(node), this.nodes());
    }

    roots() {
        return filter((node: T) => this.isRoot(node), this.nodes());
    }

    transitiveDependencies(x: T) {
        return transitive(this.dependencies, x);
    }

    transitiveDependents(x: T) {
        return transitive(this.dependents, x);
    }

    sort() {
        const sorted: T[] = [];
        const g = this.copy();
        let queue = new ArraySet(g.leaves());
        while (true) {
            if (!queue.size) {
                return sorted.reverse();
            }
            const node = queue.first();
            queue.delete(node);
            for (let d of [...g.immediateDependencies(node)]) {
                g.removeEdge(node, d);
                if (g.isLeaf(d)) {
                    queue.add(d);
                }
            }
            sorted.push(node);
            g.removeNode(node);
        }
    }
}

const transitive = <T>(nodes: EquivMap<T, ArraySet<T>>, x: T): Set<T> => {
    const deps: ArraySet<T> = nodes.get(x);
    if (deps) {
        return reduce(
            reducer(
                null,
                (acc, k: T) => <ArraySet<T>>union(acc, transitive(nodes, k))
            ),
            deps,
            deps
        );
    }
    return new ArraySet<T>();
};
