<script lang="ts">
	import Edge from '$lib/components/Edge/Edge.svelte';
	import type { CSSColorString } from '$lib/types';

	let color = $state<CSSColorString>('yellow');
	let edge = $state<Edge>();
	let connections = $state<Array<number | string>>([]);

	function handleDestroy() {
		connections = [];
	}
</script>

<Edge
	{color}
	bind:this={edge}
	width={4}
	{connections}
	labelPosition={0.8}
	animate
>
	<div class="label">
		<button id="destroy-edge" on:pointerdown={handleDestroy}>Custom Label</button>
	</div>
</Edge>

<style>
	#destroy-edge {
		background-color: #fff;
		border: none;
		border-radius: 5px;
		padding: 5px;
	}
	.label {
		pointer-events: all;
	}
</style>
