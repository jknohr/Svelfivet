<script lang="ts">
	import { Node } from '$lib';
	import { Knob } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	// State management
	let treble = $state(2);

	// Create store interface for output
	let outputStore = {
		subscribe: (subscriber: (value: number) => void) => {
			subscriber(treble);
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
		value: treble
	};

	// Event handlers
	function handleKnobChange(newValue: number) {
		treble = newValue;
	}
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults position={{ x: 110, y: 150 }}>
	{#snippet node({ selected }: { selected: boolean })}
		<NodeWrapper title="Treble" {outputStore} key="treble">
			<div class="node-body">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Knob {...knobProps} onchange={handleKnobChange} />
			</div>
		</NodeWrapper>
	{/snippet}
</Node>

<style>
	.node-body {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}
</style>
