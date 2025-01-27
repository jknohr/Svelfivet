<script lang="ts">
	import { Node, Slider } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	// State management
	let num = $state(0.9);
	
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

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults position={{ x: 320, y: 550 }}>
	{#snippet node({ destroy = () => {} })}
		<NodeWrapper {destroy} title="Noise" {outputStore} key="noise">
			<div class="node-body">
				<Slider 
					min={0} 
					max={1} 
					fixed={2} 
					step={0.01} 
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
