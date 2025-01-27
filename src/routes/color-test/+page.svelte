<script lang="ts">
	import { Svelvet, Node, ColorPicker, type CSSColorString } from '$lib';
	import { generateInput, generateOutput, Anchor } from '$lib';
	import CustomEdge from '../../example-components/CustomEdge.svelte';
	import ColorAnchor from '../../example-components/test-components/ColorAnchor.svelte';

	let nodeColor = $state('#E94646');
	let inputs = $state(generateInput({ color: nodeColor }));
	
	const processor = (inputs: { color: string }) => inputs.color;
	const output = $derived(generateOutput(inputs, processor));
</script>

<Svelvet minimap controls theme="light" width={800} height={800}>
	<Node width={350} height={100} useDefaults position={{ x: 100, y: 200 }}>
		<ColorPicker parameterStore={inputs.color} />
		<Anchor
			connections={[['output', 'color']]}
			outputStore={output}
			output
			edgeColor={output}
			edgeLabel="Dynamic Edges"
			edgeStyle="bezier"
			edge={CustomEdge}
			locked
		>
			<ColorAnchor color={output} />
		</Anchor>
	</Node>
	<!-- <Drawer height={750}/> -->
	<!-- Bind the node's color to the variable -->
	<!-- <Node --node-color={nodeColor} --node-border-radius="40px" id="node2" label="test" /> -->
</Svelvet>
