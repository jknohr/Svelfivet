<script lang="ts">
	import type { FlowChartProps, NodeId, Position } from './FlowChart.types';
	import type { Graph } from '$lib/components/Templates/Canvas/Graph/Graph.types';
	import Node from '../Node/Node.svelte';
	import { onMount } from 'svelte';
	import { flowChartDrawer } from '$lib/utils/drawers/flowchartDrawer';
	import { flowChartParser } from '$lib/utils/helpers/parser';
	import { getContext } from 'svelte';

	const props = $props();
	const flowChart = flowChartParser(props.mermaid || '');
	const grid = flowChartDrawer(flowChart);
	const graph = getContext<Graph>('graph');

	const MIN_X_SPACE = 100;
	const MIN_Y_SPACE = 100;

	// Track node positions
	let nodePositions = $state<Record<NodeId, Position>>({});

	onMount(() => {
		let y = 0;
		for (const row of grid) {
			let x = 0;
			for (const node of row) {
				if (!node.ignore) {
					nodePositions[node.id] = { x, y };
					x += MIN_X_SPACE;
				}
			}
			y += MIN_Y_SPACE;
		}
	});
</script>

{#each grid as row}
	{#each row as node}
		{#if !node.ignore}
			{#if props.nodeTemplate && node.label}
				{@const { component: Component, props: nodeProps } = props.nodeTemplate(node)}
				<Component {...nodeProps} />
			{:else}
				<Node
					label={node.label}
					id={node.id}
					position={nodePositions[node.id]}
					{...props.mermaidConfig?.[node.id]}
					connections={node.children.map((id) => [id, '1'])}
				/>
			{/if}
		{/if}
	{/each}
{/each}
