import type { Node, NodeConfig, Anchor, AnchorKey, NodeKey, Direction, CSSColorString } from '$lib/types';
import { createStore } from './createStore';

export function createNode(userNode: NodeConfig): Node {
	const {
		id,
		inputs = 0,
		outputs = 0,
		resizable = false,
		dimensions,
		width,
		height,
		editable,
		direction = 'TD',
		zIndex,
		position,
		selectionColor = null,
		borderWidth = 0,
		edge,
		label = '',
		bgColor = null,
		borderColor = null,
		rotation = 0,
		borderRadius = 0,
		connections = [],
		textColor = null,
		locked = false,
		group = null
	} = userNode;

	const anchorStore = createStore<Anchor, AnchorKey>();

	const recalculateAnchors = (direction: Direction = 'self') => {
		anchorStore.getAll().forEach((anchor) => {
			if (direction === 'self' || anchor.direction === direction) {
				anchor.recalculatePosition();
			}
		});
	};

	const nodeKey: NodeKey = typeof id === 'string' && id.slice(0, 2) === 'N-' ? (id as NodeKey) : `N-${id}`;

	// Initialize state with runes
	const nodeState = {
		position: $state({
			x: position?.x || 0,
			y: position?.y || 0
		}),
		dimensions: {
			width: $state(width || dimensions?.width || 200),
			height: $state(height || dimensions?.height || dimensions?.width || 100)
		},
		group: $state(group),
		locked: $state(locked),
		inputs: $state(inputs),
		outputs: $state(outputs),
		rotation: $state(rotation),
		moving: $state(false),
		resizingWidth: $state(false),
		resizingHeight: $state(false),
		rotating: $state(false),
		editable: $state(editable || false),
		resizable: $state(resizable),
		zIndex: $state(zIndex || 2),
		collapsed: $state(false),
		borderRadius: $state(borderRadius),
		bgColor: $state<CSSColorString | null>(bgColor),
		direction: $state(direction),
		label: $state(label),
		borderColor: $state<CSSColorString | null>(borderColor),
		borderWidth: $state(borderWidth),
		selectionColor: $state<CSSColorString | null>(selectionColor),
		textColor: $state<CSSColorString | null>(textColor),
		connections: $state(connections)
	};

	const newNode: Node = {
		id: nodeKey,
		...nodeState,
		recalculateAnchors,
		anchors: anchorStore,
		edge: edge || null
	};

	return newNode;
}
