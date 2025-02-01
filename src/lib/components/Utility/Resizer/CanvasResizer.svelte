<script lang="ts">
	import { calculateFitContentWidth } from '$lib/components/Theme/utils/layout';
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/components/Templates/Canvas/Graph/Graph.types';
	import type { Node as NodeType } from '$lib/components/Organisms/Node/Node.types';
	import type { XYPair } from '$lib/types/general';
	import type { Writable } from 'svelte/store';
	import { getTheme } from '$lib/components/Theme/theme.store';

	interface ResizerProps {
		width?: boolean;
		height?: boolean;
		rotation?: boolean;
		minHeight?: number;
		minWidth?: number;
	}

	const graph = getContext<Graph>('graph');
	const node = getContext<NodeType>('node');
	const resized = getContext<Writable<boolean>>('resized');

	let { width = false, height = false, rotation = false, minHeight = 0, minWidth = 0 } = $props<ResizerProps>();

	let DOMnode = $state<HTMLElement | null>(null);
	let direction = $state(1);
	let startingRotation = $state(0);
	let initialClickAngle = $state(0);
	let initialNodePosition = $state<XYPair>({ x: 0, y: 0 });
	let initialWidth = $state(0);
	let initialHeight = $state(0);

	let left = $derived(width);
	let right = $derived(width);
	let top = $derived(height);
	let bottom = $derived(height);
	let both = $derived(width && height);

	// Create local state variables
	let nodePosition = $state<XYPair>({ x: 0, y: 0 });
	let nodeRotation = $state(0);
	let nodeDimensions = $state({
		width: 0,
		height: 0
	});

	let isResizingWidth = $state(false);
	let isResizingHeight = $state(false);
	let isRotating = $state(false);
	let isResizing = $state(false);
	let cursorPosition = $state<XYPair>({ x: 0, y: 0 });

	// Keep local state in sync with node properties
	$effect(() => {
		if (!node) return;
		nodePosition = node.position;
		nodeRotation = node.rotation;
		nodeDimensions = node.dimensions;
		cursorPosition = graph.cursor as XYPair;
	});

	let centerPoint = $derived({
		x: nodePosition.x + nodeDimensions.width / 2,
		y: nodePosition.y + nodeDimensions.height / 2
	});

	$effect(() => {
		if (!isResizingHeight || !cursorPosition) return;

		const newHeight = Math.max(
			minHeight,
			initialHeight + (cursorPosition.y - initialNodePosition.y) * direction
		);

		if (newHeight > minHeight) {
			resized.set(true);
			node.dimensions = { ...node.dimensions, height: newHeight };
			nodeDimensions.height = newHeight;
		} else {
			resized.set(false);
		}

		if (direction === -1) {
			const newPos: XYPair = {
				x: initialNodePosition.x,
				y: initialNodePosition.y + cursorPosition.y - initialNodePosition.y
			};
			node.position = newPos;
			nodePosition = newPos;
		}

		if (nodeRotation !== 0) {
			const newPos: XYPair = {
				y: initialNodePosition.y - (newHeight - initialHeight) / 2,
				x: nodePosition.x
			};
			node.position = newPos;
			nodePosition = newPos;
		}
	});

	$effect(() => {
		if (!isResizingWidth || !cursorPosition) return;

		const newWidth = Math.max(
			minWidth,
			initialWidth + (cursorPosition.x - initialNodePosition.x) * direction
		);

		if (newWidth > minWidth) {
			resized.set(true);
			node.dimensions = { ...node.dimensions, width: newWidth };
			nodeDimensions.width = newWidth;
		} else {
			resized.set(false);
		}

		if (direction === -1) {
			const newPos: XYPair = {
				x: initialNodePosition.x + cursorPosition.x - initialNodePosition.x,
				y: initialNodePosition.y
			};
			node.position = newPos;
			nodePosition = newPos;
		}

		if (nodeRotation !== 0) {
			const newPos: XYPair = {
				x: initialNodePosition.x - (newWidth - initialWidth) / 2,
				y: nodePosition.y
			};
			node.position = newPos;
			nodePosition = newPos;
		}
	});

	$effect(() => {
		if (!isRotating) return;
		const newRotation = calculateRotation();
		node.rotation = newRotation;
		nodeRotation = newRotation;
	});

	function resizeHandler(
		node: HTMLElement,
		dimensions: { left?: boolean; right?: boolean; both?: boolean; top?: boolean; bottom?: boolean }
	) {
		const setResize = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			if (dimensions.left || dimensions.top) {
				direction = -1;
			} else {
				direction = 1;
			}

			isResizing = true;
			initialNodePosition = cursorPosition;
			initialWidth = nodeDimensions.width;
			initialHeight = nodeDimensions.height;

			if (dimensions.both) {
				isResizingWidth = true;
			} else {
				isResizingWidth = dimensions.left || dimensions.right || dimensions.both || false;
				isResizingHeight = dimensions.top || dimensions.bottom || dimensions.both || false;
			}

			if (DOMnode) [minWidth, minHeight] = calculateFitContentWidth(DOMnode);
			window.addEventListener('mouseup', removeResize);
		};

		const removeResize = () => {
			isResizingWidth = false;
			isResizingHeight = false;
			isResizing = false;
			window.removeEventListener('mouseup', removeResize);
		};

		node.addEventListener('mousedown', setResize);

		return {
			destroy() {
				node.removeEventListener('mousedown', setResize);
			}
		};
	}

	function rotateHandler(node: HTMLElement) {
		const setRotation = (e: MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();

			startingRotation = nodeRotation;
			initialNodePosition = cursorPosition;

			const initialDeltaX = initialNodePosition.x - centerPoint.x;
			const initialDeltaY = initialNodePosition.y - centerPoint.y;
			initialClickAngle = Math.atan2(initialDeltaY, initialDeltaX);

			isRotating = true;
			window.addEventListener('mouseup', removeRotation);
		};

		const removeRotation = () => {
			isRotating = false;
			window.removeEventListener('mouseup', removeRotation);
		};

		node.addEventListener('mousedown', setRotation);

		return {
			destroy() {
				node.removeEventListener('mousedown', setRotation);
			}
		};
	}

	function calculateRotation() {
		const currentDeltaX = cursorPosition.x - centerPoint.x;
		const currentDeltaY = cursorPosition.y - centerPoint.y;

		const currentAngle = Math.atan2(currentDeltaY, currentDeltaX);
		const angleDifference = initialClickAngle - currentAngle;
		const newAngle = startingRotation - radiansToDegrees(angleDifference);
		return newAngle;
	}

	function radiansToDegrees(radians: number) {
		return radians * (180 / Math.PI);
	}

	$effect(() => {
		if (!DOMnode) return;
		const theme = getTheme();
		const [newMinWidth, newMinHeight] = calculateFitContentWidth(DOMnode, theme);
		minWidth = newMinWidth;
		minHeight = newMinHeight;
		if (nodeDimensions.width < minWidth) resized.set(false);
		if (nodeDimensions.height < minHeight) resized.set(false);
	});
</script>

<div bind:this={DOMnode}>
	{#if width}
		<div 
			use:resizeHandler={{ left }} 
			class:width 
			class="left" 
			role="button"
			aria-label="Resize width from left"
			tabindex="0"
		></div>
		<div 
			use:resizeHandler={{ right }} 
			class:width 
			class="right"
			role="button"
			aria-label="Resize width from right"
			tabindex="0"
		></div>
	{/if}

	{#if height}
		<div 
			use:resizeHandler={{ top }} 
			class:height 
			class="top"
			role="button"
			aria-label="Resize height from top"
			tabindex="0"
		></div>
		<div 
			use:resizeHandler={{ bottom }} 
			class:height 
			class="bottom"
			role="button"
			aria-label="Resize height from bottom"
			tabindex="0"
		></div>
	{/if}

	{#if both}
		<div 
			use:resizeHandler={{ both }} 
			class:both
			role="button"
			aria-label="Resize both width and height"
			tabindex="0"
		></div>
	{/if}

	{#if rotation}
		<div 
			use:rotateHandler 
			class:rotation
			role="button"
			aria-label="Rotate element"
			tabindex="0"
		></div>
	{/if}
</div>

<style>
	* {
		position: absolute;
		width: 9px;
		height: 9px;
		z-index: 0;
		pointer-events: auto;
	}

	.width {
		height: calc(100% - 3px);
		top: -3px;
		cursor: col-resize;
	}

	.left {
		left: -3px;
	}
	.right {
		right: -3px;
	}
	.height {
		width: calc(100% - 3px);
		left: -3px;
		cursor: row-resize;
	}

	.top {
		top: -3px;
	}
	.bottom {
		bottom: -3px;
	}
	.both {
		bottom: -3px;
		right: -3px;
		cursor: nwse-resize;
	}
	.rotation {
		top: -3px;
		left: -3px;
		cursor: crosshair;
	}
</style>
