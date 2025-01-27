import type { Graph } from '$lib/types';

// This is a work in progress to create a type for the context object

export type ContextKeys = 'snapTo' | 'graph';

export interface ContextValues {
	snapTo: number;
	graph: Graph;
}

export interface ResizeDataContext {
	height: number;
	width: number;
	minWidth: number;
	minHeight: number;
	x: number;
	y: number;
}
