import type { Anchor, Graph, Node, GroupBox } from './index';
import type { AnchorKey, EdgeKey, GraphKey, GroupKey, NodeKey } from './logic';
import type { WritableEdge } from '$lib/components/Organisms/Edge/Edge.types';

// Base store types
export interface ReactiveState<T> {
	value: T;
	set(value: T): void;
	update(fn: (value: T) => T): void;
}

export interface ReactiveMapState<K, V> {
	items: Map<K, V>;
	size: number;
}

// Graph store types
export interface GraphStore extends ReactiveMapState<GraphKey, Graph> {
	activeGraph: Graph | null;
	activeElements: {
		nodes: Set<Node>;
		edges: Set<WritableEdge>;
		groups: Set<GroupBox>;
	} | null;
	add(key: GraphKey, value: Graph): void;
	remove(key: GraphKey): void;
	get(key: GraphKey): Graph | undefined;
	getAll(): Graph[];
	clear(): void;
	setActive(key: GraphKey): void;
	addNode(graphKey: GraphKey, node: Node): void;
	addEdge(graphKey: GraphKey, edge: WritableEdge): void;
	addGroup(graphKey: GraphKey, group: GroupBox): void;
	removeNode(graphKey: GraphKey, node: Node): void;
	removeEdge(graphKey: GraphKey, edge: WritableEdge): void;
	removeGroup(graphKey: GraphKey, group: GroupBox): void;
}

// Edge store types
export interface EdgeStore extends ReactiveMapState<EdgeKey, WritableEdge> {
	add(key: EdgeKey, value: WritableEdge): void;
	remove(key: EdgeKey): void;
	get(key: EdgeKey): WritableEdge | undefined;
	getAll(): WritableEdge[];
	clear(): void;
	match(source: Node | null, target: Node, anchor?: Anchor | null): EdgeKey[];
	fetch(source: Anchor, target: Anchor): WritableEdge | null;
	onEdgeChange(callback: (edge: WritableEdge, type: 'connection' | 'disconnection') => void): void;
}

// Node store types
export interface NodeStore extends ReactiveMapState<NodeKey, Node> {
	add(key: NodeKey, value: Node): void;
	remove(key: NodeKey): void;
	get(key: NodeKey): Node | undefined;
	getAll(): Node[];
	clear(): void;
	updatePosition(key: NodeKey, position: { x: number; y: number }): void;
	updateDimensions(key: NodeKey, dimensions: { width: number; height: number }): void;
}

// Group store types
export interface GroupStore extends ReactiveMapState<GroupKey, GroupBox> {
	add(key: GroupKey, value: GroupBox): void;
	remove(key: GroupKey): void;
	get(key: GroupKey): GroupBox | undefined;
	getAll(): GroupBox[];
	clear(): void;
	addNode(groupKey: GroupKey, node: Node): void;
	removeNode(groupKey: GroupKey, node: Node): void;
}

// Anchor store types
export interface AnchorStore extends ReactiveMapState<AnchorKey, Anchor> {
	add(key: AnchorKey, value: Anchor): void;
	remove(key: AnchorKey): void;
	get(key: AnchorKey): Anchor | undefined;
	getAll(): Anchor[];
	clear(): void;
	connect(source: AnchorKey, target: AnchorKey): void;
	disconnect(source: AnchorKey, target: AnchorKey): void;
}

export type GroupBoxStore = GroupStore;
