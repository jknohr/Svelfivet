import { ReactiveMapStateImpl } from './base';
import type { Node, NodeKey, Edge, EdgeKey, GroupBox, GroupKey, Anchor, AnchorKey, XYPair, Dimensions } from '../types/logic';
import type { WritableEdge } from '$lib/components/Organisms/Edge/Edge.types';

// Store Classes
class EdgeStore extends ReactiveMapStateImpl<EdgeKey, WritableEdge> {
    private _lastEdge = $state<WritableEdge | null>(null);

    add(key: EdgeKey, value: WritableEdge) {
        this.setItem(key, value);
        this._lastEdge = value;
    }

    remove(key: EdgeKey) {
        const edge = this.getItem(key);
        this.deleteItem(key);
        if (edge === this._lastEdge) {
            this._lastEdge = null;
        }
    }

    get(key: EdgeKey) {
        return this.getItem(key);
    }

    getAll() {
        return this.getAllItems();
    }

    clear() {
        this.clearItems();
        this._lastEdge = null;
    }

    match(source: Node | null, target: Node, anchor?: Anchor | null) {
        return $derived.by(() => {
            const matches: EdgeKey[] = [];
            for (const [key, edge] of this.items.entries()) {
                if ((!source || edge.source.node === source) && edge.target.node === target) {
                    matches.push(key);
                }
            }
            return matches;
        });
    }

    fetch(source: Anchor, target: Anchor) {
        return $derived.by(() => {
            for (const [, edge] of this.items.entries()) {
                if (edge.source === source && edge.target === target) {
                    return edge;
                }
            }
            return null;
        });
    }

    onEdgeChange(callback: (edge: WritableEdge, type: 'connection' | 'disconnection') => void) {
        $effect(() => {
            if (this._lastEdge) {
                callback(this._lastEdge, 'connection');
            }
        });
    }
}

class NodeStore extends ReactiveMapStateImpl<NodeKey, Node> {
    private _positions = $state(new Map<NodeKey, XYPair>());
    private _dimensions = $state(new Map<NodeKey, Dimensions>());

    add(key: NodeKey, value: Node) {
        this.setItem(key, value);
        this._positions.set(key, value.position);
        this._dimensions.set(key, value.dimensions);
    }

    remove(key: NodeKey) {
        this.deleteItem(key);
        this._positions.delete(key);
        this._dimensions.delete(key);
    }

    get(key: NodeKey) {
        return this.getItem(key);
    }

    getAll() {
        return this.getAllItems();
    }

    clear() {
        this.clearItems();
        this._positions.clear();
        this._dimensions.clear();
    }

    updatePosition(key: NodeKey, position: XYPair) {
        const node = this.getItem(key);
        if (node) {
            node.position = position;
            this._positions.set(key, position);
        }
    }

    updateDimensions(key: NodeKey, dimensions: Dimensions) {
        const node = this.getItem(key);
        if (node) {
            node.dimensions = dimensions;
            this._dimensions.set(key, dimensions);
        }
    }
}

class GroupStore extends ReactiveMapStateImpl<GroupKey, GroupBox> {
    private nodeGroups = $state(new Map<GroupKey, Set<NodeKey>>());

    add(key: GroupKey, value: GroupBox) {
        this.setItem(key, value);
        this.nodeGroups.set(key, new Set());
    }

    remove(key: GroupKey) {
        this.deleteItem(key);
        this.nodeGroups.delete(key);
    }

    get(key: GroupKey) {
        return this.getItem(key);
    }

    getAll() {
        return this.getAllItems();
    }

    clear() {
        this.clearItems();
        this.nodeGroups.clear();
    }

    addNode(groupKey: GroupKey, node: Node) {
        const nodes = this.nodeGroups.get(groupKey) ?? new Set();
        if (node.id) {
            nodes.add(node.id);
            this.nodeGroups.set(groupKey, nodes);
        }
    }

    removeNode(groupKey: GroupKey, node: Node) {
        const nodes = this.nodeGroups.get(groupKey);
        if (nodes && node.id) {
            nodes.delete(node.id);
            this.nodeGroups.set(groupKey, nodes);
        }
    }
}

class AnchorStore extends ReactiveMapStateImpl<AnchorKey, Anchor> {
    add(key: AnchorKey, value: Anchor) {
        this.setItem(key, value);
    }

    remove(key: AnchorKey) {
        this.deleteItem(key);
    }

    get(key: AnchorKey) {
        return this.getItem(key);
    }

    getAll() {
        return this.getAllItems();
    }

    clear() {
        this.clearItems();
    }
}

// Export store instances
export const edgeStore = new EdgeStore();
export const nodeStore = new NodeStore();
export const groupStore = new GroupStore();
export const anchorStore = new AnchorStore();
