<!--
@component GroupBoxRenderer
A component that renders group boxes for grouped nodes in the graph.
-->
<svelte:options runes={true} />

<script lang="ts">
	import { getContext } from 'svelte';
	import type { Graph } from '../../Graph/Graph.types';
	import type { GraphDimensions } from '../../types';
	import type { Snippet } from 'svelte';

	interface Props {
		onGroupClick?: (position: { x: number; y: number }) => void;
		groupContent?: Snippet<[string, GraphDimensions]>;
	}

	let { onGroupClick, groupContent } = $props();
	const graph = getContext<Graph>('graph');
	let groupBoxes = $state<Map<string, GraphDimensions>>(new Map());

	$effect(() => {
		if (graph?.groupBoxes) {
			groupBoxes = graph.groupBoxes;
		}
	});

	function handleClick(event: MouseEvent, groupBox: GraphDimensions) {
		onGroupClick?.({
			x: event.clientX,
			y: event.clientY
		});
	}
</script>

{#each [...groupBoxes] as [groupId, groupBox]}
	{#if groupContent}
		{@render groupContent(groupId, groupBox)}
	{:else}
		<button
			type="button"
			class="group-box"
			style:left="{groupBox.left}px"
			style:top="{groupBox.top}px"
			style:width="{groupBox.width}px"
			style:height="{groupBox.height}px"
			onclick={(e) => handleClick(e, groupBox)}
			aria-label="Group box {groupId}"
		></button>
	{/if}
{/each}

<style>
	.group-box {
		position: absolute;
		border: 2px dashed var(--default-node-border-color);
		border-radius: 5px;
		pointer-events: all;
		cursor: pointer;
		background-color: transparent;
		transition: background-color 0.2s ease;
		padding: 0;
	}

	.group-box:hover {
		background-color: rgba(var(--default-node-color-rgb, 0, 0, 0), 0.05);
	}
</style>
