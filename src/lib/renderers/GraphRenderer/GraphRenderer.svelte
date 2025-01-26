<script lang="ts">
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes } from '$lib/utils/movers/';
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/types';

	const graph = getContext<Graph>('graph');
	const snapTo = getContext<number>('snapTo');

	let { isMovable = false, children } = $props();

	let activeGroup = $state(null);
	let trackingState = $state(false);
	let cursor = $state(graph.cursor);
	let nodePositions = $state(graph.initialNodePositions);
	let groups = $state(graph.groups);

	$effect(() => {
		if (activeGroup && trackingState) {
			moveNodes(graph, snapTo);
		}
	});

	function handleGroupClick(groupName: string) {
		trackingState = true;
		activeGroup = groupName;
		initialClickPosition.set(cursor);
		nodePositions = captureGroup(groups[groupName].nodes);
	}
</script>

<ZoomPanWrapper {isMovable}>
	{@render children?.()}
	<GroupBoxRenderer onclick={handleGroupClick} />
</ZoomPanWrapper>
