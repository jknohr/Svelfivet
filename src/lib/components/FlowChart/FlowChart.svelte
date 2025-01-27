<script lang="ts">
	import type { Graph, NodeConfig, NodeKey, Node as NodeType, EdgeStyle, EndStyle, XYPair } from '$lib/types';
	import type { FlowChart } from '$lib/types/parser';
	import type { SvelteComponent } from 'svelte';
	import Node from '../Node/Node.svelte';
	import { onMount, getContext, setContext } from 'svelte';
	import { flowChartDrawer } from '$lib/utils/drawers/flowchartDrawer';
	import { flowChartParser } from '$lib/utils/helpers/parser';
	import { get } from 'svelte/store';

	interface Props {
		mermaid: string;
		mermaidConfig: Record<string, NodeConfig>;
		nodeTemplate?: (node: any) => { component: any; props: any };
		theme?: string;
		id?: number;
		snapTo?: number;
		zoom?: number;
		TD?: boolean;
		editable?: boolean;
		locked?: boolean;
		width?: number;
		height?: number;
		minimap?: boolean;
		controls?: boolean;
		toggle?: boolean;
		drawer?: boolean;
		contrast?: boolean;
		fitView?: boolean;
		selectionColor?: string;
		edgeStyle?: EdgeStyle;
		endStyles?: [EndStyle | null, EndStyle | null];
		edge?: SvelteComponent | null;
		disableSelection?: boolean;
		translation?: XYPair;
		trackpadPan?: boolean;
		modifier?: string;
		raiseEdgesOnSelect?: boolean;
		edgesAboveNode?: boolean;
		title?: string;
		fixedZoom?: boolean;
		pannable?: boolean;
	}

	let { mermaid = '', mermaidConfig = {}, nodeTemplate, theme = 'light' } = $props();

	const flowChart: FlowChart = flowChartParser(mermaid);
	setContext('flowchart', flowChart);

	const grid = flowChartDrawer(flowChart);
	const graph = getContext<Graph>('graph');

	const MIN_X_SPACE = 100;
	const MIN_Y_SPACE = 100;

	let nodeList = $state<Record<NodeKey, NodeType>>({});
	let nodes = $derived(Object.fromEntries(get(graph.nodes)) as Record<NodeKey, NodeType>);

	onMount(() => {
		let y = 0;
		for (const row of grid) {
			let x = 0;
			let maxHeight = 0;
			for (const node of row) {
				if (!node.ignore) {
					const nodeId = `N-${node.id}` as NodeKey;
					const currentNode = nodes[nodeId];
					if (currentNode) {
						currentNode.position = { x, y };
						x += currentNode.dimensions.width;
						maxHeight = Math.max(maxHeight, currentNode.dimensions.height);
					}
				}
				x += MIN_X_SPACE;
			}
			y += maxHeight + MIN_Y_SPACE;
		}
	});

	// Define default node rendering snippet
	function defaultNode(node: any) {
		return {
			component: Node,
			props: {
				label: node.label,
				id: node.id,
				TD: true,
				...mermaidConfig[node.id],
				connections: node.children.map((id: string) => [id, '1'])
			}
		};
	}
</script>

{#each grid as row}
	{#each row as node}
		{#if !node.ignore}
			{#if nodeTemplate}
				{@render nodeTemplate(node)}
			{:else}
				<Node
					label={node.label}
					id={node.id}
					TD={true}
					{...mermaidConfig[node.id]}
					connections={node.children.map((id) => [id, '1'])}
				/>
			{/if}
		{/if}
	{/each}
{/each}
