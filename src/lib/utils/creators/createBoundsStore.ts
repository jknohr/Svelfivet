import type { GraphDimensions, NodeStore, XYPair } from '$lib/types';
import { tracking, resizing } from '$lib/stores/CursorStore';
import { calculateRelativeCursor } from '../calculators';

export function createBoundsStore(
	nodes: NodeStore,
	dimensions: () => GraphDimensions,
	scale: () => number,
	translation: () => XYPair
) {
	// Initialize state with runes
	let graphBounds = $state({
		top: Infinity,
		left: Infinity,
		right: -Infinity,
		bottom: -Infinity
	});

	let nodeBounds = $state({
		top: Infinity,
		left: Infinity,
		right: -Infinity,
		bottom: -Infinity
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
			bottom: Math.max(nodeBounds.bottom, graphHeight + graphTop)
		};
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

		nodeBounds = { top: newTop, left: newLeft, right: newRight, bottom: newBottom };
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
