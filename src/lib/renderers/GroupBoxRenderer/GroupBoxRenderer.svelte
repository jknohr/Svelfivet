<script lang="ts">
	import type { Graph } from '$lib/types';
	import GroupBoundingBox from '$lib/components/Group/GroupBoundingBox.svelte';
	import { getContext } from 'svelte';

	const graph = getContext<Graph>('graph');
	let { onclick } = $props();

	let groupBoxes = $state(graph.groupBoxes);

	function handleGroupClick(groupName: string) {
		onclick?.(groupName);
	}
</script>

{#each Array.from(groupBoxes) as [id, group] (id)}
	<GroupBoundingBox {...group} groupName={id} onclick={handleGroupClick} />
{/each}
