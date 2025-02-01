import type { Dimensions } from '../../types/logic';
import type { NodeStore } from '../../types/stores';
import type { XYPair } from '../../types/logic';
import { tracking, resizing } from '../../stores/CursorStore';
import { calculateRelativeCursor } from '../calculators';

// Update the type to match the dimensions
type GraphDimensions = Dimensions & {
	top: number;
	left: number;
	right: number;
	bottom: number;
};

export function createBoundsStore(
	nodes: NodeStore,
	dimensions: () => GraphDimensions,
	scale: () => number,
	translation: () => XYPair
) {
	// Initialize state with runes
	let graphBounds = $state<GraphDimensions>({
		top: Infinity,
		left: Infinity,
		right: -Infinity,
		bottom: -Infinity,
		width: 0,
		height: 0
	});

	let nodeBounds = $state<GraphDimensions>({
		top: Infinity,
		left: Infinity,
		right: -Infinity,
		bottom: -Infinity,
		width: 0,
		height: 0
	});

	let animationFrame: number;
	let graphDimensions = dimensions();
	let graphScale = scale();
	let graphTranslation = translation();
	let graphWidth = graphDimensions.width / graphScale;
	let graphHeight = graphDimensions.height / graphScale;

	function recalculateBounds() {
		const { x: graphLeft, y: graphTop } = calculateRelativeCursor(
			{ clientX: graphDimensions.left, clientY: graphDimensions.top },
			graphDimensions.top,
			graphDimensions.left,
			graphDimensions.width,
			graphDimensions.height,
			graphScale,
			graphTranslation
		);

		graphBounds = {
			top: Math.min(nodeBounds.top, graphTop),
			left: Math.min(nodeBounds.left, graphLeft),
			right: Math.max(nodeBounds.right, graphLeft + graphWidth),
			bottom: Math.max(nodeBounds.bottom, graphHeight + graphTop),
			width: 0,
			height: 0
		};

		graphBounds.width = graphBounds.right - graphBounds.left;
		graphBounds.height = graphBounds.bottom - graphBounds.top;
	}

	function recalculateNodeBounds(isTracking = false) {
		let newTop = Infinity;
		let newLeft = Infinity;
		let newRight = -Infinity;
		let newBottom = -Infinity;

		for (const node of nodes.getAll()) {
			const { x, y } = node.position;
			const width = node.dimensions.width;
			const height = node.dimensions.height;
			newLeft = Math.min(newLeft, x);
			newTop = Math.min(newTop, y);
			newRight = Math.max(newRight, x + width);
			newBottom = Math.max(newBottom, y + height);
		}

		nodeBounds = {
			top: newTop,
			left: newLeft,
			right: newRight,
			bottom: newBottom,
			width: newRight - newLeft,
			height: newBottom - newTop
		};

		recalculateBounds();
		if (isTracking) animationFrame = requestAnimationFrame(() => recalculateNodeBounds(isTracking));
	}

	// Create effects to watch for changes
	$effect(() => {
		recalculateNodeBounds();
	});

	$effect(() => {
		if (resizing) recalculateNodeBounds(resizing);
		if (!resizing) cancelAnimationFrame(animationFrame);
	});

	$effect(() => {
		if (tracking) recalculateNodeBounds(tracking);
		if (!tracking) cancelAnimationFrame(animationFrame);
	});

	$effect(() => {
		graphDimensions = dimensions();
		graphWidth = graphDimensions.width / graphScale;
		graphHeight = graphDimensions.height / graphScale;
		recalculateBounds();
	});

	$effect(() => {
		graphScale = scale();
		graphWidth = graphDimensions.width / graphScale;
		graphHeight = graphDimensions.height / graphScale;
		recalculateBounds();
	});

	$effect(() => {
		graphTranslation = translation();
		recalculateBounds();
	});

	return { graphBounds, nodeBounds };
}
