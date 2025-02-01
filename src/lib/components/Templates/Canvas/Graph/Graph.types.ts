import type { SvelteComponent } from 'svelte';
import type {
	GraphKey,
	NodeStore,
	Node,
	GroupBoxStore,
	EdgeStore,
	GroupKey,
	Anchor,
	InputStore,
	OutputStore
} from '$lib/components/Templates/Canvas/types/graph';
import type { Theme, GraphDimensions, XYPair, CSSColorString } from '$lib/components/Templates/Canvas/types/general';
import type { Dimensions } from '$lib/components/Organisms/FlowChart/FlowChart.types';
import type { createBoundsStore } from '$lib/components/Templates/Canvas/utils/creators/createBoundsStore';

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

export interface GraphStateType {
	animationFrameId: number;
	initialDistance: number;
	initialScale: number;
	anchor: { x: number; y: number; top: number; left: number };
	selecting: boolean;
	creating: boolean;
	adding: boolean;
	isMovable: boolean;
	pinching: boolean;
	initialFit: boolean;
	graphDimensions: GraphDimensions | null;
	graphDOMElement: HTMLElement | null;
	toggleComponent: typeof SvelteComponent | null;
	minimapComponent: typeof SvelteComponent | null;
	controlsComponent: typeof SvelteComponent | null;
	drawerComponent: typeof SvelteComponent | null;
	contrastComponent: typeof SvelteComponent | null;
	duplicate: boolean;
	mounted: number;
	selectedNodes: Set<Node>;
	activeGroup: string | null;
	initialNodePositions: XYPair[];
	initialClickPosition: XYPair;
	tracking: boolean;
	cursor: XYPair;
	scale: number;
	translation: XYPair;
	groups: Groups;
	groupBoxes: GroupBoxes;
	editing: Node | null;
	nodeBounds: GraphDimensions & { id: string };
}
