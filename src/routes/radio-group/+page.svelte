<script lang="ts">
	import { Svelvet, Node, RadioGroup } from '$lib';
	import { generateInput } from '$lib';

	// Type your input structure
	type InputStructure = {
		option: string;
	};

	// Create initial values for your parameters
	const initialData = {
		option: 'multiply'
	};

	// Generate a formatted inputs store
	const inputs = generateInput(initialData);

	// Specify processor function
	const processor = (inputs: any) => {
		return inputs.option;
	};

	// Generate output store
	const output = $derived(processor(inputs));

	interface NodeProps {
		grabHandle: (node: HTMLElement) => void;
		selected: boolean;
	}
</script>

<Svelvet width={1000} height={1000}>
	<Node width={400} height={200} useDefaults>
		{#snippet node({ grabHandle, selected }: NodeProps)}
			<div class="node" use:grabHandle class:selected>
				<RadioGroup
					options={['subtract', 'add', 'multiply', 'divide']}
					parameterStore={inputs.option}
				/>
			</div>
		{/snippet}
	</Node>
	<Node width={400} height={200} position={{ x: 0, y: 300 }} useDefaults>
		{#snippet node({ grabHandle, selected }: NodeProps)}
			<div class="node" use:grabHandle class:selected>
				{output}
			</div>
		{/snippet}
	</Node>
</Svelvet>

<style>
	.node {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.node.selected {
		outline: 2px solid var(--selection-color, #00ff00);
	}
</style>
