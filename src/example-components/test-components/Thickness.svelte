<script lang="ts">
	import { Node, Slider } from '$lib';
	import NodeWrapper from './NodeWrapper.svelte';

	// State management
	let width = $state(2.5);
	
	// Create store interface for output
	const outputStore = {
		subscribe: (subscriber: (value: number) => void) => {
			subscriber(width);
			return () => {};
		},
		unsubscribe: () => {},
		set: null,
		update: null
	};

	// Handle width changes
	function handleWidthChange(newValue: number) {
		width = newValue;
	}
</script>

// @ts-ignore - Library type definitions need updating for Svelte 5
<Node useDefaults position={{ x: 40, y: 50 }} >
	{#snippet node({ selected = false })}
		<span class="note" id="custom">Custom Nodes</span>
		<NodeWrapper title="Line Thickness" {outputStore} key="strokeWidth">
			<div class="node-body">
				<Slider 
					min={1} 
					max={12} 
					fixed={1} 
					step={0.1} 
					parameterStore={{
						subscribe: (fn) => {
							fn(width);
							return () => {};
						},
						set: (value) => width = value,
						update: (fn) => width = fn(width)
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

	.note {
		font-family: 'Reenie Beanie', sans-serif;
		position: absolute;
		top: -20px;
		left: 40px;
		width: 400px;
		transform: rotate(3deg);
		color: inerhit;
		font-weight: 200px;
		font-size: 30px;
		pointer-events: none;
	}
</style>
