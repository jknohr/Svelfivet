<!--
@component GraphRenderer
A component that renders the graph content with proper positioning and scaling.
-->
<svelte:options runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';
	import GroupBoxRenderer from '../GroupBoxRenderer/GroupBoxRenderer.svelte';
	import ZoomPanWrapper from '$lib/components/Organisms/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { moveElement } from '../../utils/movers';
	import type { Graph } from '../../Graph/Graph.types';
	import type { XYPair } from '../../types';
	import { captureGroup, moveNodes } from '../../utils/movers';
	import type { GroupKey } from '../../types';

	interface Props {
		children?: Snippet;
		isMovable?: boolean;
		graph: Graph;
		snapTo?: number;
	}

	let { children, isMovable = true, graph, snapTo = 1 } = $props();

	// State declarations
	let activeGroup = $state<GroupKey | "selected" | undefined>(undefined);
	let trackingState = $state(false);
	let cursor = $state(graph.cursor);
	let nodePositions = $state(graph.initialNodePositions);
	let groups = $state(graph.groups);
	let initialClick = $state<XYPair>({ x: 0, y: 0 });
	let isTracking = $state(false);

	// Derived state
	let extendedGraph = $derived({
		...graph,
		initialClick,
		tracking: isTracking,
		activeGroup: graph.activeGroup ?? undefined
	});

	$effect(() => {
		if (activeGroup && trackingState) {
			moveNodes(extendedGraph, snapTo);
		}
	});

	function handleGroupClick(position: XYPair) {
		if (!graph) return;
		moveElement(position, { x: snapTo, y: snapTo }, position);
	}
</script>

<ZoomPanWrapper {isMovable}>
	{#if children}
		{@render children()}
	{/if}
	<GroupBoxRenderer onGroupClick={handleGroupClick} groupContent={undefined} />
</ZoomPanWrapper>

<style>
	:global(.graph-renderer) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		pointer-events: auto;
	}
</style>
