import type { Node, NodeKey, XYPair, Dimensions } from '../types/logic';
import type { NodeStore } from '../types/stores';
import { ReactiveMapStateImpl } from './base';

export class NodeStoreImpl extends ReactiveMapStateImpl<NodeKey, Node> implements NodeStore {
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