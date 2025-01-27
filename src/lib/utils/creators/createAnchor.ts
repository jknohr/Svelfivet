import type { Anchor, Node, Direction, AnchorKey, Graph } from '$lib/types';
import type { CSSColorString, XYPair } from '$lib/types';
import type { SvelteComponent } from 'svelte';
import { calculateRelativePosition } from '..';
import { directionVectors } from '$lib/constants';

type RelativePosition = {
	scaled: XYPair;
	scale: number;
};

export function createAnchor(
	graph: Graph,
	node: Node,
	id: AnchorKey,
	position: XYPair,
	dimensions: { width: number; height: number },
	store: Anchor['store'],
	edge: typeof SvelteComponent | null,
	type: 'input' | 'output' | null,
	direction?: Direction,
	dynamic?: boolean,
	key?: string | number | null,
	edgeColor?: CSSColorString | null
): Anchor {
	const { width, height } = dimensions;
	const { x, y } = position;

	// Initialize state with runes
	const offset = $state<XYPair>({
		x: x - node.position.x + width / 2,
		y: y - node.position.y + height / 2
	});

	const anchorPosition = $state<XYPair>({
		x: node.position.x + offset.x,
		y: node.position.y + offset.y
	});

	const directionState = $state<Direction>(direction || 'self');
	const dynamicState = $state(dynamic || false);
	const mountedState = $state(false);
	const connectedState = $state(new Set<Anchor>());
	const edgeColorState = $state<CSSColorString | null>(edgeColor || null);

	// Create effects to update position when node moves
	$effect(() => {
		anchorPosition.x = node.position.x + offset.x;
		anchorPosition.y = node.position.y + offset.y;
	});

	const recalculatePosition = () => {
		const anchorElement = document.getElementById(id);
		const vector = directionVectors[directionState];

		if (!anchorElement) return;
		const { x, y, width, height } = anchorElement.getBoundingClientRect();

		const { scaled, scale } = calculateRelativePosition(
			graph.dimensions,
			{
				scale: { subscribe: (fn) => { fn(graph.transforms.scale); return () => {} } },
				translation: { subscribe: (fn) => { fn(graph.transforms.translation); return () => {} } }
			},
			{ x, y }
		) as RelativePosition;

		const deltaX = scaled.x - anchorPosition.x;
		const deltaY = scaled.y - anchorPosition.y;

		offset.x = offset.x + deltaX + width / scale / 2 + (vector.x * width) / scale / 2;
		offset.y = offset.y + deltaY + height / scale / 2 + (vector.y * height) / scale / 2;
	};

	// Moving is derived from whether or not the parent node is moving or resizing
	const moving = $derived(
		node.moving || node.resizingWidth || node.resizingHeight || node.rotating
	);

	const rotation = $derived(node.rotation);

	return {
		id,
		position: anchorPosition,
		offset,
		direction: directionState,
		dynamic: dynamicState,
		type,
		edge,
		moving,
		mounted: mountedState,
		recalculatePosition,
		connected: connectedState,
		store: store || null,
		inputKey: key || null,
		edgeColor: edgeColorState,
		rotation,
		node
	};
}
