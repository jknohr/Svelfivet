import type { Node, Edge, AnchorKey, Direction, Anchor } from '../../types/logic';
import type { Graph } from '../../Graph/Graph.types';
import type { CSSColorString } from '../../types/theme';
import type { XYPair } from '../../types/logic';
import { calculateRelativePosition } from '../calculators';
import { directionVectors } from '../../constants/math';

// Update the type to match the return value of calculateRelativePosition
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
	edge: Edge | null,
	type: 'input' | 'output',
	direction: Direction,
	dynamic?: boolean,
	key?: string | number | null,
	edgeColor?: CSSColorString | null
): Anchor {
	const { width, height } = dimensions;
	const { x, y } = position;

	// Initialize state with runes
	let offset = $state<XYPair>({
		x: x - node.position.x + width / 2,
		y: y - node.position.y + height / 2
	});

	let anchorPosition = $state<XYPair>({
		x: node.position.x + offset.x,
		y: node.position.y + offset.y
	});

	let directionState = $state<Direction>(direction);
	let dynamicState = $state(dynamic || false);
	let mountedState = $state(false);
	let connectedState = $state(new Set<Anchor>());
	let edgeColorState = $state<CSSColorString | null>(edgeColor || null);
	let rotationState = $state(0);

	// Create effects to update position when node moves
	$effect(() => {
		anchorPosition.x = node.position.x + offset.x;
		anchorPosition.y = node.position.y + offset.y;
	});

	// Create effect to update rotation state
	$effect(() => {
		rotationState = node.rotation;
	});

	const recalculatePosition = () => {
		const anchorElement = document.getElementById(id);
		const vector = directionVectors[directionState];

		if (!anchorElement) return;
		const { x, y, width, height } = anchorElement.getBoundingClientRect();

		const { scaled, scale } = calculateRelativePosition(
			graph.bounds.nodeBounds,
			{
				scale: { subscribe: (fn) => { fn(graph.transforms.scale); return () => {} } },
				translation: { subscribe: (fn) => { fn(graph.transforms.translation); return () => {} } }
			},
			{ x, y }
		) as RelativePosition;

		const deltaX = scaled.x - anchorPosition.x;
		const deltaY = scaled.y - anchorPosition.y;

		offset.x += deltaX;
		offset.y += deltaY;
	};

	return {
		id,
		position: anchorPosition,
		offset,
		direction: directionState,
		dynamic: dynamicState,
		type,
		edge,
		node,
		mounted: mountedState,
		recalculatePosition,
		connected: connectedState,
		store: store || null,
		inputKey: key || null,
		edgeColor: edgeColorState,
		rotation: rotationState
	};
}
