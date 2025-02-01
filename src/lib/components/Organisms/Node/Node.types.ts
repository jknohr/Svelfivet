import type { SvelteComponent, Snippet } from 'svelte';
import type { XYPair, CSSColorString, Direction, Dimensions } from '$lib/components/Templates/Canvas/types';
import type { Anchor } from '$lib/components/Atoms/Anchor/Anchor.types';
import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';
import type { ElementType } from '$lib/components/Theme/ThemeElements';

/**
 * Type aliases for better semantic meaning in the graph system
 */
export type NodeKey = `node:${string}`; // Unique identifier for nodes
export type GroupKey = `group:${string}`; // Unique identifier for node groups
export type NodeVariant = GlassEffect;
export type NodeState = GlassState;
export type NodeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Core Node interface representing a node in the graph
 * Contains all properties and state needed for node functionality
 */
export interface Node {
	// Core Properties
	/** Unique identifier for the node */
	id: NodeKey;
	/** Current rotation angle in degrees */
	rotation: number;
	/** Position coordinates in the graph */
	position: XYPair;
	/** Width and height dimensions */
	dimensions: Dimensions;
	/** Optional text label for the node */
	label?: string;
	/** Node title */
	title?: string;
	/** Whether node is selected */
	selected?: boolean;
	/** Whether node has a header */
	header?: boolean;

	// Layout & Structure
	/** Layout direction (Top-Down or Left-Right) */
	direction?: 'TD' | 'LR';
	/** Top-down layout enabled */
	TD?: boolean;
	/** Left-right layout enabled */
	LR?: boolean;
	/** Center in view */
	center?: boolean;
	/** Dynamic sizing enabled */
	dynamic?: boolean;
	/** Z-index for stacking order */
	zIndex: number;

	// Visual Properties
	/** Text color (CSS color string) */
	textColor?: CSSColorString;
	/** Background color (CSS color string) */
	bgColor?: CSSColorString;
	/** Border radius in pixels */
	borderRadius?: number;
	/** Border width in pixels */
	borderWidth?: number;
	/** Border color (CSS color string) */
	borderColor?: CSSColorString | null;
	/** Selection highlight color */
	selectionColor?: CSSColorString | null;

	// Interaction Properties
	/** Number of input anchors */
	inputs?: number;
	/** Number of output anchors */
	outputs?: number;
	/** Whether the node can be resized */
	resizable?: boolean;


	/** Whether the node is currently being moved */
	moving?: boolean;
	/** Map of anchor points */
	anchors?: Map<string, Anchor>;
	/** Group this node belongs to */
	group?: GroupKey | null;

	/** Whether width is being resized */
	resizingWidth?: boolean;
	/** Whether height is being resized */
	resizingHeight?: boolean;
	/** Whether rotation is being adjusted */
	rotating?: boolean;
	/** Whether the node content is editable */
	editable?: boolean;
	/** Whether the node is locked from movement */
	locked?: boolean;
	/** Z-index for stacking order */

	/** Component to render for this node */
	edge?: typeof SvelteComponent | null;

	// Tree Structure
	/** Whether the node is collapsed (for tree views) */
	collapsed?: boolean;
	/** Whether the node is expanded in tree view */
	expanded?: boolean;
	/** Child nodes in tree structure */
	children?: Node[];
	/** Internal tree structure */
	internalTree?: Node[];
	/** Depth level in tree */
	level?: number;
	/** Ordering index */
	order?: number;
	/** Parent node reference */
	parent?: NodeKey;
}

/**
 * Props interface for Node components
 * Defines all possible properties that can be passed to a node component
 */
export interface NodeProps {
	/** Node instance */
	node?: Node;
	/** Content snippet */
	nodeContent?: Snippet;
	/** Drop behavior */
	drop?: 'cursor' | 'center';
	edge?: typeof SvelteComponent;
	connections?: any[];
	title?: string;
	bgColor?: CSSColorString;
	borderColor?: CSSColorString;
	label?: string;
	width?: number;
	height?: number;
	dimensions?: { width: number; height: number };
	id?: string;
	borderRadius?: number;
	borderWidth?: number;
	position?: { x: number; y: number };
	component?: any;
	style?: Record<string, string>;
	class?: string;
	draggable?: boolean;
	selectable?: boolean;
	deletable?: boolean;
	resizable?: boolean;
	connectable?: boolean;
	data?: Record<string, any>;
	children?: any;
}

/**
 * Configuration interface for node creation
 * Used when creating new nodes programmatically
 */
export interface NodeConfig extends Omit<Partial<Node>, 'id'> {
	/** Node identifier */
	id?: string | number;
	/** Initial position */
	position: XYPair;
	/** Initial dimensions */
	dimensions?: Dimensions;
	/** Additional properties */
	props?: Record<string, unknown>;
}

/**
 * Base interface for node events
 */
export interface NodeEvent {
	node: Node;
	event: MouseEvent | TouchEvent;
}

/** Event type for node clicks */
export interface NodeClickEvent extends NodeEvent {}

/** Event type for node release */
export interface NodeReleaseEvent extends NodeEvent {}

/** Event type for node dragging */
export interface NodeDragEvent extends NodeEvent {
	delta: XYPair;
}
