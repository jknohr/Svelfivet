<script lang="ts">
	import { Node, Slider } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	// State management
	let num = $state(56 - Math.random() * 4);
	
	// Create store interface for output
	const outputStore = {
		subscribe: (subscriber: (value: number) => void) => {
			subscriber(num);
			return () => {};
		},
		unsubscribe: () => {},
		set: null,
		update: null
	};
</script>

// @ts-ignore - Library type definitions need updating for Svelte 5
<Node useDefaults id={1} position={{ x: 40, y: 268 }} >
	{#snippet node({ selected = false })}
		<NodeWrapper title="Scale" {outputStore} key="scale">
			<div class="node-body">
				<Slider 
					min={25} 
					max={90} 
					step={1} 
					parameterStore={{
						subscribe: (fn) => {
							fn(num);
							return () => {};
						},
						set: (value) => num = value,
						update: (fn) => num = fn(num)
					}}
				/>
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
