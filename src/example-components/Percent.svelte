<script lang="ts">
	import { Node, Resizer } from '$lib';
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node dimensions={{ width: 220, height: 87 }}>
	{#snippet node()}
		<div class="node">Percent Value</div>
		<Resizer width />
	{/snippet}
</Node>

<style>
	.node {
		background-color: green;
		width: 100%;
		height: 100%;
	}
</style>
