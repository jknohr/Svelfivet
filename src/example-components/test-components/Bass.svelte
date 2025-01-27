<script lang="ts">
	import { Node } from '$lib';
	import { Knob, Resizer } from '$lib';
	import NodeWrapper from '../../example-components/test-components/NodeWrapper.svelte';

	// State management
	let data = $state(2);
	
	// Create store interface for output
	const outputStore = {
		subscribe: (subscriber: (value: number) => void) => {
			subscriber(data);
			return () => {};
		},
		unsubscribe: () => {},
		set: null,
		update: null
	};

	// Props for Knob component
	const knobProps = {
		fixed: 0,
		min: 0,
		max: 20,
		step: 2,
		minDegree: 30,
		maxDegree: 330,
		value: data,
		parameterStore: {
			subscribe: (fn: (value: number) => void) => {
				fn(data);
				return () => {};
			},
			set: (value: number) => data = value,
			update: (fn: (value: number) => number) => data = fn(data)
		}
	};
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults position={{ x: 110, y: 50 }}>
	{#snippet node({ selected = false }: { selected: boolean })}
		<NodeWrapper title="Bass" {outputStore} key="bass">
			<div class="node-body">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Knob 
					fixed={0}
					min={0}
					max={20}
					step={2}
					minDegree={30}
					maxDegree={330}
					value={data}
					parameterStore={{
						subscribe: (fn: (value: number) => void) => {
							fn(data);
							return () => {};
						},
						set: (value: number) => data = value,
						update: (fn: (value: number) => number) => data = fn(data)
					}}
				/>
			</div>
		</NodeWrapper>
		<Resizer width height rotation />
	{/snippet}
</Node>
