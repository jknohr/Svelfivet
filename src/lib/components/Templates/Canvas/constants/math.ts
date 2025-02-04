import type { XYPair } from '$lib/components/Templates/Canvas/types';

export type CardinalDirection = 'north' | 'south' | 'east' | 'west' | 'self';

export const directionVectors: Record<CardinalDirection, XYPair> = {
	north: { x: 0, y: -1 },
	south: { x: 0, y: 1 },
	east: { x: 1, y: 0 },
	west: { x: -1, y: 0 },
	self: { x: 0, y: 0 }
};
