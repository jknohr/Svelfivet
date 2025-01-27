<script lang="ts">
	import { Controls } from '$lib';

	// Props
	let { 
		zoomIn = $bindable(), 
		zoomOut = $bindable(), 
		fitView = $bindable(), 
		unhideAll = $bindable() 
	} = $props();
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Controls corner="SW">
	{#snippet controls()}
		<div class="controls">
			<button onclick={zoomIn}>ZOOMER</button>
			<button onclick={zoomOut}>UN ZOOMER</button>
		</div>
	{/snippet}
</Controls>

<style>
	.controls {
		display: flex;
		gap: 0.5rem;
	}
</style>
