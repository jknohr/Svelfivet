import type {
	Anchor,
	CSSColorString,
	EmValue,
	EdgeKey,
	XYPair,
	Direction,
	Node
} from '.';
import type { PixelValue, RemValue } from '.';
import type { SvelteComponent } from 'svelte';

export type EdgeStyle = 'straight' | 'step' | 'bezier' | 'subway' | 'horizontal' | 'vertical' | 'dagre' | 'tokyo';
export type EndStyle = 'arrow' | null;

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
	rendered: boolean;
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
	color: CSSColorString;
	textColor: CSSColorString;
	fontSize: PixelValue | RemValue | EmValue;
	dimensions: {
		width: number;
		height: number;
	};
	borderRadius: number;
}

export interface EdgeConfig {
	type?: EdgeStyle;
	color?: CSSColorString | null;
	width?: number;
	label?: EdgeLabelConfig;
	animated?: boolean;
	disconnect?: true;
	raiseEdges?: boolean;
	edgesAbove?: boolean;
	start?: EndStyle;
	end?: EndStyle;
	metadata?: EdgeMetadata;
}

export interface EdgeLabelConfig {
	text: string;
	color?: CSSColorString;
	textColor?: CSSColorString;
	fontSize?: PixelValue | RemValue;
	dimensions?: {
		width: number;
		height: number;
	};
	borderRadius?: number;
}

export type StepDirection = 'left' | 'right' | 'up' | 'down';

export type ArcKey = '1001' | '0110' | '100-1' | '0-110' | '-1001' | '0110' | '-100-1' | '0-110';

export type Connections = Array<[string | number, string | number] | string | number | null>;

export type CustomEdgeKey = Set<Anchor | Node> | 'cursor';
