import type { Anchor, Graph, Node, GroupKey } from '$lib/types';
import type { GroupBox, NodeKey, GraphKey, AnchorKey, CustomEdgeKey } from '$lib/types';
import type { WritableEdge } from './edge';
import type { generateOutput } from '$lib/utils/creators/';

export interface Store<T, K> {
	subscribe: (subscriber: (value: Map<K, T>) => void) => () => void;
	set: (value: Map<K, T>) => void;
	update: (updater: (value: Map<K, T>) => Map<K, T>) => void;
	add: (item: T, key: K) => Map<K, T>;
	get: (key: K) => T | null;
	getAll: () => T[];
	delete: (key: K) => boolean;
	count: () => number;
}

export interface EdgeStore {
	count: () => number;
	delete: (key: CustomEdgeKey) => boolean;
	get: (key: CustomEdgeKey) => WritableEdge | null;
	getAll: () => WritableEdge[];
	match: (...args: Array<Node | Anchor | null>) => CustomEdgeKey[];
	fetch: (source: Anchor, target: Anchor) => WritableEdge | null;
	subscribe: (subscriber: (value: Map<CustomEdgeKey, WritableEdge>) => void) => () => void;
	update: (updater: (value: Map<CustomEdgeKey, WritableEdge>) => Map<CustomEdgeKey, WritableEdge>) => void;
	set: (value: Map<CustomEdgeKey, WritableEdge>) => void;
	add: (item: WritableEdge, key: CustomEdgeKey) => void;
	onEdgeChange: (
		callback: (edge: WritableEdge, type: 'connection' | 'disconnection') => void
	) => () => void;
}

export type GraphStore = Store<Graph, GraphKey>;
export type NodeStore = Store<Node, NodeKey>;
export type GroupBoxStore = Store<GroupBox, GroupKey>;
export type AnchorStore = Store<Anchor, AnchorKey>;

export type OutputStore = ReturnType<typeof generateOutput>;
export type InputStore = Record<string, unknown>;
