import type { Node, EdgeKey, Anchor } from '../types/logic';
import type { WritableEdge } from '$lib/components/Organisms/Edge/Edge.types';
import type { EdgeStore } from '../types/stores';
import { ReactiveMapStateImpl } from './base';

export class EdgeStoreImpl extends ReactiveMapStateImpl<EdgeKey, WritableEdge> implements EdgeStore {
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