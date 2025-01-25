<script lang="ts">
	import GroupBoxRenderer from '$lib/renderers/GroupBoxRenderer/GroupBoxRenderer.svelte';
	import ZoomPanWrapper from '$lib/containers/ZoomPanWrapper/ZoomPanWrapper.svelte';
	import { initialClickPosition, tracking } from '$lib/stores/CursorStore';
	import { captureGroup, moveNodes } from '$lib/utils/movers/';
	import { getContext } from 'svelte';
	import type { Graph } from '$lib/types';

	const graph = getContext<Graph>('graph');
	const snapTo = getContext<number>('snapTo');

	$props = {
		isMovable: false
	};

	$state = {
		activeGroup: graph.activeGroup,
		groups: graph.groups,
		initialNodePositions: graph.initialNodePositions,
		cursor: graph.cursor
	};

	$derived activeGroup = $state.activeGroup;
	$derived tracking = tracking;
	$derived cursor = $state.cursor;
	$derived initialNodePositions = $state.initialNodePositions;
	$derived groups = $state.groups;

	$effect(() => {
		if ($activeGroup && $tracking) {
			moveNodes(graph, snapTo);
		}
	});

	function handleGroupClicked(event: CustomEvent) {
		$tracking = true;
		const { groupName } = event.detail;
		$activeGroup = groupName;
		$initialClickPosition = $cursor;
		$initialNodePositions = captureGroup($groups[groupName].nodes);
	}
</script>

<ZoomPanWrapper {...$props}>
	<slot />
	<GroupBoxRenderer ongroupclick={handleGroupClicked} />
</ZoomPanWrapper>
