import type { CSSColorString, UnifiedThemeContext } from './theme';
import type { Store } from './index';

// General Types
export type XYPair = { x: number; y: number };
export type Dimensions = { width: number; height: number };
export type Direction = 'LR' | 'RL' | 'TB' | 'BT' | 'TD' | 'BU';
export type ElementType = 'node' | 'edge' | 'group' | 'anchor';
export type ActionType = 'add' | 'remove' | 'update' | 'move' | 'resize' | 'rotate';

// Key Types
export type NodeKey = `N-${string}`;
export type EdgeKey = `E-${string}`;
export type AnchorKey = `A-${string}`;
export type GraphKey = `G-${string}`;
export type GroupKey = `GR-${string}`;

// Core Data Structures
export interface Node {
    id: NodeKey;
    label: string;
    position: XYPair;
    dimensions: Dimensions;
    moving: boolean;
    inputs: number;
    outputs: number;
    anchors: Store<Anchor, AnchorKey>;
    group: GroupKey | null;
    collapsed: boolean;
    resizingWidth: boolean;
    resizingHeight: boolean;
    rotating: boolean;
    editable: boolean;
    locked: boolean;
    resizable: boolean;
    zIndex: number;
    edge: Edge | null;
    direction: Direction;
    borderRadius: number;
    borderWidth: number;
    connections: Connection[];
    bgColor: CSSColorString | null;
    borderColor: CSSColorString | null;
    selectionColor: CSSColorString | null;
    textColor: CSSColorString | null;
    rotation: number;
    children?: Node[];
    internalTree?: Node[];
    expanded?: boolean;
    level?: number;
    metadata?: Record<string, unknown>;
}

export interface Edge {
    id: EdgeKey;
    source: Anchor;
    target: Anchor;
    label?: string;
    points?: XYPair[];
    color?: CSSColorString;
    width?: number;
    style?: string;
    animated?: boolean;
    bidirectional?: boolean;
    selected?: boolean;
    metadata?: Record<string, unknown>;
}

export interface Anchor {
    id: AnchorKey;
    node: Node;
    type: 'input' | 'output';
    position: XYPair;
    offset: XYPair;
    direction: Direction;
    dynamic: boolean;
    mounted: boolean;
    connected: Set<Anchor>;
    store: Store<unknown, unknown> | null;
    edge: Edge | null;
    inputKey: string | number | null;
    edgeColor: CSSColorString | null;
    rotation: number;
    recalculatePosition: () => void;
}

export interface GroupBox {
    id: GroupKey;
    label: string;
    position: XYPair;
    dimensions: Dimensions;
    nodes: Set<NodeKey>;
    color?: CSSColorString;
    borderColor?: CSSColorString;
    textColor?: CSSColorString;
    metadata?: Record<string, unknown>;
}

export interface Graph {
    id: GraphKey;
    nodes: Map<NodeKey, Node>;
    edges: Map<EdgeKey, Edge>;
    groups: Map<GroupKey, GroupBox>;
    transforms: {
        scale: number;
        translation: XYPair;
    };
    label?: string;
    description?: string;
    metadata?: Record<string, unknown>;
}

export interface Connection {
    source: AnchorKey;
    target: AnchorKey;
    edge: EdgeKey;
    metadata?: Record<string, unknown>;
}

// Event Types
export interface NodeEvent {
    node: Node;
    position?: XYPair;
    dimensions?: Dimensions;
    type?: ActionType;
    metadata?: Record<string, unknown>;
}

export interface EdgeEvent {
    edge: Edge;
    source?: Anchor;
    target?: Anchor;
    type?: ActionType;
    metadata?: Record<string, unknown>;
}

export interface GroupEvent {
    group: GroupBox;
    nodes?: Node[];
    type?: ActionType;
    metadata?: Record<string, unknown>;
}

export interface GraphEvent {
    graph: Graph;
    type: ActionType;
    metadata?: Record<string, unknown>;
}

export interface ViewportEvent {
    scale: number;
    translation: XYPair;
    type?: 'zoom' | 'pan' | 'reset';
    metadata?: Record<string, unknown>;
}

// Parser Types
export interface ParsedNode {
    id: NodeKey;
    label: string;
    position: XYPair;
    dimensions: Dimensions;
    inputs: number;
    outputs: number;
    properties?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface ParsedEdge {
    id: EdgeKey;
    source: AnchorKey;
    target: AnchorKey;
    properties?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface ParsedGraph {
    nodes: ParsedNode[];
    edges: ParsedEdge[];
    groups?: GroupBox[];
    metadata?: Record<string, unknown>;
}

// Props Types
export interface NodeProps {
    node: Node;
    selected?: boolean;
    theme?: UnifiedThemeContext;
    onMove?: (event: NodeEvent) => void;
    onResize?: (event: NodeEvent) => void;
    onRotate?: (event: NodeEvent) => void;
    onEdit?: (node: Node) => void;
    onDelete?: (node: Node) => void;
    onConnect?: (source: Anchor, target: Anchor) => void;
    onDisconnect?: (source: Anchor, target: Anchor) => void;
}

export interface EdgeProps {
    edge: Edge;
    selected?: boolean;
    theme?: UnifiedThemeContext;
    onEdit?: (edge: Edge) => void;
    onDelete?: (edge: Edge) => void;
    onSelect?: (edge: Edge) => void;
}

export interface GroupProps {
    group: GroupBox;
    selected?: boolean;
    theme?: UnifiedThemeContext;
    onMove?: (event: GroupEvent) => void;
    onResize?: (event: GroupEvent) => void;
    onEdit?: (group: GroupBox) => void;
    onDelete?: (group: GroupBox) => void;
    onSelect?: (group: GroupBox) => void;
}

export interface GraphProps {
    graph: Graph;
    theme?: UnifiedThemeContext;
    onNodeAdd?: (node: Node) => void;
    onNodeRemove?: (node: Node) => void;
    onEdgeAdd?: (edge: Edge) => void;
    onEdgeRemove?: (edge: Edge) => void;
    onGroupAdd?: (group: GroupBox) => void;
    onGroupRemove?: (group: GroupBox) => void;
    onViewportChange?: (event: ViewportEvent) => void;
}

// State Types
export interface ConnectingFrom {
    node: Node;
    anchor: Anchor;
}

export interface Selection {
    nodes: Set<NodeKey>;
    edges: Set<EdgeKey>;
    groups: Set<GroupKey>;
}

export interface Viewport {
    scale: number;
    translation: XYPair;
    dimensions: Dimensions;
    isDragging: boolean;
    isPanning: boolean;
}

// Tree Types
export interface TreeNode extends Node {
    children?: TreeNode[];
    internalTree?: TreeNode[];
    expanded?: boolean;
    level?: number;
    parent?: TreeNode;
} 