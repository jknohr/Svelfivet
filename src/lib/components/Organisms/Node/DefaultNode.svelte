<!--
@component DefaultNode
A modern node component with glass effect styling and theme integration.
Features:
- Glass effect styling with hover states
- Dynamic anchor positioning
- Theme system integration
- Full accessibility support
- AR/VR environment support
-->
<svelte:options runes={true} />

<script lang="ts">
	import { getContext } from 'svelte';
	import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
	import type { Direction } from '$lib/types/general';
	import Anchor from '$lib/components/Atoms/Anchor/DefaultAnchor.svelte';
	import GlassPane from '$lib/components/Theme/GlassPane.svelte';
	import { BASE, SPACE_3D } from '$lib/components/Theme/SpatialDesign';

	// Props
	let {
		node,
		width = 200,
		height = 150,
		locked = false,
		title = '',
		selected = $bindable(false),
		nodeContent
	} = $props();

	// Theme context
	const theme = getContext<UnifiedThemeContext>('theme');

	// State
	let isHovered = $state(false);
	let isDragging = $state(false);
	let anchorStates = $state(new Map<string, { isConnecting: boolean; isConnected: boolean; isHovering: boolean }>());

	// Derived values
	let isLocked = $derived(locked);
	let nodeTitle = $derived(title);
	let label = $derived(node?.label);
	let inputs = $derived(node?.inputs ?? 0);
	let outputs = $derived(node?.outputs ?? 0);
	let resizable = $derived(node?.resizable);
	let direction = $derived(node?.direction);
	let isTopDown = $derived(direction === 'TD');

	// Theme-based styles
	let nodeBackground = $derived(theme.components?.node?.background ?? 'rgba(255, 255, 255, 0.1)');
	let nodeBorderColor = $derived(theme.components?.node?.borderColor ?? 'rgba(255, 255, 255, 0.2)');
	let nodeTextColor = $derived(theme.components?.node?.textColor ?? 'inherit');

	// Compute styles as a string
	function computeNodeStyle(width: number, height: number, isLocked: boolean, selected: boolean): string {
		const styles = [];
		if (width) styles.push(`width: ${width}px`);
		if (height) styles.push(`height: ${height}px`);
		if (isLocked) styles.push('cursor: not-allowed');
		if (selected) styles.push(`transform: translateZ(${SPACE_3D.ELEVATION.FLOATING}px)`);
		return styles.join(';');
	}

	// Glass effect state
	let glassOpacity = $derived(isHovered ? 0.15 : 0.1);
	let glassBlur = $derived(selected ? 4 : 2);

	// Anchor management
	function getAnchorState(id: string) {
		if (!anchorStates.has(id)) {
			anchorStates.set(id, {
				isConnecting: false,
				isConnected: false,
				isHovering: false
			});
		}
		return anchorStates.get(id)!;
	}

	function updateAnchorState(id: string, updates: Partial<{ isConnecting: boolean; isConnected: boolean; isHovering: boolean }>) {
		const current = getAnchorState(id);
		anchorStates.set(id, { ...current, ...updates });
	}

	// Create anchor snippets with proper state management
	function createAnchor(direction: Direction, isInput: boolean, index: number) {
		const id = `${isInput ? 'input' : 'output'}-${direction}-${index}`;
		const state = getAnchorState(id);
		
		return (
			<Anchor 
				{...state}
				input={isInput}
				output={!isInput}
				bgColor={nodeBorderColor}
				onconnect={() => updateAnchorState(id, { isConnected: true })}
				ondisconnect={() => updateAnchorState(id, { isConnected: false })}
				onhover={(hovering) => updateAnchorState(id, { isHovering: hovering })}
			/>
		);
	}
</script>

<div 
	class="node"
	class:selected
	class:locked={isLocked}
	class:hovered={isHovered}
	class:dragging={isDragging}
	style={computeNodeStyle(width, height, isLocked, selected)}
	onmouseenter={() => isHovered = true}
	onmouseleave={() => isHovered = false}
	onmousedown={() => isDragging = true}
	onmouseup={() => isDragging = false}
>
	<GlassPane
		color={nodeBackground}
		opacity={glassOpacity}
		blur={glassBlur}
	/>

	<div class="node-content">
		{#if inputs > 0}
			<div class="input-anchors" class:top={isTopDown} class:left={!isTopDown}>
				{#each Array(inputs) as _, i (i)}
					{createAnchor(isTopDown ? 'north' : 'west', true, i)}
				{/each}
			</div>
		{/if}

		{#if outputs > 0}
			<div class="output-anchors" class:bottom={isTopDown} class:right={!isTopDown}>
				{#each Array(outputs) as _, i (i)}
					{createAnchor(isTopDown ? 'south' : 'east', false, i)}
				{/each}
			</div>
		{/if}

		{#if label}
			<div class="node-label" style:color={nodeTextColor}>
				{label}
			</div>
		{/if}

		{#if nodeContent}
			{@render nodeContent()}
		{/if}
	</div>
</div>

<style>
	.node {
		position: relative;
		border-radius: var(--radius-lg);
		transition: all var(--transition-normal) var(--ease-standard);
		transform-style: preserve-3d;
		backface-visibility: hidden;
		will-change: transform;
		user-select: none;
	}

	.node-content {
		position: relative;
		height: 100%;
		display: grid;
		place-items: center;
		padding: var(--space-4);
		z-index: 1;
	}

	.node-label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		text-align: center;
		margin-bottom: var(--space-2);
	}

	.input-anchors,
	.output-anchors {
		position: absolute;
		display: flex;
		justify-content: space-around;
		align-items: center;
		z-index: 2;
		pointer-events: none;
	}

	.top { top: 0; left: 0; right: 0; transform: translateY(-50%); }
	.bottom { bottom: 0; left: 0; right: 0; transform: translateY(50%); }
	.left { left: 0; top: 0; bottom: 0; transform: translateX(-50%); flex-direction: column; }
	.right { right: 0; top: 0; bottom: 0; transform: translateX(50%); flex-direction: column; }

	.selected {
		box-shadow: 0 0 0 2px var(--color-focus);
	}

	.locked {
		opacity: 0.7;
		cursor: not-allowed;
	}

	/* Spatial adjustments */
	@media (--ar) {
		.node {
			transform: translateZ(var(--depth-floating));
		}
	}

	@media (--vr) {
		.node {
			transform: translateZ(var(--depth-ui));
		}
	}
</style>
