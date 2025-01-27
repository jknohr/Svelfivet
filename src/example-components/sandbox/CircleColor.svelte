<script lang="ts">
	import NodeWrapper from './NodeWrapper.svelte';
	import ColorAnchor from './ColorAnchor.svelte';
	import { ColorPicker, Node, Anchor } from '$lib';
	import type { CSSColorString, CustomWritable } from '$lib';
	import CustomEdge from './CustomEdge.svelte';

	let color = $state<CSSColorString>('#E94646');
	let output = $derived(color);

	const colorStore: CustomWritable<CSSColorString> = {
		subscribe: (fn) => {
			fn(color);
			return () => {};
		},
		set: (value) => color = value,
		update: (fn) => color = fn(color)
	};

	function handleColorChange(newColor: CSSColorString) {
		color = newColor;
	}
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults rotation={-5} position={{ x: 50, y: 400 }}>
	{#snippet node({ selected = false }: { selected: boolean })}
		<p class="note" id="custom">
			Built In
			<br />
			Components
		</p>
		<NodeWrapper title="Color">
			<div class="node-body">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<ColorPicker parameterStore={colorStore} />
			</div>
		</NodeWrapper>
		<div class="output-anchors">
			{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
			<Anchor
				connections={[['output', 'color']]}
				outputStore={output}
				output
				style="bezier"
				edge={CustomEdge}
				locked
			>
				{#snippet anchor({ hovering = false, connecting = false, linked = false }: { hovering: boolean; connecting: boolean; linked: boolean })}
					<ColorAnchor color={colorStore} {connecting} {linked} />
				{/snippet}
			</Anchor>
		</div>
	{/snippet}
</Node>

<style>
	.node-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.output-anchors {
		position: absolute;
		right: -24px;
		top: 8px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.note {
		font-family: 'Reenie Beanie', sans-serif;
		position: absolute;
		top: 10%;
		left: 240px;
		width: 400px;
		transform: rotate(-6deg);
		color: inerhit;
		font-weight: 200px;
		font-size: 30px;
		pointer-events: none;
	}
</style>
