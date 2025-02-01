<!--
@component Svelvet
A Svelte 5 graph component that manages the overall graph state and rendering.
-->
<svelte:options runes={true} />

<script lang="ts">
	import type { Graph } from '../Graph/Graph.types';
	import type { EdgeStore } from '../types/stores';
	import type { EndStyle } from '$lib/components/Organisms/Edge/Edge.types';
	import type { WritableEdge } from '$lib/components/Organisms/Edge/Edge.types';
	import { onMount, setContext } from 'svelte';
	import { createGraph } from '../utils/creators/createGraph';
	import { reloadStore } from '../utils/savers/reloadStore';
	import GraphRenderer from '../renderers/GraphRenderer/GraphRenderer.svelte';
	import FlowChart from '$lib/components/Organisms/FlowChart/FlowChart.svelte';
	import type {
		CSSColorString,
		NodeKey,
		Node,
		Anchor,
		GraphKey,
		XYPair
	} from '../types';
	import type { Snippet } from 'svelte';
	import type { GraphStateManager, SvelvetProps } from './Svelvet.types';
	import type { SvelteComponent } from 'svelte';
	import { createGraphStateManager } from '../utils/creators/createGraphStateManager';

	// Props declaration
	let props = $props();

	// State declarations using $state rune
	let stateManager = $state(createGraphStateManager());
	let direction = $state(props.direction || 'LR');
	let graph = $state<Graph | null>(null);
	let edgeStore = $state<EdgeStore | null>(null);
	let edges = $state<WritableEdge[]>([]);

	// Derived state using $derived rune
	let backgroundExists = $derived(!!props.children);
	let isLocked = $derived(!!props.locked);
	let currentZoom = $derived(props.zoom || 1);

	// Context setup
	setContext('snapTo', props.snapTo);
	setContext('edgeStyle', props.edgeStyle);
	setContext('endStyles', props.endStyles);
	setContext('graphEdge', props.edge);
	setContext('raiseEdgesOnSelect', props.raiseEdgesOnSelect);
	setContext('edgesAboveNode', props.edgesAboveNode);
	
	// Effect for graph context
	$effect(() => {
		if (graph) {
			setContext('graph', graph);
		}
	});

	// Initialize graph
	onMount(() => {
		const stateObject = localStorage.getItem('state');
		if (stateObject) {
			const loadedGraph = reloadStore(stateObject);
			if (isValidGraph(loadedGraph)) {
				graph = loadedGraph;
			}
		} else {
			const graphKey = `G-${props.id || 0}` as const;
			const newGraph = createGraph(graphKey, {
				zoom: currentZoom,
				direction,
				editable: props.editable,
				locked: isLocked,
				translation: props.translation,
				edge: props.edge
			});
			if (isValidGraph(newGraph)) {
				graph = newGraph;
			}
		}
	});

	// Type guard for Graph
	function isValidGraph(g: any): g is Graph {
		return g && 
			typeof g.id === 'string' &&
			g.nodes &&
			g.transforms &&
			typeof g.locked === 'boolean' &&
			g.bounds &&
			typeof g.mounted === 'boolean' &&
			g.center &&
			typeof g.maxZIndex === 'number' &&
			g.dimensions &&
			typeof g.editable === 'boolean' &&
			g.direction &&
			g.cursor &&
			g.groups &&
			g.edges &&
			g.groupBoxes &&
			g.initialNodePositions;
	}

	// Effects for state synchronization
	$effect(() => {
		edgeStore = graph?.edges as unknown as EdgeStore | null;
	});

	$effect(() => {
		if (graph) {
			graph.transforms.scale = currentZoom;
		}
	});

	// Event handlers
	function handleEdgeChange(edge: WritableEdge, type: 'connection' | 'disconnection') {
		const detail = {
			sourceAnchor: edge.source,
			targetAnchor: edge.target,
			sourceNode: edge.source.node,
			targetNode: edge.target.node
		};
		
		const event = new CustomEvent(type, { detail });
		dispatchEvent(event);
	}

	$effect(() => {
		if (edgeStore && 'onEdgeChange' in edgeStore) {
			edgeStore.onEdgeChange(handleEdgeChange);
		}
	});

	// Development mode inspection
	$effect.pre(() => {
		// @ts-ignore
		if (import.meta?.env?.DEV) {
			$inspect(stateManager.state, 'Graph State');
			$inspect(graph, 'Graph Instance');
		}
	});
</script>

{#if graph}
	<GraphRenderer isMovable={!isLocked}>
		{#if props.mermaid}
			<FlowChart
				{...props}
				direction={direction}
			/>
		{:else}
			{#if props.children}
				{@render props.children()}
			{/if}
		{/if}
	</GraphRenderer>
{:else}
	<div
		class="svelvet-temp"
		style:width={props.width ? props.width + 'px' : '100%'}
		style:height={props.height ? props.height + 'px' : '100%'}
	></div>
{/if}

<style>
	.svelvet-temp {
		background-color: transparent;
	}
	:root {
		--default-node-border-width: 1.5px;
		--default-node-width: 200px;
		--default-node-height: 100px;
		--default-node-border-radius: 10px;

		--default-node-cursor: grab;
		--default-node-cursor-blocked: not-allowed;
		--default-background-cursor: move;

		--default-anchor-border-width: 1px;
		--default-anchor-radius: 50%;
		--default-anchor-size: 12px;

		--default-edge-width: 2px;

		--default-selection-box-border-width: 1px;

		--shadow-color: 0deg 0% 10%;
		--shadow-elevation-low: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.4),
			0.4px 0.8px 1px -1.2px hsl(var(--shadow-color) / 0.34),
			1px 2px 2.5px -2.5px hsl(var(--shadow-color) / 0.34);
		--shadow-elevation-medium: 0.3px 0.5px 0.7px hsl(var(--shadow-color) / 0.42),
			0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.1),
			2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.1),
			5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.1);

		--default-controls-shadow: var(--shadow-elevation-medium);
		--default-minimap-shadow: var(--shadow-elevation-medium);
		--default-theme-toggle-shadow: var(--shadow-elevation-medium);
	}

	:root {
		--default-node-color: hsl(0, 0%, 95%);
		--default-node-border-color: hsl(0, 0%, 87%);
		--default-node-selection-color: hsl(0, 0%, 13%);
		--default-text-color: hsl(0, 0%, 20%);
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: hsl(0, 0%, 100%);
		--default-dot-color: hsl(0, 0%, 53%);

		--default-accent-color: hsl(0, 0%, 100%);
		--default-primary-color: hsl(0, 0%, 83%);

		--default-selection-box-color: hsl(195, 53%, 79%);

		--default-edge-color: hsl(0, 0%, 40%);
		--default-target-edge-color: hsl(0, 0%, 0%);
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: hsl(0, 0%, 95%);
		--default-label-text-color: hsl(0, 0%, 20%);

		--plugin-border: hsl(0, 0%, 42%);
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: hsl(0, 0%, 67%);
		--default-anchor-border-color: hsl(0, 0%, 100%);

		--default-anchor-connected: hsl(0, 0%, 40%);
		--default-anchor-connected-border: hsl(0, 0%, 95%);

		--default-anchor-connecting: hsl(0, 0%, 40%);
		--default-anchor-connecting-border: hsl(0, 0%, 100%);

		--default-anchor-hovering: hsl(0, 0%, 46%);
		--default-anchor-hovering-border: hsl(0, 0%, 0%);

		--default-minimap-background-color: hsl(0, 0%, 100%);
		--default-minimap-node-color: hsl(0, 0%, 95%);

		--default-controls-background-color: hsl(0, 0%, 100%);
		--default-controls-text-color: hsl(0, 0%, 20%);

		--default-theme-toggle-text-color: hsl(0, 0%, 20%);
		--default-theme-toggle-color: hsl(0, 0%, 100%);

		--default-drawer-button-color: hsl(0, 2%, 89%);
		--default-drawer-button-text-color: hsl(0, 0%, 20%);

		--default-drawer-reset-button-color: hsl(0, 2%, 89%);
		--default-drawer-reset-button-text-color: hsl(0, 0%, 20%);
		--default-drawer-reset-button-hover-color: hsl(0, 0%, 30%);
		--default-drawer-reset-button-hover-text-color: hsl(0, 0%, 100%);
	}

	:root[svelvet-theme='dark'] {
		--default-node-color: hsl(0, 0%, 20%);
		--default-node-border-color: hsl(0, 0%, 7%);
		--default-node-selection-color: hsl(0, 0%, 87%);
		--default-text-color: hsl(0, 0%, 100%);
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: hsl(0, 0%, 27%);
		--default-dot-color: hsl(0, 0%, 60%);

		--default-accent-color: hsl(0, 0%, 7%);
		--default-primary-color: hsl(0, 0%, 66%);

		--default-selection-box-color: hsl(195, 53%, 79%);

		--default-edge-color: hsl(0, 0%, 100%);
		--default-target-edge-color: hsl(0, 0%, 0%);
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: hsl(0, 0%, 20%);
		--default-label-text-color: hsl(0, 0%, 100%);

		--default-anchor-color: hsl(0, 0%, 67%);
		--default-anchor-border-color: hsl(0, 0%, 87%);
		--default-anchor-connected: hsl(0, 0%, 100%);
		--default-anchor-connected-border: hsl(0, 0%, 20%);

		--default-anchor-connecting: hsl(0, 0%, 40%);
		--default-anchor-connecting-border: hsl(0, 0%, 100%);

		--default-anchor-hovering: hsl(0, 0%, 46%);
		--default-anchor-hovering-border: hsl(0, 0%, 0%);

		--plugin-border: hsl(0, 0%, 42%);
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-minimap-background-color: hsl(0, 0%, 27%);

		--default-minimap-node-color: hsl(0, 0%, 20%);

		--default-controls-background-color: hsl(0, 0%, 27%);
		--default-controls-text-color: hsl(0, 0%, 100%);

		--default-theme-toggle-text-color: hsl(0, 0%, 100%);
		--default-theme-toggle-color: hsl(0, 0%, 27%);

		--default-drawer-button-color: hsl(0, 0%, 19%);
		--default-drawer-button-text-color: hsl(0, 0%, 100%);

		--default-drawer-reset-button-color: hsl(0, 0%, 19%);
		--default-drawer-reset-button-text-color: hsl(0, 0%, 89%);
		--default-drawer-reset-button-hover-color: hsl(0, 0%, 59%);
		--default-drawer-reset-button-hover-text-color: hsl(0, 0%, 100%);
	}

	:root[svelvet-theme='light'] {
		--default-node-color: hsl(0, 0%, 95%);
		--default-node-border-color: hsl(0, 0%, 87%);
		--default-node-selection-color: hsl(0, 0%, 13%);
		--default-text-color: hsl(0, 0%, 20%);
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: hsl(0, 0%, 100%);
		--default-dot-color: hsl(0, 0%, 53%);

		--default-accent-color: hsl(0, 0%, 100%);
		--default-primary-color: hsl(0, 0%, 83%);

		--default-selection-box-color: hsl(195, 53%, 79%);

		--default-edge-color: hsl(0, 0%, 40%);
		--default-target-edge-color: hsl(0, 0%, 0%);
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: hsl(0, 0%, 95%);
		--default-label-text-color: hsl(0, 0%, 20%);

		--plugin-border: hsl(0, 0%, 42%);
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: hsl(0, 0%, 67%);
		--default-anchor-border-color: hsl(0, 0%, 100%);

		--default-anchor-connected: hsl(0, 0%, 40%);
		--default-anchor-connected-border: hsl(0, 0%, 95%);

		--default-anchor-connecting: hsl(0, 0%, 40%);
		--default-anchor-connecting-border: hsl(0, 0%, 100%);

		--default-anchor-hovering: hsl(0, 0%, 46%);
		--default-anchor-hovering-border: hsl(0, 0%, 0%);

		--default-minimap-background-color: hsl(0, 0%, 100%);
		--default-minimap-node-color: hsl(0, 0%, 95%);

		--default-controls-background-color: hsl(0, 0%, 100%);
		--default-controls-text-color: hsl(0, 0%, 20%);

		--default-theme-toggle-text-color: hsl(0, 0%, 20%);
		--default-theme-toggle-color: hsl(0, 0%, 100%);

		--default-drawer-button-color: hsl(0, 2%, 89%);
		--default-drawer-button-text-color: hsl(0, 0%, 20%);

		--default-drawer-reset-button-color: hsl(0, 2%, 89%);
		--default-drawer-reset-button-text-color: hsl(0, 0%, 20%);
		--default-drawer-reset-button-hover-color: hsl(0, 0%, 30%);
		--default-drawer-reset-button-hover-text-color: hsl(0, 0%, 100%);
	}

	:root[svelvet-theme='Black/White'] {
		--default-node-color: #ffffff;
		--default-node-border-color: #ffffff;
		--default-node-selection-color: #000000;
		--default-text-color: #000000;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #000000;
		--default-dot-color: #ffffff;

		--default-accent-color: #000000;
		--default-primary-color: #ffffff;

		--default-selection-box-color: #ffffff;

		--default-edge-color: #ffffff;
		--default-target-edge-color: #000000;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #ffffff;
		--default-label-text-color: #000000;

		--plugin-border: #ffffff;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ffffff;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #ffffff;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #ffffff;
		--default-anchor-connecting-border: #000000;

		--default-anchor-hovering: #ffffff;
		--default-anchor-hovering-border: #000000;

		--default-minimap-background-color: #000000;
		--default-minimap-node-color: #ffffff;

		--default-controls-background-color: #000000;
		--default-controls-text-color: #ffffff;

		--default-theme-toggle-text-color: #ffffff;
		--default-theme-toggle-color: #000000;

		--default-drawer-button-color: #ffffff;
		--default-drawer-button-text-color: #000000;

		--default-drawer-reset-button-color: #ffffff;
		--default-drawer-reset-button-text-color: #000000;
		--default-drawer-reset-button-hover-color: #e0e0e0;
		--default-drawer-reset-button-hover-text-color: #000000;
	}

	:root[svelvet-theme='Yellow/Black'] {
		--default-node-color: #ffff00;
		--default-node-border-color: #000000;
		--default-node-selection-color: #000000;
		--default-text-color: #000000;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #ffff00;
		--default-dot-color: #000000;

		--default-accent-color: #000000;
		--default-primary-color: #ffff00;

		--default-selection-box-color: #000000;

		--default-edge-color: #000000;
		--default-target-edge-color: #ffff00;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #000000;
		--default-label-text-color: #ffff00;

		--plugin-border: #000000;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ffff00;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #ffff00;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #ffff00;
		--default-anchor-connecting-border: #000000;

		--default-anchor-hovering: #ffff00;
		--default-anchor-hovering-border: #000000;

		--default-minimap-background-color: #ffff00;
		--default-minimap-node-color: #000000;

		--default-controls-background-color: #ffff00;
		--default-controls-text-color: #000000;

		--default-theme-toggle-text-color: #000000;
		--default-theme-toggle-color: #ffff00;

		--default-drawer-button-color: #ffff00;
		--default-drawer-button-text-color: #000000;

		--default-drawer-reset-button-color: #ffff00;
		--default-drawer-reset-button-text-color: #000000;
		--default-drawer-reset-button-hover-color: #000000;
		--default-drawer-reset-button-hover-text-color: #ffff00;
	}

	:root[svelvet-theme='Black/Yellow'] {
		--default-node-color: #000000;
		--default-node-border-color: #ffff00;
		--default-node-selection-color: #ffff00;
		--default-text-color: #ffff00;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #000000;
		--default-dot-color: #ffff00;

		--default-accent-color: #ffff00;
		--default-primary-color: #000000;

		--default-selection-box-color: #ffff00;

		--default-edge-color: #ffff00;
		--default-target-edge-color: #000000;
		--default-edge-shadow: var (--shadow-elevation-medium);
		--default-label-color: #ffff00;
		--default-label-text-color: #000000;

		--plugin-border: #ffff00;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var (--plugin-border);

		--default-anchor-color: #ffff00;
		--default-anchor-border-color: #0000ff;

		--default-anchor-connected: #ffff00;
			--default-anchor-connected-border: #0000ff;

		--default-anchor-connecting: #ffff00;
		--default-anchor-connecting-border: #0000ff;

		--default-anchor-hovering: #ffff00;
		--default-anchor-hovering-border: #0000ff;

		--default-minimap-background-color: #0000ff;
		--default-minimap-node-color: #ffff00;

		--default-controls-background-color: #0000ff;
		--default-controls-text-color: #ffff00;

		--default-theme-toggle-text-color: #ffff00;
		--default-theme-toggle-color: #0000ff;

		--default-drawer-button-color: #0000ff;
		--default-drawer-button-text-color: #ffff00;

		--default-drawer-reset-button-color: #0000ff;
		--default-drawer-reset-button-text-color: #ffff00;
		--default-drawer-reset-button-hover-color: #ffff00;
		--default-drawer-reset-button-hover-text-color: #0000ff;
	}

	:root[svelvet-theme='Yellow/Blue'] {
		--default-node-color: #ffff00;
		--default-node-border-color: #0000ff;
		--default-node-selection-color: #0000ff;
		--default-text-color: #0000ff;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #ffff00;
		--default-dot-color: #0000ff;

		--default-accent-color: #0000ff;
		--default-primary-color: #ffff00;

		--default-selection-box-color: #0000ff;

		--default-edge-color: #0000ff;
		--default-target-edge-color: #ffff00;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #0000ff;
		--default-label-text-color: #ffff00;

		--plugin-border: #0000ff;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #0000ff;
		--default-anchor-border-color: #ffff00;

		--default-anchor-connected: #0000ff;
		--default-anchor-connected-border: #ffff00;

		--default-anchor-connecting: #0000ff;
		--default-anchor-connecting-border: #ffff00;

		--default-anchor-hovering: #0000ff;
		--default-anchor-hovering-border: #ffff00;

		--default-minimap-background-color: #ffff00;
		--default-minimap-node-color: #0000ff;

		--default-controls-background-color: #ffff00;
		--default-controls-text-color: #0000ff;

		--default-theme-toggle-text-color: #0000ff;
		--default-theme-toggle-color: #ffff00;

		--default-drawer-button-color: #ffff00;
		--default-drawer-button-text-color: #0000ff;

		--default-drawer-reset-button-color: #ffff00;
		--default-drawer-reset-button-text-color: #0000ff;
		--default-drawer-reset-button-hover-color: #0000ff;
		--default-drawer-reset-button-hover-text-color: #ffff00;
	}

	:root[svelvet-theme='Grayscale'] {
		--default-node-color: #666666;
		--default-node-border-color: #f2f2f2;
		--default-node-selection-color: #333333;
		--default-text-color: #f2f2f2;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #333333;
		--default-dot-color: #999999;

		--default-accent-color: #333333;
		--default-primary-color: #999999;

		--default-selection-box-color: #f2f2f2;

		--default-edge-color: #999999;
		--default-target-edge-color: #666666;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #666666;
		--default-label-text-color: #f2f2f2;

		--plugin-border: #999999;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #999999;
		--default-anchor-border-color: #666666;

		--default-anchor-connected: #999999;
		--default-anchor-connected-border: #666666;

		--default-anchor-connecting: #999999;
		--default-anchor-connecting-border: #f2f2f2;

		--default-anchor-hovering: #999999;
		--default-anchor-hovering-border: #f2f2f2;

		--default-minimap-background-color: #333333;
		--default-minimap-node-color: #666666;

		--default-controls-background-color: #333333;
		--default-controls-text-color: #f2f2f2;

		--default-theme-toggle-text-color: #f2f2f2;
		--default-theme-toggle-color: #333333;

		--default-drawer-button-color: #999999;
		--default-drawer-button-text-color: #f2f2f2;

		--default-drawer-reset-button-color: #999999;
		--default-drawer-reset-button-text-color: #f2f2f2;
		--default-drawer-reset-button-hover-color: #f2f2f2;
		--default-drawer-reset-button-hover-text-color: #333333;
	}

	:root[svelvet-theme='Black/Pink'] {
		--default-node-color: #000000;
		--default-node-border-color: #ff69b4;
		--default-node-selection-color: #333333;
		--default-text-color: #ff69b4;
		--default-node-shadow: var(--shadow-elevation-medium);

		--default-background-color: #000000;
		--default-dot-color: #ff69b4;

		--default-accent-color: #333333;
		--default-primary-color: #ff69b4;

		--default-selection-box-color: #ff69b4;

		--default-edge-color: #ff69b4;
		--default-target-edge-color: #000000;
		--default-edge-shadow: var(--shadow-elevation-medium);
		--default-label-color: #000000;
		--default-label-text-color: #ff69b4;

		--plugin-border: #ff69b4;
		--default-controls-border: var(--plugin-border);
		--default-minimap-border: var(--plugin-border);
		--default-theme-toggle-border: var(--plugin-border);

		--default-anchor-color: #ff69b4;
		--default-anchor-border-color: #000000;

		--default-anchor-connected: #ff69b4;
		--default-anchor-connected-border: #000000;

		--default-anchor-connecting: #ff69b4;
		--default-anchor-connecting-border: #333333;

		--default-anchor-hovering: #ff69b4;
		--default-anchor-hovering-border: #333333;

		--default-minimap-background-color: #000000;
		--default-minimap-node-color: #333333;

		--default-controls-background-color: #000000;
		--default-controls-text-color: #ff69b4;

		--default-theme-toggle-text-color: #ff69b4;
		--default-theme-toggle-color: #000000;

		--default-drawer-button-color: #ff69b4;
		--default-drawer-button-text-color: #000000;

		--default-drawer-reset-button-color: #ff69b4;
		--default-drawer-reset-button-text-color: #000000;
		--default-drawer-reset-button-hover-color: #000000;
		--default-drawer-reset-button-hover-text-color: #ff69b4;
	}
</style>
