import type { SvelteComponent } from 'svelte';
import type {
	GraphKey,
	NodeStore,
	Node,
	CSSColorString,
	XYPair,
	Dimensions,
	GroupBoxStore,
	EdgeStore,
	GroupKey,
	Anchor,
	InputStore,
	OutputStore,
	GraphDimensions,
	Theme
} from '.';
import type { ComponentType } from 'svelte';
import type { createBoundsStore } from '$lib/utils/creators/createBoundsStore';

export interface Graph {
	id: GraphKey;
	nodes: NodeStore;
	transforms: GraphTransforms;
	locked: boolean;
	bounds: {
		graphBounds: GraphDimensions;
		nodeBounds: GraphDimensions;
		recalculateBounds: () => void;
	};
	mounted: boolean;
	center: XYPair;
	maxZIndex: number;
	dimensions: GraphDimensions;
	editable: boolean;
	direction: 'TD' | 'LR';
	cursor: XYPair;
	groups: Groups;
	edges: EdgeStore;
	edge: typeof SvelteComponent | null;
	groupBoxes: GroupBoxStore;
	editing: Node | null;
	activeGroup: GroupKey | null;
	initialNodePositions: XYPair[];
}

// Props for Svelvet component
export interface GraphConfig {
	editable?: boolean;
	zoom?: number;
	direction?: 'TD' | 'LR';
	locked?: boolean;
	theme?: Theme;
	translation?: XYPair;
	edge?: typeof SvelteComponent;
}

export type LinkingAny = Anchor;

export interface LinkingInput {
	anchor: Anchor;
	store: InputStore | null;
	key: string | number | null;
}

export interface LinkingOutput {
	anchor: Anchor;
	store: OutputStore | null;
}

export interface ConnectingFrom {
	anchor: Anchor;
	store: InputStore | OutputStore | null;
	key: string | number | null;
}

export type Groups = Record<GroupKey, Group>;

export interface Bounds {
	top: number;
	left: number;
	width: number;
	height: number;
}

export type GroupBoxes = Record<GroupKey, GroupBox>;

export interface GroupBox {
	group: string;
	dimensions: Dimensions;
	position: XYPair;
	color: CSSColorString;
	moving: boolean;
}

export interface Group {
	parent: Node | GroupBox | null;
	nodes: Set<Node | GroupBox>;
}

export interface GraphTransforms {
	translation: XYPair;
	scale: number;
}
