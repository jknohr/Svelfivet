<script context="module" lang="ts">
	import Resizer from '$lib/components/Resizer/Resizer.svelte';
	import Anchor from '$lib/components/Anchor/Anchor.svelte';
	import { get } from 'svelte/store';
	import { getContext } from 'svelte';
	import type { Node } from '$lib/types';
</script>

<script lang="ts">
	const dynamic = getContext<boolean>('dynamic');
	const node = getContext<Node>('node');

	$props = {
		selected: false
	};

	// External stores
	const label = node.label;
	const borderRadius = node.borderRadius;
	const textColor = node.textColor;
	const inputs = node.inputs;
	const outputs = node.outputs;
	const resizable = node.resizable;

	//Subscriptions
	const direction = get(node.direction);
	const isTopDown = direction === 'TD';
</script>

{#snippet anchorInput(direction)}
	<Anchor onconnection ondisconnection input direction={direction} />
{/snippet}

{#snippet anchorOutput(direction)}
	<Anchor onconnection ondisconnection output direction={direction} />
{/snippet}

<div class:selected class="default-node" style:border-radius="{$borderRadius}px">
	{#if dynamic}
		{#each { length: $inputs } as _}
			{@render anchorInput(isTopDown ? 'north' : 'west')}
		{/each}
		{#each { length: $outputs } as _}
			{@render anchorOutput(isTopDown ? 'south' : 'east')}
		{/each}
	{:else}
		<div class="input-anchors" class:top={isTopDown} class:left={!isTopDown}>
			{#each { length: $inputs } as _, i (i)}
				{@render anchorInput(isTopDown ? 'north' : 'west')}
			{/each}
		</div>
		<div class="output-anchors" class:bottom={isTopDown} class:right={!isTopDown}>
			{#each { length: $outputs } as _, i (i)}
				{@render anchorOutput(isTopDown ? 'south' : 'east')}
			{/each}
		</div>
	{/if}
	<p style:color={$textColor}>{$label}</p>

	{#if $resizable}
		<Resizer width height rotation />
	{/if}
</div>

<style>
	.default-node {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		width: inherit;
		height: inherit;
	}
	p {
		font-size: 20px;
		line-height: 20px;
		text-align: center;
		user-select: none;
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
