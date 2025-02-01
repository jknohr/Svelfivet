<!--
@component
Internal node component that handles complex node interactions and nested structures.

Features:
- Support for nested node hierarchies
- Dynamic dimension calculations
- Group management
- Advanced event handling
- State management for selections
- Z-index management
- Touch and mouse interaction support
- Automatic position constraints

Usage:
```svelte
<InternalNode
  node={nodeData}
  width={200}
  height={150}
  locked={false}
  title="Internal Node"
  selected={false}
/>
```

Props:
- node: Node - Node data object (required)
- width: number - Initial width in pixels
- height: number - Initial height in pixels
- locked: boolean - Whether node is locked
- title: string - Node title
- selected: boolean - Whether node is selected
- grabHandleProp: Function - Custom grab handle implementation

Events:
- nodeClicked: Fired when node is clicked
- nodeReleased: Fired when node is released
- duplicate: Fired when node is duplicated

Internal State:
- position: Current node position
- dimensions: Current node dimensions
- zIndex: Current stacking order
- selected: Whether node is currently selected
- moving: Whether node is being moved
-->

<script lang="ts">
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { initialClickPosition, tracking } from '$lib/components/Templates/Canvas/stores';
	import { captureGroup } from '$lib/utils';
	import type { Node, Graph, GroupKey, Group } from '$lib/types';
	
	interface NodeDimensions {
		width: number;
		height: number;
	}

	const calculateNodeDimensions = (nodes: Element[], options: { margin: number; padding: number }): NodeDimensions => {
		const { margin, padding } = options;
		let maxWidth = 0;
		let totalHeight = 0;
	
		nodes.forEach(node => {
			const rect = node.getBoundingClientRect();
			maxWidth = Math.max(maxWidth, rect.width);
			totalHeight += rect.height + padding;
		});
		
		return {
			width: maxWidth + margin * 2,
			height: Math.max(0, totalHeight - padding) + margin * 2
		};
	};

	const tagsToIgnore = new Set(['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA']);

	interface Props {
		node: Node;
		width?: number;
		height?: number;
		locked?: boolean;
		title?: string;
		selected?: boolean;
		grabHandleProp?: (node: HTMLElement) => { destroy: () => void };
	}

	let { 
		node, 
		width = 200, 
		height = 200, 
		locked = false, 
		title = '', 
		selected = false,
		grabHandleProp 
	} = $props<Props>();

	// Validate required props and context
	if (!node) {
		throw new Error('Node prop is required');
	}

	// Get context
	const groups = getContext<Record<GroupKey, Group>>('groups');

	if (!groups) {
		throw new Error('Groups context is required');
	}

	// Add type check for edge name
	let isDefault = $derived(() => {
		if (!node) return true;
		if (!node.edge) return true;
		return node.edge.name === 'DefaultNode';
	});

	const { selected: selectedNodeGroup, hidden: hiddenNodesGroup } = groups;
	let hiddenNodes = $state(hiddenNodesGroup.nodes);
	let selectedNodes = $state(selectedNodeGroup.nodes);
	let position = $state({ x: node.position?.x ?? 0, y: node.position?.y ?? 0 });
	let dimensions = $state({ width: node.dimensions?.width ?? width, height: node.dimensions?.height ?? height });
	let zIndex = $state(node.zIndex ?? 0);
	let cursor = $state({ x: 0, y: 0 });
	let maxZIndex = $state(0);
	let mounted = $state(0);
	let resized = $state(false);
	let dimensionsProvided = $state(false);
	let anchorsMounted = $state(false);
	let nodeConnectEvent = $state<MouseEvent | null>(null);
	let editing = $state<Node | null>(null);
	let activeGroup = $state<GroupKey>('selected');
	let initialNodePositions = $state(new Map());
	let duplicate = $state(false);
	let center = $state(false);
	let centerPoint = $state({ x: 0, y: 0 });
	let graphDOMElement = $state<HTMLElement | null>(null);
	let nodeStore = $state(new Map());
	let initialClickPos = $state({ x: 0, y: 0 });
	let isTracking = $state(false);

	let state = $derived({
		actualPosition: position,
		selected: selectedNodes.has(node),
		hidden: hiddenNodes.has(node),
		fixedSizing: dimensionsProvided || resized
	});

	$effect(() => {
		if (state.selected && duplicate) {
			dispatchEvent(new CustomEvent('duplicate', { detail: node }));
		}
	});

	// Set contexts after state is initialized
	setContext('anchorsMounted', anchorsMounted);
	setContext('resized', resized);
	setContext('nodeConnectEvent', nodeConnectEvent);
		
	onMount(() => {
		if (center) {
			const opticalCenter = {
				x: centerPoint.x - dimensions.width / 2,
				y: centerPoint.y - dimensions.height / 2
			};
			position = opticalCenter;
			isTracking = true;
			isTracking = false;
		}
		mounted++;
	});

	$effect(() => {
		if (state.selected) {
			selectedNodes.delete(node);
			selectedNodes = selectedNodes;
		}
		return () => mounted--;
	});

	function toggleSelected() {
		if (state.selected) {
			selectedNodes.delete(node);
			selectedNodes = selectedNodes;
		} else {
			selectedNodes.add(node);
			selectedNodes = selectedNodes;
		}
	}

	function handleNodeClicked(e: MouseEvent | TouchEvent) {
		initialClickPos = cursor;

		if (graphDOMElement) graphDOMElement.focus();

		if (zIndex !== maxZIndex && zIndex !== Infinity) zIndex = ++maxZIndex;
		
		const targetElement = e.target as HTMLElement;
		if (tagsToIgnore.has(targetElement.tagName)) return;

		e.preventDefault();

		dispatchEvent(new CustomEvent('nodeClicked', { detail: { node, e } }));

		if (locked) return;

		if ('touches' in e) {
			if (e.touches && e.touches.length > 1) return;
		} else {
			if (e.button === 2) {
				editing = node;
			}
		}
		isTracking = true;

		nodeSelectLogic(e);
	}

	function nodeSelectLogic(e: MouseEvent | TouchEvent) {
		let groupData: Group;
		let parent;
		let isParent = false;

		const nodeGroup: GroupKey | null = group;

		if (nodeGroup) {
			groupData = groups[nodeGroup];
			parent = groupData.parent;
			isParent = parent === node;
		}
		if (isParent) {
			activeGroup = nodeGroup;
		} else {
			activeGroup = 'selected';
		}

		if (!e.shiftKey && state.selected) {
			activeGroup = 'selected';
		} else {
			if (!e.shiftKey && !state.selected && !e.shiftKey) {
				selectedNodes.clear();
				selectedNodes = selectedNodes;
			}

			toggleSelected();
		}

		initialNodePositions = captureGroup(groups['selected'].nodes);
	}

	function destroy() {
		nodeStore.delete(id);
	}

	function onMouseUp(e: MouseEvent) {
		const cursorPosition = cursor;
		const mouseDeltaX = cursorPosition.x - initialClickPos.x;
		const mouseDeltaY = cursorPosition.y - initialClickPos.y;
		const combinedDelta = Math.abs(mouseDeltaX) + Math.abs(mouseDeltaY);
		if (combinedDelta < 4) dispatchEvent(new CustomEvent('nodeReleased', { detail: { e, node } }));

		nodeConnectEvent = e;
	}

	function createGrabHandle(element: HTMLElement) {
		element.addEventListener('mousedown', handleNodeClicked);
		element.addEventListener('touchstart', handleNodeClicked);
		return {
			destroy() {
				element.removeEventListener('mousedown', handleNodeClicked);
				element.removeEventListener('touchstart', handleNodeClicked);
			}
		};
	}

	// Handle edge cases for node selection and movement
	$effect(() => {
		if (position.x < 0) {
			position.x = 0;
		}
		if (position.y < 0) {
			position.y = 0;
		}
		if (position.x > window.innerWidth - widthStore) {
			position.x = window.innerWidth - widthStore;
		}
		if (position.y > window.innerHeight - heightStore) {
			position.y = window.innerHeight - heightStore;
		}
	});

	let graph = $state(getContext<Graph>('graph'));
	let container = $state<HTMLDivElement | null>(null);
	let internalNodes = $state<Node[]>([]);
	
	// Constants for margins and padding
	const INTERNAL_MARGIN = 20; // Margin between internal nodes and parent edges
	const NODE_PADDING = 10;    // Padding between internal nodes
	const INTERNAL_Z_OFFSET = 10; // Z-index offset for internal nodes

	// Track internal node dimensions and update parent size
	$effect(() => {
		if (!container || !node) return;
		
		// Get all child nodes
		const childNodes = Array.from(container.children)
			.filter(child => child.classList.contains('node'));
			
		// Calculate total dimensions needed
		const dims = calculateNodeDimensions(childNodes, {
			margin: INTERNAL_MARGIN,
			padding: NODE_PADDING
		});
		
		// Update parent node size if needed
		if (!dimensionsProvided) {
			dimensions.set({
				width: dims.width + (INTERNAL_MARGIN * 2),
				height: dims.height + (INTERNAL_MARGIN * 2)
			});
		}
	});

	// Handle node selection
	function handleNodeClick(event: MouseEvent) {
		if (locked) return;
		selected = !selected;
		const detail = { node, event };
		container?.dispatchEvent(new CustomEvent('nodeClicked', { detail }));
	}

	let nodeContent: Snippet<[{
		fixedSizing: boolean;
		width?: number;
		height?: number;
		grabHandle?: any;
		selected?: boolean;
		destroy?: () => void;
		children?: any;
	}]>;

	let anchor: Snippet<[string]>;

	// Base units in pixels
	const BASE = {
		UNIT: 8,
		XXS: 2,    // 0.25 * BASE_UNIT
		XS: 3,     // ~0.382 * BASE_UNIT
		S: 5,      // ~0.618 * BASE_UNIT
		M: 8,      // 1.0 * BASE_UNIT
		L: 13,     // ~1.618 * BASE_UNIT
		XL: 21,    // ~2.618 * BASE_UNIT
		XXL: 34    // ~4.236 * BASE_UNIT
	} satisfies Record<string, number>;

	// Dynamic spacing calculation based on node size
	let nodeScale = $derived(() => {
		const size = Math.min(dimensions.width, dimensions.height);
		return Math.max(0.8, Math.min(1.5, Math.log10(size / 100) + 1));
	});

	// Calculate measurements using numeric constants
	let gridGap = $derived(Number(BASE.M) * Number(nodeScale));
	let nodePadding = $derived(Number(BASE.L) * Number(nodeScale));
	let contentMargin = $derived(Number(BASE.XL) * Number(nodeScale));
	
	// Corner radius scaling
	let baseRadius = $derived(Number(BASE.M) * Number(nodeScale));
	let nodeRadius = $derived(Number(BASE.L) * Number(nodeScale));    // Larger radius for nodes
	let inputRadius = $derived(Number(BASE.M) * Number(nodeScale));   // Medium radius for inputs
	let buttonRadius = $derived(Number(BASE.S) * Number(nodeScale));  // Smaller radius for buttons
	
	// Grid configuration
	let gridConfig = $derived(() => {
		const minColWidth = Math.max(150, dimensions.width * 0.2);
		return {
			columns: Math.max(1, Math.floor(dimensions.width / minColWidth)),
		gap: gridGap
		};
	});

	export default InternalNode;
</script>

interface NodeContent {
	grabHandle?: any;
	selected: boolean;
	destroy?: () => void;
}

function defaultContent({ grabHandle, selected, destroy }: NodeContent) {
	return (
		<div class="node-content" class:selected>
			{#if grabHandle}
				<div class="grab-handle">{grabHandle}</div>
			{/if}
			<div class="content">
				{#if destroy}
					<button onclick={destroy}>×</button>
				{/if}
			</div>
		</div>
	);
}

function anchorContent(direction: 'west' | 'east' | 'north' | 'south') {
	return (
		<div class={`anchor ${direction}`}>
			{/* Anchor content will be provided by parent */}
		</div>
	);
}

{#snippet node({ fixedSizing, width, height, grabHandle, selected, destroy, children }: {
	fixedSizing: boolean;
	width?: number;
	height?: number;
	grabHandle?: any;
	selected?: boolean;
	destroy?: () => void;
	children?: any;
})}
	<div class="node-content" class:selected>
		{#if grabHandle}
			<div class="grab-handle">⋮</div>
		{/if}
		<div class="content">
			{#if children}
				{@render children()}
			{/if}
			{#if destroy}
				<button onclick={destroy}>×</button>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet anchor(direction: string)}
	<div class="anchor {direction}">
		<!-- Anchor content -->
	</div>
{/snippet}

{#if !$state.hidden}
	<div
		{id}
		class="svelvet-node"
		role="button"
		class:selected={$state.selected}
		class:locked={$locked || $nodeLock}
		style:top="{actualPosition.y}px"
		style:left="{actualPosition.x}px"
		style:z-index={$zIndex}
		{title}
		style:width={$state.fixedSizing ? $widthStore + 'px' : 'fit-content'}
		style:height={$state.fixedSizing ? $heightStore + 'px' : 'fit-content'}
		style:transform="rotate({$rotation}deg)"
		style:--prop-background-color={$bgColor || (isDefault || useDefaults ? null : 'transparent')}
		style:--prop-text-color={$textColor}
		style:--prop-border-color={$borderColor}
		style:--prop-selection-color={$selectionColor}
		style:--prop-border-radius={$borderRadius
			? `${$borderRadius}px`
			: isDefault || useDefaults
			? null
			: '0px'}
		style:--prop-border-width={$borderWidth || (isDefault || useDefaults ? null : '0px')}
		oncontextmenu={e => { e.preventDefault(); e.stopPropagation(); }}
		onmouseup={onMouseUp}
		onmousedown={handleNodeClicked}
		ontouchstart={handleNodeClicked}
		tabindex={0}
	>
		{#if !$state.fixedSizing}
	<div
				style:width="fit-content"
				style:height="fit-content"
				bind:clientHeight={$heightStore}
				bind:clientWidth={$widthStore}
			>
				{@render node({ 
					fixedSizing: $state.fixedSizing, 
					width: $widthStore, 
					height: $heightStore,
					grabHandle,
					selected,
					destroy,
					children: node.content
				})}
			</div>
		{:else}
			{@render node({ 
				fixedSizing: $state.fixedSizing, 
				width: $widthStore, 
				height: $heightStore,
				grabHandle,
				selected,
				destroy,
				children: node.content
			})}
		{/if}

		<div id={`anchors-west-${node.id}`} class="anchors left">
			{@render anchor('west')}
		</div>
		<div id={`anchors-east-${node.id}`} class="anchors right">
			{@render anchor('east')}
		</div>
		<div id={`anchors-north-${node.id}`} class="anchors top">
			{@render anchor('north')}
		</div>
		<div id={`anchors-south-${node.id}`} class="anchors bottom">
			{@render anchor('south')}
		</div>
	</div>
{/if}

	<div
	bind:this={container}
		class="internal-node-container"
	class:selected
		style:margin={contentMargin + 'px'}
		style:gap={gridGap + 'px'}
		style:padding={nodePadding + 'px'}
		style:border-radius={nodeRadius + 'px'}
	style:z-index={zIndex + INTERNAL_Z_OFFSET}
	style:transform="translate3d(0, 0, {depth + INTERNAL_Z_GAP_PX}px)"
		style:--grid-columns={gridConfig.columns}
		style:--node-radius={nodeRadius + 'px'}
		style:--input-radius={inputRadius + 'px'}
		style:--button-radius={buttonRadius + 'px'}
	onclick={handleNodeClick}
	>
		{#if title}
			<div 
				class="title" 
			style:transform="translate3d(0, 0, {NODE_DEPTH_PX}px)"
				style:padding={gridGap * 0.5 + 'px'}
				style:border-radius={inputRadius + 'px'}
			>
				{title}
			</div>
		{/if}
		{@render node({ 
		fixedSizing: false,
		selected,
		children: node.content
		})}
	</div>

<style>
	.svelvet-node {
		position: absolute;
		pointer-events: all;
		display: flex;
		justify-content: center;
		align-items: center;
		will-change: top, left;
		cursor: var(--node-cursor, var(--default-node-cursor));
		--final-border-width: var(
			--prop-border-width,
			var(--node-border-width, var(--default-node-border-width))
		);
		--final-border-color: var(
			--prop-border-color,
			var(--node-border-color, var(--default-node-border-color))
		);
		--final-selection-color: var(
			--prop-selection-color,
			var(--node-selection-color, var(--default-node-selection-color))
		);

		border-radius: var(
			--prop-border-radius,
			var(--node-border-radius, var(--default-node-border-radius))
		);
		background-color: var(--prop-background-color, var(--node-color, var(--default-node-color)));
		color: var(--prop-text-color, var(--text-color, var(--default-text-color)));
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
		font-family: 'Roboto', sans-serif;
	}
	.anchors {
		display: flex;
		position: absolute;
		justify-content: center;
		align-items: center;
		z-index: 1;
		pointer-events: none;
	}
	.top,
	.bottom {
		width: 100%;
		justify-content: space-around;
	}

	.top {
		transform: translate(0px, -50%);
		top: 0px;
	}

	.bottom {
		transform: translate(0px, 50%);
		bottom: 0px;
	}

	.left,
	.right {
		height: 100%;
		flex-direction: column;
		justify-content: space-around;
	}

	.left {
		transform: translate(-50%);
		left: 0px;
	}

	.right {
		transform: translate(50%);
		right: 0px;
	}

	.locked {
		cursor: var(--node-cursor-blocked, var(--default-node-cursor-blocked));
	}
	.selected {
		box-shadow: 0 0 0 var(--final-border-width) var(--final-selection-color),
			var(--default-node-shadow);
	}

	.internal-node-container {
		position: relative;
		width: calc(100% - var(--content-margin, 24px) * 2);
		height: calc(100% - var(--content-margin, 24px) * 2);
		display: grid;
		grid-template-columns: repeat(var(--grid-columns, 1), minmax(0, 1fr));
		align-items: start;
		background: var(--internal-node-bg, transparent);
		transform-style: preserve-3d;
		perspective: 1000px;
		backface-visibility: hidden;
		transition: all 0.3s ease;
	}

	.title {
		position: absolute;
		top: calc(-1 * var(--grid-gap, 12px) - 25px);
		left: 50%;
		transform: translateX(-50%);
		background: var(--title-bg, rgba(255, 255, 255, 0.9));
		font-size: calc(var(--grid-gap, 12px) * 1.2);
		color: var(--text-color);
		transform-style: preserve-3d;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
		backdrop-filter: blur(4px);
	}

	.selected {
		outline: calc(var(--grid-gap, 12px) * 0.25) solid var(--selection-color, #00ff00);
		outline-offset: calc(var(--grid-gap, 12px) * 0.25);
	}

	/* Update global styles for consistent scaling */
	:global(.node-content) {
		border-radius: var(--inner-radius) !important;
		padding: calc(var(--grid-gap, 12px) * 0.75) !important;
		transition: all 0.3s ease;
	}

	:global(.svelvet-node) {
		border-radius: var(--node-radius) !important;
		transition: all 0.3s ease;
	}

	:global(.internal-node-container input),
	:global(.internal-node-container textarea),
	:global(.internal-node-container button) {
		border-radius: var(--input-radius) !important;
		padding: calc(var(--grid-gap, 12px) * 0.5) !important;
		transition: all 0.3s ease;
	}

	/* Add depth effect styles with dynamic scaling */
	:global(.svelvet-node) {
		transform-style: preserve-3d;
		box-shadow: 
			0 0 0 var(--final-border-width) var(--final-border-color),
			0 calc(var(--grid-gap, 12px) * 0.25) calc(var(--grid-gap, 12px) * 0.5) rgba(0,0,0,0.1),
			0 0 0 var(--node-depth, 4px) rgba(0,0,0,0.05);
	}
</style>
