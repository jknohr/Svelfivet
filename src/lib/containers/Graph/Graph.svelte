<script lang="ts">
	import SelectionBox from '$lib/components/SelectionBox/SelectionBox.svelte';
	import Background from '../Background/Background.svelte';
	import GraphRenderer from '../../renderers/GraphRenderer/GraphRenderer.svelte';
	import Editor from '$lib/components/Editor/Editor.svelte';
	import { connectingFrom } from '$lib/components/Anchor/Anchor.svelte';
	import { tick, setContext, onMount } from 'svelte';
	import { isArrow } from '$lib/types';
	import { moveElementWithBounds, calculateRelativeBounds } from '$lib/utils/movers';
	import { touchDistance, initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { calculateFitView, calculateTranslation, calculateZoom, generateKey } from '$lib/utils';
	import { getRandomColor } from '$lib/utils';
	import { moveElement, zoomAndTranslate } from '$lib/utils/movers';
	import type { Graph, GroupBox, GraphDimensions, CSSColorString, Node, XYPair } from '$lib/types';
	import type { Arrow, GroupKey, Group, CursorAnchor, ActiveIntervals } from '$lib/types';
	import type { SvelteComponent } from 'svelte';

	interface Props {
		graph: Graph;
		width?: number;
		height?: number;
		minimap?: boolean;
		controls?: boolean;
		toggle?: boolean;
		fixedZoom?: boolean;
		pannable?: boolean;
		disableSelection?: boolean;
		ZOOM_INCREMENT?: number;
		PAN_INCREMENT?: number;
		PAN_TIME?: number;
		MAX_SCALE?: number;
		MIN_SCALE?: number;
		selectionColor?: CSSColorString | null;
		backgroundExists?: boolean;
		fitView?: boolean;
		trackpadPan?: boolean;
		modifier?: string;
		theme?: string;
		title?: string;
		drawer?: boolean;
		contrast?: boolean;
	}

	let { 
		graph,
		width = 0,
		height = 0,
		minimap = false,
		controls = false,
		toggle = false,
		fixedZoom = false,
		pannable = true,
		disableSelection = false,
		ZOOM_INCREMENT = 0.1,
		PAN_INCREMENT = 50,
		PAN_TIME = 250,
		MAX_SCALE = 3,
		MIN_SCALE = 0.2,
		selectionColor = null,
		backgroundExists = false,
		fitView = false,
		trackpadPan = false,
		modifier = 'meta',
		theme = 'light',
		title = '',
		drawer = false,
		contrast = false
	}: Props = $props();

	// Graph state
	let graphState = $state({
		animationFrameId: 0,
		initialDistance: 0,
		initialScale: 1,
		anchor: { x: 0, y: 0, top: 0, left: 0 },
		selecting: false,
		creating: false,
		adding: false,
		isMovable: false,
		pinching: false,
		initialFit: false,
		graphDimensions: null as GraphDimensions | null,
		graphDOMElement: null as HTMLElement | null,
		toggleComponent: null as typeof SvelteComponent | null,
		minimapComponent: null as typeof SvelteComponent | null,
		controlsComponent: null as typeof SvelteComponent | null,
		drawerComponent: null as typeof SvelteComponent | null,
		contrastComponent: null as typeof SvelteComponent | null,
		duplicate: false,
		mounted: 0,
		selectedNodes: new Set<Node>(),
		activeGroup: null as GroupKey | null,
		initialNodePositions: [] as Array<Node>,
		initialClickPosition: { x: 0, y: 0 },
		tracking: false,
		cursor: graph.cursor,
		scale: graph.transforms.scale,
		translation: graph.transforms.translation,
		groups: graph.groups,
		groupBoxes: graph.groupBoxes,
		editing: graph.editing,
		nodeBounds: graph.bounds.nodeBounds
	});

	const dispatch = (eventName: string, detail: any) => {
		const event = new CustomEvent(eventName, { detail });
		dispatchEvent(event);
	};

	const activeIntervals: ActiveIntervals = {};

	// Effects
	$effect(() => {
		if (theme) document.documentElement.setAttribute('svelvet-theme', theme);
	});

	$effect(() => {
		if (!graphState.initialFit && fitView) {
			fitIntoView();
		}
	});

	$effect(() => {
		if (toggle && !graphState.toggleComponent) loadToggle();
	});

	$effect(() => {
		if (minimap && !graphState.minimapComponent) loadMinimap();
	});

	$effect(() => {
		if (controls && !graphState.controlsComponent) loadControls();
	});

	$effect(() => {
		if (drawer && !graphState.drawerComponent) loadDrawer();
	});

	$effect(() => {
		if (contrast && !graphState.contrastComponent) loadContrast();
	});

	const cursorAnchor: CursorAnchor = {
		id: null,
		position: graph.cursor,
		offset: $state({ x: 0, y: 0 }),
		connected: $state(new Set()),
		dynamic: $state(false),
		edge: null,
		edgeColor: $state(null),
		direction: $state('self'),
		inputKey: null,
		type: 'output',
		moving: $state(false),
		store: null,
		mounted: $state(true),
		rotation: $state(0),
		node: {
			zIndex: $state(Infinity),
			rotating: $state(false),
			position: graph.cursor,
			dimensions: { width: $state(0), height: $state(0) }
		}
	};

	setContext('graphDOMElement', graphState.graphDOMElement);
	setContext('cursorAnchor', cursorAnchor);
	setContext('duplicate', graphState.duplicate);
	setContext('graph', graph);
	setContext('transforms', graph.transforms);
	setContext('dimensions', graph.dimensions);
	setContext('locked', graph.locked);
	setContext('groups', graphState.groups);
	setContext('bounds', graph.bounds);
	setContext('edgeStore', graph.edges);
	setContext('nodeStore', graph.nodes);
	setContext('mounted', graphState.mounted);

	onMount(() => {
		updateGraphDimensions();
	});

	async function fitIntoView() {
		if (!fitView) return;
		tracking.set(true);
		const { x, y, scale } = calculateFitView(graphState.graphDimensions, graphState.nodeBounds);
		if (x !== null && y !== null && scale !== null) {
			scale.set(scale);
			translation.set({ x, y });
		}
		tracking.set(false);
		graphState.initialFit = true;
	}

	async function loadMinimap() {
		graphState.minimapComponent = (await import('$lib/components/Minimap/Minimap.svelte')).default;
	}

	async function loadToggle() {
		graphState.toggleComponent = (await import('$lib/components/ThemeToggle/ThemeToggle.svelte')).default;
	}

	async function loadControls() {
		graphState.controlsComponent = (await import('$lib/components/Controls/Controls.svelte')).default;
	}

	async function loadDrawer() {
		graphState.drawerComponent = (await import('$lib/components/Drawer/DrawerController.svelte')).default;
	}

	async function loadContrast() {
		graphState.contrastComponent = (await import('$lib/components/ContrastTheme/ContrastTheme.svelte')).default;
	}

	function updateGraphDimensions() {
		if (!graphState.graphDOMElement) return;
		const DOMRect = graphState.graphDOMElement.getBoundingClientRect();
		graphState.graphDimensions = {
			top: DOMRect.top,
			left: DOMRect.left,
			bottom: DOMRect.bottom,
			right: DOMRect.right,
			width: DOMRect.width,
			height: DOMRect.height
		};

		graph.dimensions.set(graphState.graphDimensions);
		if (fitView === 'resize') fitIntoView();
	}

	function onMouseUp(e: MouseEvent | TouchEvent) {
		try {
			if (graphState.creating) {
				const groupName = generateKey();
				const groupKey: GroupKey = `${groupName}/${graph.id}`;
				const cursorPosition = get(graphState.cursor);
				const width = cursorPosition.x - graphState.initialClickPosition.x;
				const height = cursorPosition.y - graphState.initialClickPosition.y;
				const top = Math.min(graphState.initialClickPosition.y, graphState.initialClickPosition.y + height);
				const left = Math.min(graphState.initialClickPosition.x, graphState.initialClickPosition.x + width);

				const dimensions = {
					width: writable(Math.abs(width)),
					height: writable(Math.abs(height))
				};
				const position = writable({
					x: left,
					y: top
				});

				const groupBox: GroupBox = {
					group: writable(groupKey),
					dimensions,
					position,
					color: writable(getRandomColor()),
					moving: writable(false)
				};

				graphState.groupBoxes.add(groupBox, groupKey);

				Array.from(get(graphState.selectedNodes)).forEach((node) => {
					node.group.set(groupKey);
				});

				graphState.groups.update((groups) => {
					const newGroup: Group = {
						parent: writable(groupBox),
						nodes: writable(new Set([...get(graphState.selectedNodes), groupBox]))
					};
					groups[groupKey] = newGroup;
					return groups;
				});

				graphState.selectedNodes.clear();

				graphState.creating = false;
				graphState.selecting = false;
			}

			if (graphState.activeGroup) {
				const nodeGroupArray = Array.from(get(graphState.groups[graphState.activeGroup].nodes));
				nodeGroupArray.forEach((node) => node.moving.set(false));
			}
			const cursorEdge = graph.edges.get('cursor');

			if (cursorEdge) {
				graph.edges.delete('cursor');
				if (!cursorEdge.disconnect)
					dispatch('edgeDrop', {
						cursor: get(graphState.cursor),
						source: {
							node: connectingFrom?.anchor.node.id.slice(2),
							anchor: connectingFrom?.anchor.id.split('/')[0].slice(2)
						}
					});
			}
			graphState.activeGroup = null;
			graphState.initialClickPosition = { x: 0, y: 0 };
			graphState.initialNodePositions = [];
			graphState.selecting = false;
			graphState.isMovable = false;
			graphState.tracking = false;

			if (!e.shiftKey) {
				connectingFrom.set(null);
			}

			graphState.anchor.y = 0;
			graphState.anchor.x = 0;
		} catch (error) {
			console.error('Error handling mouse up event:', error);
		}
	}

	function onMouseDown(e: MouseEvent) {
		try {
			if (!pannable && !(e.shiftKey || e.metaKey)) return;
			if (e.button === 2) return;
			if (graphState.graphDOMElement) graphState.graphDOMElement.focus();

			const { clientX, clientY } = e;

			graphState.initialClickPosition = get(graphState.cursor);

			if (e.shiftKey || e.metaKey) {
				e.preventDefault();
				graphState.selecting = true;
				const { top, left } = graphState.graphDimensions;
				graphState.anchor.y = clientY - top;
				graphState.anchor.x = clientX - left;
				graphState.anchor.top = top;
				graphState.anchor.left = left;
				if (e.shiftKey && e.metaKey) {
					graphState.creating = true;
				} else {
					graphState.creating = false;
				}

				if (e.metaKey && !e.shiftKey) {
					graphState.adding = true;
				} else {
					graphState.adding = false;
				}
			} else {
				graphState.isMovable = true;
				graphState.selectedNodes.clear();
				graphState.selectedNodes = new Set();
			}
		} catch (error) {
			console.error('Error handling mouse down event:', error);
		}
	}

	function onTouchStart(e: TouchEvent) {
		try {
			graphState.selectedNodes.clear();
			graphState.selectedNodes = new Set();

			graphState.initialClickPosition = get(graphState.cursor);

			graphState.isMovable = true;
			if (e.touches.length === 2) {
				startPinching();
				graphState.initialDistance = touchDistance;
				graphState.initialScale = get(graphState.scale);
			}
		} catch (error) {
			console.error('Error handling touch start event:', error);
		}
	}

	function onTouchEnd() {
		try {
			graphState.isMovable = false;
			graphState.pinching = false;
		} catch (error) {
			console.error('Error handling touch end event:', error);
		}
	}

	function startPinching() {
		try {
			if (!graphState.pinching) {
				graphState.pinching = true;
				graphState.animationFrameId = requestAnimationFrame(handlePinch);
			}
		} catch (error) {
			console.error('Error starting pinch:', error);
		}
	}

	function handlePinch() {
		try {
			if (!graphState.pinching) {
				cancelAnimationFrame(graphState.animationFrameId);
				return;
			}

			const newDistance = touchDistance;
			const scaleFactor = newDistance / graphState.initialDistance;
			graphState.scale = graphState.initialScale * scaleFactor;
			graphState.animationFrameId = requestAnimationFrame(handlePinch);
		} catch (error) {
			console.error('Error handling pinch:', error);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		try {
			const { key, code } = e;
			const target = e.target as HTMLElement;

			if (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA') return;

			if (code === 'KeyA' && e[`${modifier}Key`]) {
				const unlockedNodes = graph.nodes.getAll().filter((node) => !get(node.locked));
				graphState.selectedNodes.clear();
				graphState.selectedNodes = new Set(unlockedNodes);
			} else if (isArrow(key)) {
				handleArrowKey(key as Arrow, e);
			} else if (key === '=') {
				zoomAndTranslate(-1, graph.dimensions, graph.transforms, ZOOM_INCREMENT);
			} else if (key === '-') {
				zoomAndTranslate(1, graph.dimensions, graph.transforms, ZOOM_INCREMENT);
			} else if (key === '0') {
				fitIntoView();
			} else if (key === 'Control') {
				graphState.groups['selected'].nodes.set(new Set());
			} else if (code === 'KeyD' && e[`${modifier}Key`]) {
				graphState.duplicate = true;
				setTimeout(() => {
					graphState.duplicate = false;
				}, 100);
			} else if (key === 'Tab' && (e.altKey || e.ctrlKey)) {
				selectNextNode();
			} else if (key === 'l') {
				theme = theme === 'light' ? 'dark' : 'light';
			} else if (key === 'd') {
				drawer = !drawer;
			} else if (key === 'm') {
				minimap = !minimap;
			} else if (key === 'c') {
				controls = !controls;
			} else if (key === 'e') {
				const node = Array.from(graphState.selectedNodes)[0];
				graph.editing.set(node);
			} else {
				return;
			}

			e.preventDefault();
		} catch (error) {
			console.error('Error handling key down event:', error);
		}
	}

	function selectNextNode() {
		try {
			const nodes = graph.nodes.getAll();

			const currentIndex = nodes.findIndex((node) => graphState.selectedNodes.has(node));
			const nextIndex = currentIndex + 1;

			graphState.selectedNodes.delete(nodes[currentIndex]);
			graphState.selectedNodes.add(nodes[nextIndex]);
		} catch (error) {
			console.error('Error selecting next node:', error);
		}
	}

	function handleKeyUp(e: KeyboardEvent) {
		try {
			const { key } = e;

			if (isArrow(key)) {
				clearInterval(activeIntervals[key]);
				delete activeIntervals[key];
			} else if (key === 'Shift') {
				connectingFrom.set(null);
			}
		} catch (error) {
			console.error('Error handling key up event:', error);
		}
	}

	function handleScroll(e: WheelEvent) {
		try {
			if (fixedZoom) return;
			const multiplier = e.shiftKey ? 0.15 : 1;
			const { clientX, clientY, deltaY } = e;
			const currentTranslation = get(graphState.translation);
			const pointerPosition = { x: clientX, y: clientY };

			if ((trackpadPan || e.metaKey) && deltaY % 1 === 0) {
				graphState.translation = {
					x: (graphState.translation.x -= e.deltaX),
					y: (graphState.translation.y -= e.deltaY)
				};

				return;
			}

			if ((get(graphState.scale) >= MAX_SCALE && deltaY < 0) || (get(graphState.scale) <= MIN_SCALE && deltaY > 0)) return;

			const scrollAdjustment = Math.min(0.009 * multiplier * Math.abs(deltaY), 0.08);
			const newScale = calculateZoom(get(graphState.scale), Math.sign(deltaY), scrollAdjustment);

			const newTranslation = calculateTranslation(
				get(graphState.scale),
				newScale,
				currentTranslation,
				pointerPosition,
				graphState.graphDimensions
			);

			graphState.scale = newScale;
			graphState.translation = newTranslation;
		} catch (error) {
			console.error('Error handling scroll event:', error);
		}
	}

	function handleArrowKey(key: Arrow, e: KeyboardEvent) {
		try {
			const multiplier = e.shiftKey ? 2 : 1;
			const start = performance.now();
			const direction = key === 'ArrowLeft' || key === 'ArrowUp' ? 1 : -1;
			const leftRight = key === 'ArrowLeft' || key === 'ArrowRight';
			const startOffset = leftRight ? get(graphState.translation.x) : get(graphState.translation.y);
			const endOffset = startOffset + direction * PAN_INCREMENT * multiplier;

			if (!activeIntervals[key]) {
				let interval = setInterval(() => {
					const time = performance.now() - start;

					if (graphState.selectedNodes.size === 0) {
						const movement = startOffset + (endOffset - startOffset) * (time / PAN_TIME);
						graphState.translation = {
							x: leftRight ? movement : get(graphState.translation.x),
							y: leftRight ? get(graphState.translation.y) : movement
						};
					} else {
						const delta = {
							x: leftRight ? -direction * 2 : 0,
							y: leftRight ? 0 : -direction * 2
						};
						Array.from(graphState.selectedNodes).forEach((node) => {
							const currentPosition = get(node.position);
							let groupBox: GroupBox | undefined;
							const groupName = get(node.group);

							const groupBoxes = get(graphState.groupBoxes);

							if (groupName) groupBox = groupBoxes.get(groupName);
							if (groupBox) {
								const nodeWidth = get(node.dimensions.width);
								const nodeHeight = get(node.dimensions.height);
								const bounds = calculateRelativeBounds(groupBox, nodeWidth, nodeHeight);
								moveElementWithBounds(currentPosition, delta, node.position, bounds);
							} else {
								moveElement(currentPosition, delta, node.position);
							}
						});
					}
				}, 2);
				activeIntervals[key] = interval;
			}
		} catch (error) {
			console.error('Error handling arrow key event:', error);
		}
	}
</script>

<section
	role="presentation"
	id={graph.id}
	class="svelvet-wrapper"
	{title}
	style:width={width ? width + 'px' : '100%'}
	style:height={height ? height + 'px' : '100%'}
	style:cursor={pannable ? 'move' : 'default'}
	onwheel={handleScroll}
	onmousedown={onMouseDown}
	ontouchend={onMouseUp}
	ontouchstart={onTouchStart}
	onkeydown={handleKeyDown}
	onkeyup={handleKeyUp}
	bind:this={graphState.graphDOMElement}
	tabindex={0}
>
	<GraphRenderer isMovable={graphState.isMovable}>
		{#if graphState.editing}
			<Editor {graphState.editing} />
		{/if}
		<slot />
	</GraphRenderer>

	{#if backgroundExists}
		<slot name="background" />
	{:else}
		<Background />
	{/if}
	{#if minimap}
		<svelte:component this={graphState.minimapComponent} />
	{/if}
	{#if controls}
		<svelte:component this={graphState.controlsComponent} />
	{/if}
	{#if toggle}
		<svelte:component this={graphState.toggleComponent} />
	{/if}
	{#if drawer}
		<svelte:component this={graphState.drawerComponent} />
	{/if}
	{#if contrast}
		<svelte:component this={graphState.contrastComponent} />
	{/if}
	<slot name="minimap" />
	<slot name="drawer" />
	<slot name="controls" />
	<slot name="toggle" />
	<slot name="contrast" />
	{#if graphState.selecting && !disableSelection}
		<SelectionBox 
			creating={graphState.creating} 
			anchor={graphState.anchor} 
			{graph} 
			adding={graphState.adding} 
			color={selectionColor} 
		/>
	{/if}
</section>

<svelte:window
	ontouchend={onMouseUp}
	onmouseup={onMouseUp}
	onresize={updateGraphDimensions}
	onscroll={updateGraphDimensions}
/>

<style>
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
</style>
