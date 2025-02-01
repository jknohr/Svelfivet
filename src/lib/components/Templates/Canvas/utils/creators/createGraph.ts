import type { Graph, Node, GroupBox, GraphKey, GroupKey, XYPair, GraphDimensions, Groups } from '$lib/components/Templates/Canvas/types';
import { createStore } from './createStore';
import { createEdgeStore } from './createEdgeStore';
import { cursorPosition } from '$lib/components/Templates/Canvas/stores/CursorStore';
import type { NodeKey } from '$lib/components/Templates/Canvas/types';
import { createDerivedCursorStore } from './createDerivedCursoreStore';
import { createBoundsStore } from './createBoundsStore';
import type { GraphConfig } from '$lib/components/Templates/Canvas/types';
import { calculateViewportCenter } from '../calculators/calculateViewPortCenter';

export function createGraph(id: GraphKey, config: GraphConfig): Graph {
	const { zoom = 1, editable, translation: initialTranslation, direction, locked, edge } = config;

	// Initialize state with runes
	const graphState = {
		translation: $state<XYPair>({
			x: initialTranslation?.x ?? 0,
			y: initialTranslation?.y ?? 0
		}),
		dimensions: $state<GraphDimensions>({ 
			top: 0, 
			left: 0, 
			width: 0, 
			height: 0, 
			bottom: 0, 
			right: 0 
		}),
		scale: $state(zoom),
		mounted: $state(false),
		maxZIndex: $state(2),
		editing: $state<Node | null>(null),
		locked: $state(locked || false),
		activeGroup: $state<GroupKey | null>(null),
		initialNodePositions: $state<XYPair[]>([]),
		center: $state<XYPair>({ x: 0, y: 0 }),
		cursor: $state<XYPair>({ x: 0, y: 0 }),
		graphBounds: $state<GraphDimensions>({ left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity, width: 0, height: 0 }),
		nodeBounds: $state<GraphDimensions>({ left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity, width: 0, height: 0 }),
		nodes: createStore<Node, NodeKey>()
	};

	// Create effects to update center and cursor
	$effect(() => {
		graphState.center = calculateViewportCenter(
			graphState.dimensions, 
			graphState.translation, 
			graphState.scale
		);
	});

	$effect(() => {
		const cursorPos = createDerivedCursorStore(
			() => cursorPosition,
			() => graphState.dimensions,
			() => graphState.translation,
			() => graphState.scale
		);
		graphState.cursor = cursorPos;
	});

	const bounds = createBoundsStore(
		graphState.nodes, 
		() => graphState.dimensions, 
		() => graphState.scale, 
		() => graphState.translation
	);

	// Create groups state
	const groups: Groups = {
		selected: {
			parent: $state(null),
			nodes: $state(new Set<Node>())
		},
		hidden: {
			parent: $state(null),
			nodes: $state(new Set<Node>())
		}
	};

	const graph: Graph = {
		id,
		nodes: graphState.nodes,
		edges: createEdgeStore(),
		transforms: {
			translation: graphState.translation,
			scale: graphState.scale
		},
		maxZIndex: graphState.maxZIndex,
		dimensions: graphState.dimensions,
		bounds: {
			graphBounds: graphState.graphBounds as GraphDimensions,
			nodeBounds: graphState.nodeBounds as GraphDimensions,
			recalculateBounds: () => {
				// Recalculate bounds based on current state
				const nodeList = graphState.nodes.getAll();
				if (!nodeList.length) return;
				
				const { left, top, right, bottom } = nodeList.reduce((acc: { left: number; top: number; right: number; bottom: number }, node: Node) => ({
					left: Math.min(acc.left, node.position.x),
					top: Math.min(acc.top, node.position.y),
					right: Math.max(acc.right, node.position.x + node.dimensions.width),
					bottom: Math.max(acc.bottom, node.position.y + node.dimensions.height)
				}), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });

				graphState.nodeBounds = { left, top, right, bottom, width: right - left, height: bottom - top };
				graphState.graphBounds = { ...graphState.nodeBounds };
			}
		},
		center: graphState.center,
		mounted: graphState.mounted,
		direction: direction || 'LR',
		editable: editable || false,
		edge: edge || null,
		editing: graphState.editing,
		cursor: graphState.cursor,
		locked: graphState.locked,
		groups,
		groupBoxes: createStore<GroupBox, GroupKey>(),
		activeGroup: graphState.activeGroup,
		initialNodePositions: graphState.initialNodePositions
	};

	return graph;
}
