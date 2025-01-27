import type { SvelteComponent } from 'svelte';
import type { AnchorKey, CSSColorString, Node, XYPair } from '$lib/types';
import type { generateOutput } from '$lib/utils';

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

export type Direction = 'north' | 'south' | 'east' | 'west' | 'self';

export type InputType = 'input' | 'output' | null;
