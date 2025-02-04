<svelte:options runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getContext } from 'svelte';
	import ArrowEdge from './ArrowEdge.svelte';
	import ArrowEdgeBlue from './ArrowEdgeBlue.svelte';
	import { theme } from '$lib/components/Theme/ThemeComposition';

	interface NodeSlotProps {
		grabHandle: (node: HTMLElement) => void;
		selected: boolean;
	}

	let graphConfig = $state({
		theme: theme.config,
		controls: true,
		minimap: true,
		width: 1200,
		height: 800,
		endStyles: [null, 'arrow']
	});

	let nodePositions = $state({
		tdOut: { x: 100, y: 200 },
		tdIn: { x: 100, y: 500 },
		lrOut: { x: 400, y: 200 },
		lrIn: { x: 400, y: 500 }
	});

	let nodeDimensions = $state({
		width: 100,
		height: 100
	});
</script>

<div class="graph-container">
	<GraphRenderer {...graphConfig}>
	<Node
		position={nodePositions.tdOut}
		dimensions={nodeDimensions}
		TD
		label={'TD-OUT'}
		edge={ArrowEdge}
	/>
	<Node position={nodePositions.tdIn} dimensions={nodeDimensions} TD label={'TD-IN'} />
	<Node
		position={nodePositions.lrOut}
		dimensions={nodeDimensions}
		TD
		label={'TD-OUT-B'}
		edge={ArrowEdgeBlue}
	/>
	<Node
		position={nodePositions.lrIn}
		dimensions={nodeDimensions}
		TD
		label={'TD-IN-B'}
	/>

</GraphRenderer>
</div>

<style>
	.graph-container {
		width: 100%;
		height: 100vh;
		background: var(--surface-1);
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.node-content) {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--surface-2);
		border-radius: var(--radius-2);
		box-shadow: var(--shadow-2);
	}

	:global(.node-content:hover) {
		background: var(--surface-3);
	}
</style>

