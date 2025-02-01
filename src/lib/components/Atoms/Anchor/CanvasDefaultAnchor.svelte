<svelte:options runes={true} />

<script lang="ts">
	import type { CSSColorString } from '$lib/types/general';
	import type { ConnectingFrom } from './Anchor.types';
	import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';
	import GlassPane from '$lib/components/Theme/GlassPane.svelte';
	import { createElementRunes } from '$lib/components/Theme/ThemeElements';
	import type { ElementType } from '$lib/components/Theme/ThemeElements';

	// Props using modern Svelte5 style
	let { 
		output = false,
		input = false,
		isConnecting = false,
		isConnected = false,
		isHovering = false,
		bgColor = null,
		// Theme props
		variant = 'light' as GlassEffect,
		glowOnHover = true,
		componentType = 'anchor' as ElementType,
		// Content
		children = undefined
	} = $props();

	// Local state
	let connecting = $state(false);
	let hovering = $state(false);
	let anchorElement = $state<HTMLDivElement | null>(null);

	// Derived values using modern syntax
	let isActive = $derived(isConnecting || isHovering);
	let currentState = $derived(() => {
		if (isConnecting) return 'connecting' as GlassState;
		if (isHovering) return 'hovering' as GlassState;
		if (isConnected) return 'connected' as GlassState;
		return 'default' as GlassState;
	});

	// Compute anchor style
	let anchorStyle = $derived(() => {
		return bgColor ? `--prop-anchor-color: ${bgColor}` : '';
	});

	// Effects using modern syntax
	$effect(() => {
		connecting = isConnecting;
		hovering = isHovering;
	});
</script>

<div
	class="svelvet-anchor"
	class:output
	class:input
	class:connected={isConnected}
	class:connecting={isConnecting}
	class:hovering={isHovering}
	bind:this={anchorElement}
>
	<GlassPane
		{variant}
		state={currentState}
		{glowOnHover}
		{componentType}
		style={anchorStyle}
	>
		{@render children()}
	</GlassPane>
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.svelvet-anchor {
		width: var(--anchor-width, var(--default-anchor-size));
		height: var(--anchor-height, var(--default-anchor-size));
		border-radius: var(--anchor-radius, var(--default-anchor-radius));
		z-index: 12;
		cursor: pointer;
		pointer-events: auto;
	}

	.connecting {
		--glass-state: var(--state-connecting);
	}

	.hovering {
		--glass-state: var(--state-hovering);
	}

	.connected {
		--glass-state: var(--state-connected);
	}

	div {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
</style>
