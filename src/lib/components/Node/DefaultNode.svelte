<script lang="ts">
	import Resizer from '$lib/components/Resizer/Resizer.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import { getContext } from 'svelte';
	import type { Node, Direction } from '$lib/types';

	let dynamic = $state(getContext<boolean>('dynamic'));
	
	interface Props {
		node: Node;
		width?: number;
		height?: number;
		locked?: boolean;
		title?: string;
		selected?: boolean;
	}

	let {
		node = getContext<Node>('node'),
		width,
		height,
		locked = false,
		title = '',
		selected = $bindable(false)
	} = $props();

	// Read directly from node properties
	let label = $derived(node.label);
	let borderRadius = $derived(node.borderRadius);
	let textColor = $derived(node.textColor);
	let inputs = $derived(node.inputs);
	let outputs = $derived(node.outputs);
	let resizable = $derived(node.resizable);
	let direction = $derived(node.direction);
	let isTopDown = $derived(direction === 'TD');

	// Base units in pixels
	const BASE = {
		UNIT: 8,
		XXS: 2,    // 0.25 * BASE_UNIT
		XS: 3,     // ~0.382 * BASE_UNIT
		S: 5,      // ~0.618 * BASE_UNIT
		M: 8,      // 1.0 * BASE_UNIT
		L: 13,     // ~1.618 * BASE_UNIT
		XL: 21,    // ~2.618 * BASE_UNIT
		XXL: 34    // ~4.236 * BASE_UNIT
	} satisfies Record<string, number>;

	// Dynamic spacing calculation based on node size
	let nodeScale = $derived(() => {
		const size = Math.min(width, height);
		return Math.max(0.8, Math.min(1.5, Math.log10(size / 100) + 1));
	});

	// Calculate measurements using numeric constants
	let gridGap = $derived(Number(BASE.M) * Number(nodeScale));
	let nodePadding = $derived(Number(BASE.L) * Number(nodeScale));
	let contentMargin = $derived(Number(BASE.XL) * Number(nodeScale));
	
	// Corner radius scaling
	let baseRadius = $derived(Number(BASE.M) * Number(nodeScale));
	let nodeRadius = $derived(Number(BASE.L) * Number(nodeScale));    // Larger radius for nodes
	let inputRadius = $derived(Number(BASE.M) * Number(nodeScale));   // Medium radius for inputs
	let buttonRadius = $derived(Number(BASE.S) * Number(nodeScale));  // Smaller radius for buttons
</script>

{#snippet anchorInput(direction: Direction)}
	<Anchor input direction={direction} />
{/snippet}

{#snippet anchorOutput(direction: Direction)}
	<Anchor output direction={direction} />
{/snippet}

<div 
	class="default-node"
	style:width="{width}px"
	style:height="{height}px"
	style:padding="{nodePadding}px"
	style:border-radius="{nodeRadius}px"
	style:--node-radius="{nodeRadius}px"
	style:--input-radius="{inputRadius}px"
	style:--button-radius="{buttonRadius}px"
	style:--grid-gap="{gridGap}px"
>
	<div class="content">
		{#if dynamic}
			{#each Array(inputs) as _}
				{@render anchorInput(isTopDown ? 'north' : 'west')}
			{/each}
			{#each Array(outputs) as _}
				{@render anchorOutput(isTopDown ? 'south' : 'east')}
			{/each}
		{:else}
			<div class="input-anchors" class:top={isTopDown} class:left={!isTopDown}>
				{#each Array(inputs) as _, i (i)}
					{@render anchorInput(isTopDown ? 'north' : 'west')}
				{/each}
			</div>
			<div class="output-anchors" class:bottom={isTopDown} class:right={!isTopDown}>
				{#each Array(outputs) as _, i (i)}
					{@render anchorOutput(isTopDown ? 'south' : 'east')}
				{/each}
			</div>
		{/if}
		<p style:color={textColor}>{label}</p>
	</div>

	{#if resizable}
		<Resizer width height rotation />
	{/if}
</div>

<style>
	.default-node {
		background: var(--node-bg, white);
		box-shadow: 
			0 0 0 var(--node-border-width, 1px) var(--node-border-color, #ccc),
			0 calc(var(--grid-gap, 12px) * 0.25) calc(var(--grid-gap, 12px) * 0.5) rgba(0,0,0,0.1);
		transition: all 0.3s ease;
		transform-style: preserve-3d;
	}

	.content {
		height: 100%;
		display: grid;
		place-items: center;
		gap: var(--grid-gap);
	}

	/* Consistent scaling for child elements */
	:global(.default-node input),
	:global(.default-node textarea) {
		border-radius: var(--input-radius) !important;
		padding: calc(var(--grid-gap) * 0.5) !important;
		border: 1px solid var(--node-border-color, #ccc);
		transition: all 0.3s ease;
	}

	:global(.default-node button) {
		border-radius: var(--button-radius) !important;
		padding: calc(var(--grid-gap) * 0.5) calc(var(--grid-gap) * 0.75) !important;
		transition: all 0.3s ease;
	}

	/* Ensure child nodes inherit scaling */
	:global(.default-node .svelvet-node) {
		border-radius: var(--node-radius) !important;
		transition: all 0.3s ease;
	}

	.input-anchors,
	.output-anchors {
		display: flex;
		position: absolute;
		justify-content: center;
		align-items: center;
		z-index: 1;
		pointer-events: none;
		/* outline: solid 1px red; */
	}

	.top,
	.bottom {
		width: 100%;
		justify-content: space-around;
	}

	.top {
		transform: translate(0px, -50%);
		top: 0px;
	}

	.bottom {
		transform: translate(0px, 50%);
		bottom: 0px;
	}

	.left,
	.right {
		height: 100%;
		flex-direction: column;
		justify-content: space-around;
	}

	.left {
		transform: translate(-50%);
		left: 0px;
	}

	.right {
		transform: translate(50%);
		right: 0px;
	}
</style>
