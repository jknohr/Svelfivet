import type { SvelteComponent } from 'svelte';
import type {
	Graph,
	GraphConfig,
	Groups,
	GraphTransforms
} from '$lib/components/Templates/Canvas/Graph/Graph.types';
import type { NodeStore, EdgeStore, GroupStore } from '$lib/components/Templates/Canvas/types/stores';
import type { Node, GroupBox, GraphKey, GroupKey, XYPair } from '$lib/components/Templates/Canvas/types/logic';
import type { GraphDimensions } from '$lib/components/Templates/Canvas/Svelvet/Svelvet.types';
import { createStore } from './createStore';
import { createEdgeStore } from './createEdgeStore';
import { cursorPosition } from '$lib/components/Templates/Canvas/stores/CursorStore';
import type { NodeKey } from '$lib/components/Templates/Canvas/types/logic';
import { createDerivedCursorStore } from './createDerivedCursoreStore';
import { createBoundsStore } from './createBoundsStore';
import { calculateViewportCenter } from '../calculators';

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
		nodes: createStore<NodeKey, Node>()
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
		graphState.nodes as NodeStore, 
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
		nodes: graphState.nodes as unknown as NodeStore,
		edges: createEdgeStore() as unknown as EdgeStore,
		transforms: {
			translation: graphState.translation,
			scale: graphState.scale
		} as GraphTransforms,
		maxZIndex: graphState.maxZIndex,
		dimensions: graphState.dimensions,
		bounds: {
			graphBounds: graphState.graphBounds as GraphDimensions,
			nodeBounds: graphState.nodeBounds as GraphDimensions,
			recalculateBounds: () => {
				// Recalculate bounds based on current state
				const nodeList = Array.from(graphState.nodes.items.values());
				if (!nodeList.length) return;
				
				const { left, top, right, bottom } = nodeList.reduce((acc: GraphDimensions, node: Node) => ({
					left: Math.min(acc.left, node.position.x),
					top: Math.min(acc.top, node.position.y),
					right: Math.max(acc.right, node.position.x + node.dimensions.width),
					bottom: Math.max(acc.bottom, node.position.y + node.dimensions.height),
					width: 0,
					height: 0
				}), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity, width: 0, height: 0 });

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
		groupBoxes: createStore<GroupKey, GroupBox>() as unknown as GroupStore,
		activeGroup: graphState.activeGroup,
		initialNodePositions: graphState.initialNodePositions
	};

	return graph;
}
