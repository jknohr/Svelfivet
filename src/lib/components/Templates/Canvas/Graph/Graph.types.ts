import type { Anchor } from '$lib/components/Atoms/Anchor/Anchor.types';
import type { WritableEdge } from '$lib/components/Organisms/Edge/Edge.types';
import type { Node } from '$lib/components/Organisms/Node/Node.types';
import type { InputStore, OutputStore, GraphDimensions } from '$lib/components/Templates/Canvas/types/storage';
import type { GroupStore, EdgeStore, NodeStore } from '$lib/components/Templates/Canvas/types/stores';
import type { GraphKey, GroupKey, XYPair } from '$lib/components/Templates/Canvas/types/logic';
import type { UnifiedThemeContext, CSSColorString } from '$lib/components/Templates/Canvas/types/theme';
import type { Dimensions } from '$lib/components/Organisms/FlowChart/FlowChart.types';

export interface GraphTransforms {
	translation: XYPair;
	scale: number;
}

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
	edge: any | null; // Component reference
	groupBoxes: GroupBoxes;
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
	theme?: UnifiedThemeContext;
	translation?: XYPair;
	edge?: any; // Component reference
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
	toggleComponent: any | null; // Component reference
	minimapComponent: any | null; // Component reference
	controlsComponent: any | null; // Component reference
	drawerComponent: any | null; // Component reference
	contrastComponent: any | null; // Component reference
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
