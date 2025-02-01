import type { Node, Edge, GroupBox, NodeKey, EdgeKey, GroupKey, AnchorKey, Anchor, XYPair, Dimensions } from './logic';
import type { WritableEdge } from '$lib/components/Organisms/Edge/Edge.types';

// Store Interfaces
export interface EdgeStore {
    add(key: EdgeKey, value: WritableEdge): void;
    remove(key: EdgeKey): void;
    get(key: EdgeKey): WritableEdge | undefined;
    getAll(): WritableEdge[];
    clear(): void;
    match(source: Node | null, target: Node, anchor?: Anchor | null): EdgeKey[];
    fetch(source: Anchor, target: Anchor): WritableEdge | null;
    onEdgeChange(callback: (edge: WritableEdge, type: 'connection' | 'disconnection') => void): void;
}

export interface NodeStore {
    add(key: NodeKey, value: Node): void;
    remove(key: NodeKey): void;
    get(key: NodeKey): Node | undefined;
    getAll(): Node[];
    clear(): void;
    updatePosition(key: NodeKey, position: XYPair): void;
    updateDimensions(key: NodeKey, dimensions: Dimensions): void;
}

export interface GroupStore {
    add(key: GroupKey, value: GroupBox): void;
    remove(key: GroupKey): void;
    get(key: GroupKey): GroupBox | undefined;
    getAll(): GroupBox[];
    clear(): void;
    addNode(groupKey: GroupKey, node: Node): void;
    removeNode(groupKey: GroupKey, node: Node): void;
}

export interface AnchorStore {
    add(key: AnchorKey, value: Anchor): void;
    remove(key: AnchorKey): void;
    get(key: AnchorKey): Anchor | undefined;
    getAll(): Anchor[];
    clear(): void;
}

// Base Store Classes
export interface ReactiveState<T> {
    value: T;
    set(value: T): void;
    update(fn: (value: T) => T): void;
}

export interface ReactiveMapState<K, V> {
    items: Map<K, V>;
    size: number;
    setItem(key: K, value: V): void;
    deleteItem(key: K): void;
    getItem(key: K): V | undefined;
    getAllItems(): V[];
    clearItems(): void;
} 