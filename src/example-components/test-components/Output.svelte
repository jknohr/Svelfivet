<script lang="ts">
	import Visualizer from './Visualizer.svelte';
	import CustomAnchor from './CustomAnchor.svelte';
	import ColorAnchor from './ColorAnchor.svelte';
	import { Node, Anchor } from '$lib';
	import type { CSSColorString } from '$lib';

	// Type definitions
	type State = {
		strokeWidth: number;
		dashCount: number;
		scale: number;
		animation: number;
		color: CSSColorString;
		noise: number;
	};

	type AnchorProps = {
		hovering: boolean;
		connecting: boolean;
		linked: boolean;
	};

	type InputValue = number | CSSColorString;

	// State management
	let state = $state<State>({
		strokeWidth: 2,
		dashCount: 10,
		scale: 5,
		animation: 0,
		color: 'red' as CSSColorString,
		noise: 1
	});

	// Derived state
	let output = $derived(state);

	// Event handlers
	function handleAnimationReset() {
		state.animation = 0;
	}

	function handleInputChange(key: keyof State, value: InputValue) {
		// @ts-ignore - Type inference issue with index signatures
		state[key] = value;
	}
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults id={1} position={{ x: 560, y: 30 }} locked>
	{#snippet node({ selected }: { selected: boolean })}
		<div class="node" class:selected>
			<Visualizer {...output} />
			<div class="input-anchors">
				{#each Object.keys(state) as key}
					{#if key === 'color'}
						{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
						<Anchor id={key} value={state[key]} onchange={(v: CSSColorString) => handleInputChange(key as keyof State, v)} input locked>
							{#snippet anchor({ connecting, linked }: AnchorProps)}
								{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
								<ColorAnchor color={state[key]} {connecting} {linked} />
							{/snippet}
						</Anchor>
					{:else if key === 'animation'}
						{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
						<Anchor
							id={key}
							value={state[key]}
							onchange={(v: number) => handleInputChange(key as keyof State, v)}
							ondisconnect={handleAnimationReset}
							input
						>
							{#snippet anchor({ hovering, connecting, linked }: AnchorProps)}
								<CustomAnchor {hovering} {connecting} {linked} />
							{/snippet}
						</Anchor>
					{:else}
						{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
						<Anchor 
							id={key} 
							value={state[key]} 
							onchange={(v: number) => handleInputChange(key as keyof State, v)} 
							input
						>
							{#snippet anchor({ hovering, connecting, linked }: AnchorProps)}
								<CustomAnchor {hovering} {connecting} {linked} />
							{/snippet}
						</Anchor>
					{/if}
				{/each}
			</div>
		</div>
	{/snippet}
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

	.selected {
		border: solid 2px white;
	}

	.input-anchors {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
		left: -24px;
	}
</style>
