<script lang="ts">
	import { Slider, Node } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';
	import type { CustomWritable } from '$lib';

	let num = $state(0.9);
	let output = $derived(num);

	const parameterStore: CustomWritable<number> = {
		subscribe: (fn) => {
			fn(num);
			return () => {};
		},
		set: (value) => num = value,
		update: (fn) => num = fn(num)
	};
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults position={{ x: 320, y: 550 }}>
	{#snippet node({ destroy = null }: { destroy: null | (() => void) })}
		<NodeWrapper {destroy} title="Noise" outputStore={output} key="noise">
			<div class="node-body">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Slider min={0} max={1} fixed={2} step={0.01} {parameterStore} />
			</div>
		</NodeWrapper>
	{/snippet}
</Node>

<style>
	.node-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
