<script lang="ts">
	import { Node, Slider } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';
	import type { CustomWritable } from '$lib/types';

	// State
	let length = $state(26);

	// Create a store interface for the output
	let outputStore = {
		subscribe: (subscriber: (value: number) => void) => {
			subscriber(length);
			return () => {};
		},
		unsubscribe: () => {},
		set: null,
		update: null
	};

	// Props
	let { value = $bindable(length) } = $props<{
		value?: number;
	}>();

	// Update length when value changes
	$effect(() => {
		length = value;
	});
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults position={{ x: 40, y: 158 }}>
	{#snippet node({ selected = false }: { selected: boolean })}
		{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
		<NodeWrapper title="Dash Count" {outputStore} key="dashCount">
			<div class="node-body">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Slider 
					min={0} 
					fixed={0} 
					max={30} 
					step={1} 
					parameterStore={{
						subscribe: (fn: (value: number) => void) => {
							fn(length);
							return () => {};
						},
						set: (value: number) => length = value,
						update: (fn: (value: number) => number) => length = fn(length)
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
		gap: 5px;
	}
</style>
