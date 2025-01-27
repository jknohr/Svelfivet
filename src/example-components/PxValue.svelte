<script lang="ts">
	import { Node, Resizer } from '$lib';
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node bgColor="red">
	{#snippet node()}
		<div class="node">Pixel Value</div>
		<Resizer width />
	{/snippet}
</Node>

<style>
	.node {
		background-color: blue;
		width: 250px;
		height: 300px;
	}
</style>
