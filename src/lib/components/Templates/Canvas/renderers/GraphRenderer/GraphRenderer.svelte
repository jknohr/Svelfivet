<!--
@component GraphRenderer
A component that renders the graph content with proper positioning and scaling.
-->
<svelte:options runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import GroupBoxRenderer from '../GroupBoxRenderer/GroupBoxRenderer.svelte';
	import ZoomPanWrapper from '$lib/components/Organisms/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { moveElement } from '../../utils/movers';
	import type { Graph } from '../../Graph/Graph.types';
	import type { XYPair } from '../../types';
	import { initialClickPosition, tracking } from '../../stores/CursorStore';
	import { captureGroup, moveNodes } from '../../utils/movers';
	import type { GroupKey } from '../../types';

	interface Props {
		children?: Snippet;
		isMovable?: boolean;
	}

	let { children, isMovable = true } = $props();
	const graph = getContext<Graph>('graph');
	const snapTo = getContext<number>('snapTo');

	let activeGroup = $state<GroupKey | null>(null);
	let trackingState = $state(false);
	let cursor = $state(graph.cursor);
	let nodePositions = $state(graph.initialNodePositions);
	let groups = $state(graph.groups);

	$effect(() => {
		if (activeGroup && trackingState) {
			moveNodes(graph, snapTo);
		}
	});

	function handleGroupClick(position: XYPair) {
		if (!graph) return;
		moveElement(position, { x: snapTo || 1, y: snapTo || 1 }, position);
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
