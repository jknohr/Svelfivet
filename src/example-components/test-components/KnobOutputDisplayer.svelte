<script lang="ts">
	import { Node, Anchor } from '$lib';
	import CustomAnchor from './CustomAnchor.svelte';
	import { generateInput, generateOutput } from '$lib';

	type Inputs = {
		bass: number;
		treble: number;
		volume: number;
	};

	type NodeChildrenProps = {
		selected: boolean;
	};

	type AnchorChildrenProps = {
		hovering: boolean;
		connecting: boolean;
		linked: boolean;
	};

	const initialData: Inputs = {
		bass: 2,
		treble: 2,
		volume: 1
	};

	let { selected = $bindable(false) } = $props();
	let hovering = $state(false);
	let connecting = $state(false);
	let linked = $state(false);

	const processor = (inputs: Inputs): Inputs => inputs;
	const inputs = generateInput<Inputs>(initialData);
	const output = generateOutput<Inputs, Inputs>(inputs, processor);
</script>

{/* @ts-ignore */}
<Node useDefaults id={1} position={{ x: 560, y: 650 }} locked bind:selected>
	<div class="node" class:selected>
		{#if $output}
			<p class="output-value">Bass: {$output.bass}</p>
			<p class="output-value">Treble: {$output.treble}</p>
			<p class="output-value">Volume: {$output.volume}</p>
		{/if}
		<div class="input-anchors">
			{#each Object.keys(initialData) as key}
				{/* @ts-ignore */}
				<Anchor id={key} inputsStore={inputs} {key} input>
					<CustomAnchor hovering={false} connecting={false} linked={false} />
				</Anchor>
			{/each}
		</div>
	</div>
</Node>

<style>
	.node {
		box-sizing: border-box;

		border-radius: 8px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		/* gap: 10px; */
	}

	.selected {
		border: solid 2px white;
	}
	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		left: -24px;
		padding-block: 0.7rem;
	}

	.output-value {
		font-size: 1rem;
		line-height: 0;
	}
</style>
