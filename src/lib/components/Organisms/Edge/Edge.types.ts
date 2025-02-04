import type {
	Anchor,
	CSSColorString,
	EmValue,
	EdgeKey,
	XYPair,
	Direction,
	Node,
	PixelValue,
	RemValue
} from '$lib/components/Templates/Canvas/types';
import type { CardinalDirection } from '$lib/components/Templates/Canvas/constants/math';
import type { FlowAnimationType } from '$lib/components/Templates/Canvas/types/animation';
import type { SvelteComponent, Snippet } from 'svelte';

export type EdgeStyle = 'bezier' | 'straight' | 'step' | 'subway' | 'horizontal' | 'vertical' | 'dagre' | 'tokyo';
export type EndStyle = 'arrow' | 'none';

export interface EdgeEndpointMetadata {
	id: string;
	type?: string;
	dataType?: string;
	format?: string;
	schema?: Record<string, unknown>;
	validation?: {
		required?: boolean;
		min?: number;
		max?: number;
		pattern?: string;
		custom?: (value: unknown) => boolean;
	};
	transform?: (value: unknown) => unknown;
}

export interface EdgeMetadata {
	id?: string;
	label?: string;
	description?: string;
	tags?: string[];
	// Input/Output metadata
	input?: EdgeEndpointMetadata | EdgeEndpointMetadata[];
	output?: EdgeEndpointMetadata | EdgeEndpointMetadata[];
	// Flow metadata
	flowRate?: number;
	capacity?: number;
	protocol?: string;
	// Timing metadata
	latency?: number;
	updateFrequency?: number;
	lastUpdated?: Date;
	// State metadata
	status?: 'active' | 'inactive' | 'error' | 'pending';
	errorRate?: number;
	healthScore?: number;
	// Version control
	version?: string;
	createdAt?: Date;
	updatedAt?: Date;
	// Custom data
	data?: Record<string, unknown>;
	metrics?: Record<string, number>;
	config?: Record<string, unknown>;
}

export type WritableEdge = {
	id: EdgeKey;
	source: Anchor | CursorAnchor;
	target: Anchor | CursorAnchor;
	type: EdgeStyle | null;
	color: CSSColorString | null;
	width: number;
	label?: EdgeLabel;
	animated: boolean;
	disconnect?: true;
	component: typeof SvelteComponent | null;
	rendered: {
		value: boolean;
		set: (value: boolean) => void;
	};
	start: EndStyle;
	end: EndStyle;
	metadata?: EdgeMetadata;
};

interface CursorNode {
	rotating: boolean;
	position: XYPair;
	dimensions: {
		width: number;
		height: number;
	};
	zIndex: number;
}

export interface CursorAnchor {
	id: null;
	position: XYPair;
	offset: XYPair;
	connected: Set<Anchor>;
	dynamic: boolean;
	edge: null;
	edgeColor: null;
	direction: Direction;
	inputKey: null;
	type: 'output';
	mounted: true;
	moving: boolean;
	store: null;
	rotation: number;
	node: CursorNode;
}

export interface EdgeLabel {
	text: string;
	position?: number;
	color?: CSSColorString;
	textColor?: CSSColorString;
}

export interface EdgeConfig {
	id: string;
	source: Node;
	target: Node;
	style?: EdgeStyle;
	start?: EndStyle;
	end?: EndStyle;
	label?: EdgeLabel;
	color?: CSSColorString;
	width?: number;
	zIndex?: number;
	metadata?: EdgeMetadata;
}

export type StepDirection = 'left' | 'right' | 'up' | 'down';

export type ArcKey = '1001' | '0110' | '100-1' | '0-110' | '-1001' | '0110' | '-100-1' | '0-110';

export type Connections = Array<[string | number, string | number] | string | number | null>;

export type CustomEdgeKey = Set<Anchor | Node> | 'cursor';

export type FlowAnimation = 'none' | 'forward' | 'backward' | 'bidirectional';

export interface EdgeStore {
	subscribe: (subscriber: (value: Map<`E-${string}`, Edge>) => void) => () => void;
	set: (value: Map<`E-${string}`, Edge>) => void;
	update: (updater: (value: Map<`E-${string}`, Edge>) => Map<`E-${string}`, Edge>) => void;
	add(item: Edge, key: `E-${string}`): Map<`E-${string}`, Edge>;
	remove(key: `E-${string}`): void;
	match(...args: Array<Node | Anchor | null>): Array<`E-${string}`>;
	get(key: `E-${string}`): Edge | null;
	clear(): void;
	getAll(): Edge[];
	fetch(...args: Array<Anchor>): Edge | null;
	onEdgeChange(callback: (edge: WritableEdge, type: 'connection' | 'disconnection') => void): void;
}

export interface EdgeProps {
	edge?: WritableEdge;
	straight?: boolean;
	step?: boolean;
	edgeStyle?: EdgeStyle;
	start?: EndStyle;
	end?: EndStyle;
	animate?: boolean;
	enableHover?: boolean;
	edgeClick?: ((event: MouseEvent) => void) | null;
	labelPosition?: number;
	width?: number | null;
	color?: CSSColorString | null;
	labelColor?: CSSColorString | null;
	textColor?: CSSColorString | null;
	cornerRadius?: number;
	targetColor?: CSSColorString | null;
	edgeKey?: string;
	edgeType?: string;
	sourceDynamic?: boolean;
	targetDynamic?: boolean;
	sourceDirection?: CardinalDirection;
	targetDirection?: CardinalDirection;
	sourceRotation?: number;
	targetRotation?: number;
	sourceMoving?: boolean;
	targetMoving?: boolean;
	sourcePosition?: XYPair;
	targetPosition?: XYPair;
	sourceNodePosition?: XYPair;
	targetNodePosition?: XYPair;
	edgeColor?: CSSColorString | null;
	source?: Node | null;
	target?: Node | null;
	flowAnimation?: FlowAnimationType;
	dotSize?: number;
	dotOpacity?: number;
	dotColor?: CSSColorString | null;
	lineWidth?: number | null;
	dynamic?: boolean;
	children?: Snippet;
	labelText?: string;
	labelSnippet?: Snippet<[{
		destroy: () => void;
		hovering: boolean;
	}]>;
}
