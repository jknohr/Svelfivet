<!--
@component Graph
A Svelte 5 graph component that supports nodes, edges, groups, and various interactions.

Key Svelte 5 Features Used:
- Runes ($state, $derived) for reactive state management
- Direct component imports instead of dynamic loading
- Event handler updates using onclick instead of on:click
- Proper typing with TypeScript

Design Decisions:
1. State Management: Using $state for granular reactivity
2. Component Structure: Direct imports for better tree-shaking
3. Event Handling: Native DOM events for better performance
4. Props: Explicit prop types with TypeScript for type safety
-->
<svelte:options runes={true} />

<script lang="ts">
	// Direct imports in Svelte 5 - No more dynamic imports needed
	// Components are tree-shakeable and bundler-friendly
	import SelectionBox from '$lib/components/Molecules/SelectionBox/CanvasSelectionBox.svelte';
	import Background from '../Background/Canvas.svelte';
	import GraphRenderer from '../renderers/GraphRenderer/GraphRenderer.svelte';
	import Editor from '$lib/components/Molecules/CanvasEditor/CanvasEditor.svelte';
	import Minimap from '$lib/components/Organisms/Minimap/Minimap.svelte';
	import ThemeToggle from '$lib/components/Atoms/ThemeToggle/ThemeToggle.svelte';
	import Controls from '$lib/components/Molecules/Controls/Controls.svelte';
	import CanvasDrawerController from '$lib/components/Molecules/Drawer/CanvasDrawerController.svelte';
	import ContrastTheme from '$lib/components/Theme/ContrastTheme.svelte';

	import { connectingFrom } from '../stores/ConnectingStore';
	import { touchDistance } from '../stores/CursorStore';
	import { isArrow } from '../utils/validators';
	import { moveElementWithBounds, calculateRelativeBounds } from '../utils/movers';
	import { calculateFitView, calculateTranslation, calculateZoom } from '../utils/calculators';
	import { getRandomColor } from '../utils/helpers';
	import { moveElement, zoomAndTranslate } from '../utils/movers';
	import { generateKey } from '../utils/helpers/generateKey';
	import { tick } from 'svelte';

	// Import types from our new organization
	import type { 
		Node, 
		Edge, 
		Graph, 
		XYPair, 
		Dimensions, 
		Direction,
		NodeKey,
		GroupKey,
		GraphKey,
		NodeEvent,
		EdgeEvent,
		GroupEvent,
		ViewportEvent,
		GraphEvent,
		ConnectingFrom,
		Selection,
		Viewport,
		TreeNode
	} from '../types/logic';
	import type { CSSColorString } from '../types/theme';
	import type { Snippet } from 'svelte';
	import type { Readable } from 'svelte/store';

	// State types
	interface AnchorState extends XYPair {
		top: number;
		left: number;
	}

	interface PinchState {
		distance: number;
		scale: number;
		animationFrameId: number | null;
	}

	// Graph types
	interface NodeBounds extends Dimensions {
		id: string;
	}

	interface Groups {
		[key: `${string}/${string}`]: Set<Node>;
		selected?: Set<Node>;
		hidden?: Set<Node>;
	}

	interface GraphNodes {
		items: Node[];
		getAll(): Node[];
		map<T>(callbackfn: (value: Node, index: number, array: Node[]) => T): T[];
		[Symbol.iterator](): Iterator<Node>;
	}

	interface DimensionsMap {
		[key: string]: Dimensions & { id?: string };
	}

	interface GraphState extends Omit<Graph, 'groups' | 'nodeBounds'> {
		scale: number;
		translation: XYPair;
		selectedNodes: Set<Node>;
		theme: string;
		drawer: boolean;
		minimap: boolean;
		controls: boolean;
		editing: Node | null;
		activeIntervals: Record<string, number>;
		isDragging: boolean;
		mounted: boolean;
		dimensions: Dimensions;
		nodeBounds: DimensionsMap;
		groupBoxes: Map<string, Dimensions>;
		nodes: GraphNodes;
		groups: Groups;
		pinch: PinchState;
	}

	// Component state management
	interface GraphStateManager {
		state: GraphState;
		selection: {
			selectedNodes: Set<Node>;
			selectedNode: Node | null;
			isEditing: boolean;
			isSelecting: boolean;
			isCreating: boolean;
			isDragging: boolean;
		};
		interaction: {
			cursor: XYPair;
			anchor: AnchorState;
			isAdding: boolean;
			isDragging: boolean;
			isPinching: boolean;
			pinch: PinchState;
		};
		ui: {
			theme: string;
			color: CSSColorString;
			minimapVisible: boolean;
			controlsVisible: boolean;
			drawerVisible: boolean;
			toggleVisible: boolean;
			contrastVisible: boolean;
		};
	}

	// Props interface
	interface Props {
		children?: Snippet;
		background?: Snippet;
		drawer?: Snippet;
		selectionBox?: Snippet;
		themeToggle?: Snippet;
		contrastTheme?: Snippet;
		width?: number;
		height?: number;
		pannable?: boolean;
		theme?: string;
		title?: string;
		backgroundExists?: boolean;
		graph?: Graph;
		graphDOMElement?: HTMLElement;
		fitView?: boolean;
		disableSelection?: boolean;
		selectionColor?: string;
		PAN_INCREMENT?: number;
		PAN_TIME?: number;
		onEdgeDrop?: (data: any) => void;
	}

	// Props declaration using $props rune
	let props = $props<Props>();

	// Helper functions
	function createDimensionsMap(dimensions: Dimensions): DimensionsMap {
		const result: DimensionsMap = { default: dimensions };
		for (const key of Object.keys(dimensions)) {
			result[key] = dimensions[key];
		}
		return result;
	}

	function createGraphNodes(items: Node[] = []): GraphNodes {
		return {
			items,
			getAll(): Node[] {
				return Array.from(this.items);
			},
			map<T>(callbackfn: (value: Node, index: number, array: Node[]) => T): T[] {
				return this.items.map(callbackfn);
			},
			[Symbol.iterator](): Iterator<Node> {
				return this.items[Symbol.iterator]();
			}
		};
	}

	// Initialize state manager with proper types
	let stateManager = $state<GraphStateManager>({
		state: {
			...props.graph,
			scale: 1,
			translation: { x: 0, y: 0 },
			selectedNodes: new Set<Node>(),
			theme: 'light',
			drawer: false,
			minimap: false,
			controls: false,
			editing: null,
			activeIntervals: {},
			isDragging: false,
			mounted: false,
			dimensions: { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 },
			nodeBounds: createDimensionsMap({ left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 }),
			groupBoxes: new Map(),
			nodes: createGraphNodes([]),
			groups: { selected: new Set<Node>(), hidden: new Set<Node>() },
			pinch: {
				distance: 0,
				scale: 1,
				animationFrameId: null
			}
		},
		selection: {
			selectedNodes: new Set<Node>(),
			selectedNode: null,
			isEditing: false,
			isSelecting: false,
			isCreating: false,
			isDragging: false
		},
		interaction: {
			cursor: { x: 0, y: 0 },
			anchor: { x: 0, y: 0, top: 0, left: 0 },
			isAdding: false,
			isDragging: false,
			isPinching: false,
			pinch: {
				distance: 0,
				scale: 1,
				animationFrameId: null
			}
		},
		ui: {
			theme: 'light',
			color: '#000000',
			minimapVisible: false,
			controlsVisible: false,
			drawerVisible: false,
			toggleVisible: false,
			contrastVisible: false
		}
	});

	// Derived values for better reactivity
	let isEditing = $derived(stateManager.selection.isEditing);
	let isSelecting = $derived(stateManager.selection.isSelecting && !props.disableSelection);
	let selectedNode = $derived(stateManager.selection.selectedNode);
	let cursor = $derived(stateManager.interaction.cursor);
	let anchor = $derived(stateManager.interaction.anchor);

	// Component references
	let minimapComponent = $state<typeof Minimap | null>(null);
	let controlsComponent = $state<typeof Controls | null>(null);
	let drawerComponent = $state<typeof CanvasDrawerController | null>(null);
	let contrastComponent = $state<typeof ContrastTheme | null>(null);

	// Type definitions
	interface FitViewResult {
		x: number | null;
		y: number | null;
		scale: number | null;
	}

	interface NodeWithGroup {
		id: string;
		position: XYPair;
		group: Readable<GroupKey | null>;
		dimensions: {
			width: Readable<number>;
			height: Readable<number>;
		};
	}

	interface ConnectingState {
		anchor: {
			node: { id: string };
			id: string;
		} | null;
	}

	/**
	 * Event Handlers
	 * In Svelte 5:
	 * - Use onclick instead of on:click
	 * - More aligned with web standards
	 * - Better TypeScript integration
	 */
	function updateGraphState(updates: Partial<GraphState>) {
		if (stateManager.state) {
			Object.assign(stateManager.state, updates);
		}
	}

	function handleResize(event: UIEvent) {
		if (!props.width || !props.height) {
			const rect = props.graphDOMElement?.getBoundingClientRect();
			if (rect) {
				updateGraphState({
					dimensions: {
						...stateManager.state.dimensions,
						width: rect.width,
						height: rect.height
					}
				});
			}
		}
	}

	function handleScroll(event: UIEvent) {
		handleResize(event);
	}

	/**
	 * Effects in Svelte 5
	 * - Use $effect instead of onMount/onDestroy
	 * - Cleaner syntax for cleanup
	 * - Automatically tracks dependencies
	 */
	$effect(() => {
		if (props.graph.syncDimensions) {
			// DB sync logic here
		}
	});

	$effect(() => {
		// Cleanup is handled by return function
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	async function fitIntoView() {
		if (!props.fitView) return;
		
		stateManager.selection.isDragging = true;
		
		// Convert nodes to GraphDimensions format
		const graphDims: Dimensions = {
			left: Math.min(...stateManager.state.nodes.map(n => n.position.x)),
			top: Math.min(...stateManager.state.nodes.map(n => n.position.y)),
			right: Math.max(...stateManager.state.nodes.map(n => n.position.x + n.dimensions.width)),
			bottom: Math.max(...stateManager.state.nodes.map(n => n.position.y + n.dimensions.height)),
			width: 0,
			height: 0
		};
		graphDims.width = graphDims.right - graphDims.left;
		graphDims.height = graphDims.bottom - graphDims.top;

		if (!graphDims) return;

		// Calculate bounds
		const nodeBounds = stateManager.state.bounds.nodeBounds;
		const bounds = {
			top: Math.min(...Object.values(nodeBounds as Record<string, Dimensions>).map(n => n.top)),
			left: Math.min(...Object.values(nodeBounds as Record<string, Dimensions>).map(n => n.left)),
			right: Math.max(...Object.values(nodeBounds as Record<string, Dimensions>).map(n => n.right)),
			bottom: Math.max(...Object.values(nodeBounds as Record<string, Dimensions>).map(n => n.bottom))
		};

		// Update state based on calculations
		const result = calculateFitView(graphDims, bounds) as FitViewResult;
		if (result.x !== null && result.y !== null && result.scale !== null) {
			// Batch state updates
			stateManager.state.scale = result.scale;
			stateManager.state.translation = { x: result.x, y: result.y };
			stateManager.state.mounted = true;
		}
	}

	// Utility functions
	function safeGetPosition(pos: XYPair | null): XYPair {
		return pos || { x: 0, y: 0 };
	}

	function calculateDimensions(pos: XYPair | null, cursor: XYPair): { width: number; height: number; top: number; left: number } {
		const position = safeGetPosition(pos);
		const width = cursor.x - position.x;
		const height = cursor.y - position.y;
		const top = Math.min(position.y, position.y + height);
		const left = Math.min(position.x, position.x + width);

		return {
			width: Math.abs(width),
			height: Math.abs(height),
			top,
			left
		};
	}

	/**
	 * Mouse Event Handler
	 * Svelte 5 Pattern: Direct DOM event handling
	 * - Uses native onmouseup instead of on:mouseup
	 * - Handles both mouse and touch events
	 * - Updates state directly through $state
	 */
	function onMouseUp(e: MouseEvent | TouchEvent) {
		try {
			if (stateManager.selection.isCreating && stateManager.selection.selectedNode) {
				// Group creation logic
				const groupName = generateKey();
				const groupKey = `group:${groupName}` as GroupKey;
				
				const { width, height, top, left } = calculateDimensions(stateManager.selection.selectedNode, cursor);

				const newDimensions = {
					width: Math.abs(width),
					height: Math.abs(height)
				};
				const newPosition = {
					x: left,
					y: top
				};

				// Create groupBox with proper reactivity
				const newGroupBox = {
					group: groupKey,
					dimensions: newDimensions,
					position: newPosition,
					color: getRandomColor(),
					moving: false,
					left,
					top,
					width: Math.abs(width),
					height: Math.abs(height),
					right: left + Math.abs(width),
					bottom: top + Math.abs(height)
				};

				// Update reactive state
				stateManager.state.groupBoxes.set(groupKey, newGroupBox);
				stateManager.state.groups[groupKey] = new Set(stateManager.state.nodes);
				stateManager.state.nodes = [];
				stateManager.selection.isCreating = false;
				stateManager.selection.isSelecting = false;
			}

			// Edge handling
			const cursorEdge = stateManager.state.edges.get('cursor');
			if (cursorEdge) {
				stateManager.state.edges.delete('cursor');
				handleEdgeDrop(cursorEdge);
			}

			// Reset state
			stateManager.selection.selectedNode = null;
			stateManager.selection.selectedNodes = new Set();
			stateManager.selection.isSelecting = false;
			stateManager.state.isDragging = false;

			if (!e.shiftKey) {
				connectingFrom.set(null);
			}
		} catch (error) {
			console.error('Error handling mouse up event:', error);
		}
	}

	function onMouseDown(e: MouseEvent) {
		try {
			if (!props.pannable && !(e.shiftKey || e.metaKey)) return;
			if (e.button === 2) return;
			if (props.graphDOMElement) props.graphDOMElement.focus();

			const { clientX, clientY } = e;
			stateManager.interaction.cursor = { x: clientX, y: clientY };

			if (e.shiftKey || e.metaKey) {
				e.preventDefault();
				stateManager.selection.isSelecting = true;
				stateManager.interaction.anchor = {
					y: clientY - stateManager.state.dimensions.top || 0,
					x: clientX - stateManager.state.dimensions.left || 0,
					top: stateManager.state.dimensions.top || 0,
					left: stateManager.state.dimensions.left || 0
				};
				stateManager.selection.isCreating = e.shiftKey && e.metaKey;
				stateManager.interaction.isAdding = e.metaKey && !e.shiftKey;
			} else {
				stateManager.state.isDragging = true;
				stateManager.state.nodes = [];
			}
		} catch (error) {
			console.error('Error handling mouse down event:', error);
		}
	}

	function onTouchStart(e: TouchEvent) {
		try {
			stateManager.selection.selectedNodes.clear();
			stateManager.interaction.cursor = { x: e.touches[0].clientX, y: e.touches[0].clientY };
			stateManager.state.isDragging = true;

			if (e.touches.length === 2) {
				startPinching();
				stateManager.interaction.isPinching = true;
				stateManager.interaction.pinch.distance = touchDistance;
				stateManager.state.pinch.scale = stateManager.state.scale;
			}
		} catch (error) {
			console.error('Error handling touch start event:', error);
		}
	}

	function onTouchEnd() {
		try {
			stateManager.state.isDragging = false;
			stateManager.interaction.isPinching = false;
		} catch (error) {
			console.error('Error handling touch end event:', error);
		}
	}

	function startPinching() {
		try {
			if (!stateManager.interaction.isPinching) {
				stateManager.interaction.isPinching = true;
				stateManager.interaction.pinch.distance = touchDistance || 0;
				stateManager.state.pinch.scale = stateManager.state.scale;
				stateManager.interaction.pinch.animationFrameId = requestAnimationFrame(handlePinch);
			}
		} catch (error) {
			console.error('Error starting pinch:', error);
		}
	}

	function handlePinch() {
		try {
			if (!stateManager.interaction.isPinching || stateManager.interaction.pinch.animationFrameId === null) {
				if (stateManager.interaction.pinch.animationFrameId !== null) {
					cancelAnimationFrame(stateManager.interaction.pinch.animationFrameId);
				}
				return;
			}

			const newDistance = touchDistance || 0;
			const scaleFactor = newDistance / (stateManager.interaction.pinch.distance || 1);
			stateManager.state.scale = (stateManager.interaction.pinch.scale || 1) * scaleFactor;
			stateManager.interaction.pinch.animationFrameId = requestAnimationFrame(handlePinch);
		} catch (error) {
			console.error('Error handling pinch:', error);
		}
	}

	/**
	 * Keyboard Event Handling
	 * Svelte 5 Pattern: Direct DOM events
	 * - Uses onkeydown instead of on:keydown
	 * - Better event type inference
	 * - More predictable cleanup
	 */
	function handleKeyDown(e: KeyboardEvent) {
		if (e.target instanceof HTMLElement && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
			return;
		}

		switch (e.code) {
			case 'KeyA':
				if (e.metaKey) {
					const unlockedNodes = stateManager.state.nodes.getAll().filter((node: Node) => !node.locked);
					stateManager.selection.selectedNodes = new Set(unlockedNodes);
				}
				break;
			case 'KeyL':
				stateManager.ui.theme = stateManager.ui.theme === 'light' ? 'dark' : 'light';
				break;
			case 'Digit0':
				fitIntoView();
				break;
			case 'KeyD':
				stateManager.ui.drawerVisible = !stateManager.ui.drawerVisible;
				break;
			case 'KeyM':
				stateManager.ui.minimapVisible = !stateManager.ui.minimapVisible;
				break;
			case 'KeyC':
				stateManager.ui.controlsVisible = !stateManager.ui.controlsVisible;
				break;
			case 'KeyE':
				if (stateManager.selection.selectedNodes.size > 0) {
					const node = Array.from(stateManager.selection.selectedNodes)[0];
					stateManager.selection.selectedNode = node;
					stateManager.selection.isEditing = true;
				}
				break;
			case 'Tab':
				if (e.altKey || e.ctrlKey) {
					selectNextNode();
				}
				break;
			default:
				return;
		}

		e.preventDefault();
	}

	function selectNextNode() {
		try {
			const nodes = stateManager.state.nodes.getAll();
			const currentIndex = nodes.findIndex((node: Node) => stateManager.selection.selectedNodes.has(node));
			const nextIndex = currentIndex + 1;

			stateManager.selection.selectedNodes.delete(nodes[currentIndex]);
			stateManager.selection.selectedNodes.add(nodes[nextIndex]);
		} catch (error) {
			console.error('Error selecting next node:', error);
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		try {
			const { key } = e;

			if (isArrow(key)) {
				clearInterval(stateManager.state.activeIntervals[key]);
				delete stateManager.state.activeIntervals[key];
			} else if (key === 'Shift') {
				connectingFrom.set(null);
			}
		} catch (error) {
			console.error('Error handling key up event:', error);
		}
	}

	function handleArrowKey(key: Arrow, e: KeyboardEvent) {
		try {
			const multiplier = e.shiftKey ? 2 : 1;
			const start = performance.now();
			const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? 1 : -1;
			const leftRight = key === 'ArrowLeft' || key === 'ArrowRight';
			const startOffset = leftRight ? stateManager.state.translation.x : stateManager.state.translation.y;
			const endOffset = startOffset + direction * props.PAN_INCREMENT * multiplier;

			if (!stateManager.state.activeIntervals[key]) {
				let interval = setInterval(() => {
					const time = performance.now() - start;

					if (stateManager.selection.selectedNodes.size === 0) {
						const movement = startOffset + (endOffset - startOffset) * (time / props.PAN_TIME);
						stateManager.state.translation = {
							x: leftRight ? movement : stateManager.state.translation.x,
							y: leftRight ? stateManager.state.translation.y : movement
						};
					} else {
						const delta = {
							x: leftRight ? -direction * 2 : 0,
							y: leftRight ? 0 : -direction * 2
						};
						stateManager.selection.selectedNodes.forEach((node: Node) => handleNodeMovement(node, delta));
					}
				}, 2);
				stateManager.state.activeIntervals[key] = interval;
			}
		} catch (error) {
			console.error('Error handling arrow key event:', error);
		}
	}

	// Update node handling
	function handleNodeMovement(node: Node, delta: XYPair) {
		const currentPosition = node.position;
		let groupBox: Dimensions | undefined;
		const nodeGroup = node.group;

		if (nodeGroup && typeof nodeGroup === 'string') {
			groupBox = stateManager.state.groupBoxes.get(nodeGroup);
		}

		if (groupBox) {
			const nodeWidth = node.dimensions.width;
			const nodeHeight = node.dimensions.height;
			const bounds = {
				...groupBox,
				group: nodeGroup || '',
				dimensions: { width: nodeWidth, height: nodeHeight },
				position: currentPosition,
				color: getRandomColor(),
				moving: false
			};
			moveElementWithBounds(currentPosition, delta, node.position, bounds);
		} else {
			moveElement(currentPosition, delta, node.position);
		}
	}

	// Update edge handling
	function handleEdgeDrop(cursorEdge: any) {
		const connecting = get(connectingFrom) as ConnectingState | null;
		if (connecting?.anchor) {
			props.onEdgeDrop?.({
				cursor: cursor,
				source: {
					node: connecting.anchor.node.id.slice(2),
					anchor: connecting.anchor.id.split('/')[0].slice(2)
				}
			});
		}
	}

	// Update handlers with improved type safety
	function handleNodeSelection(node: Node) {
		const pos = node.position;
		if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
			console.error('Invalid node position:', node);
			return;
		}
		stateManager.interaction.cursor = { x: pos.x, y: pos.y };
		stateManager.selection.selectedNode = node;
	}

	function startEditing(node: Node) {
		stateManager.selection.selectedNode = node;
		stateManager.selection.isEditing = true;
		stateManager.state.editing = node;
	}

	function stopEditing() {
		stateManager.selection.isEditing = false;
		stateManager.state.editing = null;
	}

	// Selection box handling
	function handleSelectionStart(event: MouseEvent) {
		if (!event.shiftKey && !event.metaKey) return;

		stateManager.selection.isSelecting = true;
		stateManager.interaction.anchor = {
			x: event.clientX,
			y: event.clientY,
			top: stateManager.state.dimensions.top || 0,
			left: stateManager.state.dimensions.left || 0
		};
		stateManager.selection.isCreating = event.shiftKey && event.metaKey;
		stateManager.interaction.isAdding = event.metaKey && !event.shiftKey;
	}

	// Calculate graph dimensions
	function calculateGraphDimensions(nodes: GraphNodes): Dimensions {
		if (!nodes.items.length) {
			return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 };
		}

		const positions = nodes.items.map(n => ({
			left: n.position.x,
			top: n.position.y,
			right: n.position.x + n.dimensions.width,
			bottom: n.position.y + n.dimensions.height
		}));

		const left = Math.min(...positions.map(p => p.left));
		const top = Math.min(...positions.map(p => p.top));
		const right = Math.max(...positions.map(p => p.right));
		const bottom = Math.max(...positions.map(p => p.bottom));

		return {
			left,
			top,
			width: right - left,
			height: bottom - top,
			right,
			bottom
		};
	}
</script>

{#snippet content()}
	{#if props.children}
		{@render props.children()}
	{/if}
{/snippet}

{#snippet canvas-content()}
	{#if props.backgroundExists && props.background}
		{@render props.background()}
	{:else}
		<Background />
	{/if}
{/snippet}

<section
	role="presentation"
	id={props.graph.id}
	class="svelvet-wrapper"
	title={props.title}
	style:width={props.width ? props.width + 'px' : '100%'}
	style:height={props.height ? props.height + 'px' : '100%'}
	style:cursor={props.pannable ? 'move' : 'default'}
	onwheel={handleScroll}
	onmousedown={onMouseDown}
	ontouchend={onMouseUp}
	ontouchstart={onTouchStart}
	onkeydown={handleKeyDown}
	onkeyup={handleKeyUp}
	bind:this={props.graphDOMElement}
	tabindex={0}
>
	<GraphRenderer isMovable={!isEditing}>
		{#if isEditing}
			<Editor 
				editing={true} 
				node={selectedNode}
			/>
		{/if}
		{@render content()}
	</GraphRenderer>

	{@render canvas-content()}
	
	{#if stateManager.ui.minimapVisible}
		<Minimap />
	{/if}
	
	{#if stateManager.ui.controlsVisible}
		<Controls />
	{/if}
	
	{#if stateManager.ui.toggleVisible}
		<ThemeToggle onThemeChange={(theme) => updateGraphState({ theme })}>
			{#if props.themeToggle}
				{@render props.themeToggle()}
			{/if}
		</ThemeToggle>
	{/if}
	
	{#if stateManager.ui.drawerVisible}
		<CanvasDrawerController>
			{#if props.drawer}
				{@render props.drawer()}
			{/if}
		</CanvasDrawerController>
	{/if}
	
	{#if stateManager.ui.contrastVisible}
		<ContrastTheme onThemeChange={(theme) => updateGraphState({ theme })}>
			{#if props.contrastTheme}
				{@render props.contrastTheme()}
			{/if}
		</ContrastTheme>
	{/if}
	
	{#if isSelecting}
		<SelectionBox 
			{anchor}
			creating={stateManager.selection.isCreating}
			adding={stateManager.interaction.isAdding}
			color={stateManager.ui.color}
			graph={stateManager.state}
		>
			{#if props.selectionBox}
				{@render props.selectionBox()}
			{/if}
		</SelectionBox>
	{/if}
</section>

<svelte:window
	ontouchend={onMouseUp}
	onmouseup={onMouseUp}
	onresize={handleResize}
	onscroll={handleScroll}
/>

<style>
	/**
	 * Styles in Svelte 5
	 * - Still scoped by default
	 * - Use :global for global styles
	 * - CSS custom properties for theming
	 */
	.svelvet-wrapper {
		position: relative;
		overflow: hidden;
		cursor: move;
		font-family: 'Rubik';
		box-sizing: border-box !important;
		user-select: none;
		margin: 0;
		line-height: 1rem;
		font-size: 0.85rem;
		pointer-events: auto;
		color: var(--default-text-color);
	}
	.svelvet-wrapper:focus {
		outline: none;
		box-shadow: 0 0 0 2px rgb(59, 102, 232);
	}
	.drawer-content {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.drawer-default {
		padding: 1rem;
		text-align: center;
		color: var(--text-color, #333);
	}
</style>