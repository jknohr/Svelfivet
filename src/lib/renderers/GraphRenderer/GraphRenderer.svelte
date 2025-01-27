<script lang="ts">
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes } from '$lib/utils/movers/';
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/types';
	import type { XYPair } from '$lib/types';

	const graph = getContext<Graph>('graph');
	const snapTo = getContext<number>('snapTo');

	interface Props {
		isMovable: boolean;
		children?: any;
	}

	let { isMovable, children } = $props();

	let activeGroup = $state<string | null>(null);
	let trackingState = $state(false);
	let cursor = $state(graph.cursor);
	let nodePositions = $state(graph.initialNodePositions);
	let groups = $state(graph.groups);

	$effect(() => {
		if (activeGroup && trackingState) {
			moveNodes(graph, snapTo);
		}
	});

	function handleGroupClick(event: CustomEvent) {
		trackingState = true;
		const { groupName } = event.detail;
		activeGroup = groupName;
		initialClickPosition.set(cursor);
		nodePositions = captureGroup(groups[groupName].nodes);
	}
</script>

<ZoomPanWrapper {isMovable}>
	{@render children()}
	<GroupBoxRenderer on:groupClick={handleGroupClick} />
</ZoomPanWrapper>
