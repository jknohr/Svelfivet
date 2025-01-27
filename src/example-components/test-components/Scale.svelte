<script lang="ts">
	import Visualizer from './Visualizer.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import ColorAnchor from './ColorAnchor.svelte';
	import { Node, Anchor } from '$lib';
	import { generateInput, generateOutput, type CSSColorString } from '$lib';

	type Inputs = {
		strokeWidth: number;
		dashCount: number;
		scale: number;
		animation: number;
		color: CSSColorString;
		noise: number;
	};

	// Initialize state
	let inputs = $state<Inputs>({
		strokeWidth: 2,
		dashCount: 10,
		scale: 5,
		animation: 0,
		color: 'red' as CSSColorString,
		noise: 1
	});

	// Derived state for output
	let output = $derived({ ...inputs });

	// Handle animation reset
	function resetAnimation() {
		inputs.animation = 0;
	}
</script>

<!-- @component
Props:
- id: number
- position: { x: number, y: number }
- locked: boolean
-->
{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults id={2} position={{ x: 560, y: 30 }} locked>
	<div class="node">
		{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
		<Visualizer {...output} />
		<div class="input-anchors">
			{#each Object.keys(inputs) as key}
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Anchor 
					id={key} 
					{inputs} 
					{key} 
					input={true}
					locked={key === 'color'}
					onclick={key === 'animation' ? resetAnimation : undefined}
				>
					{#if key === 'color'}
						{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
						<ColorAnchor 
							color={inputs.color} 
							connecting={false} 
							linked={false} 
						/>
					{:else}
						<CustomAnchor 
							hovering={false} 
							connecting={false} 
							linked={false} 
						/>
					{/if}
				</Anchor>
			{/each}
		</div>
	</div>
</Node>

<style>
	.node {
		box-sizing: border-box;
		width: 400px;
		height: 400px;
		border-radius: 8px;
		position: relative;
		pointer-events: auto;
		display: flex;
		flex-direction: column;
		padding: 10px;
		gap: 10px;
	}

	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		left: -24px;
	}
</style>
