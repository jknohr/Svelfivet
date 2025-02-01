import type { SvelteComponent } from 'svelte';
import type { AnchorKey, CSSColorString, Node, XYPair } from '$lib/components/Templates/Canvas/types';
import type { generateOutput } from '$lib/components/Templates/Canvas/utils';
import type { Snippet } from 'svelte';
import type { EdgeStyle } from '$lib/components/Organisms/Edge/Edge.types';
import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';
import type { ElementType } from '$lib/components/Theme/ThemeElements';
import type { Direction } from '../../Templates/Canvas/types';

/**
 * Represents an anchor point in the graph that can connect to other anchors
 */
export interface Anchor {
	id: AnchorKey;
	position: { x: number; y: number };
	offset: XYPair;
	connected: Set<Anchor>;
	dynamic: boolean;
	edge: typeof SvelteComponent | null;
	direction: Direction;
	rotation: number;
	recalculatePosition: () => void;
	type: InputType;
	mounted: boolean;
	inputKey: string | number | null;
	moving: boolean;
	edgeColor: CSSColorString | null;
	store: Record<string, unknown> | ReturnType<typeof generateOutput> | null;
	node: Node;
}

export interface AnchorState {
	isConnecting: boolean;
	isConnected: boolean;
	isHovering: boolean;
	position: XYPair;
	mode: AnchorMode;
	targetType: AnchorTarget;
	glassState: GlassState;
}

export interface AnchorProps {
	bgColor?: CSSColorString | null;
	id?: string | number;
	input?: boolean;
	output?: boolean;
	multiple?: boolean;
	dynamic?: boolean;
	edge?: typeof SvelteComponent | null;
	inputsStore?: Record<string, unknown> | null;
	key?: string | number | null;
	outputStore?: Record<string, unknown> | null;
	connections?: Array<[string | number, string | number] | string | number | null>;
	edgeLabel?: string;
	locked?: boolean;
	nodeConnect?: boolean;
	edgeStyle?: EdgeStyle | null;
	endStyles?: [EndStyle | null, EndStyle | null];
	invisible?: boolean;
	direction?: Direction;
	title?: string;
	children?: Snippet;
	variant?: GlassEffect;
	state?: GlassState;
	glowOnHover?: boolean;
	componentType?: ElementType;
	mode?: AnchorMode;
	targetType?: AnchorTarget;
	targetId?: string;
	targetNode?: Node;
	targetElement?: HTMLElement;
	autoPosition?: boolean;
	offset?: XYPair;
	snapToGrid?: boolean;
	snapThreshold?: number;
}

export interface ConnectingFrom {
	anchor: Anchor;
	node: Node;
	position: { x: number; y: number };
}

export type InputType = 'input' | 'output' | null;

export type EndStyle = 'arrow' | null;

export type AnchorMode = 'diagram' | 'flexible';
export type AnchorTarget = 'node' | 'input' | 'element';

export interface AnchorThemeConfig {
	variant: GlassEffect;
	state: GlassState;
	glowOnHover: boolean;
	componentType: ElementType;
}

export interface AnchorPositionConfig {
	mode: AnchorMode;
	targetType: AnchorTarget;
	targetId: string | null;
	offset: XYPair;
	snapToGrid: boolean;
	snapThreshold: number;
}
