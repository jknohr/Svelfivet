<!--
@component Node
A base node container component that provides core node functionality.
Features:
- Core node styling and measurements
- Anchor points for connections
- Error handling for missing renderers
- Event handling for connections
- Dynamic scaling based on node size
- Automatic position recalculation
- Support for both mouse and touch interactions
- Theme system integration with GlassPane
- Full accessibility support
- AR/VR environment support

Usage:
```svelte
<Node
  position={{ x: 100, y: 100 }}
  edge={{ render: mySnippet }}
  inputs={2}
  outputs={2}
  label="My Node"
  resizable={true}
/>
```

Props:
- position: XYPair - Node position in the graph
- dimensions: InitialDimensions - Initial node dimensions
- id: string - Unique identifier
- bgColor: CSSColorString - Background color
- borderRadius: number - Border radius in pixels
- borderColor: CSSColorString - Border color
- borderWidth: number - Border width in pixels
- selectionColor: CSSColorString - Selection highlight color
- textColor: CSSColorString - Text color
- resizable: boolean - Whether the node can be resized
- label: string - Node label
- inputs: number - Number of input anchors
- outputs: number - Number of output anchors
- width: number - Node width
- height: number - Node height
- TD: boolean - Top-down layout
- LR: boolean - Left-right layout
- zIndex: number - Z-index for stacking
- editable: boolean - Whether content is editable
- locked: boolean - Whether node is locked
- rotation: number - Rotation angle in degrees
- edge: SvelteComponent - Component to render
- center: boolean - Center in view
- dynamic: boolean - Dynamic sizing
- variant: string - Variant for GlassPane
- state: string - State for GlassPane
- size: string - Size for GlassPane
- glowOnHover: boolean - Glow on hover for GlassPane
- glowIntensity: number - Glow intensity for GlassPane
- glowColor: CSSColorString - Glow color for GlassPane
- elevated: boolean - Elevated for GlassPane
- componentType: string - Component type for GlassPane
- tint: CSSColorString - Tint for GlassPane
- dissolveOnRemove: boolean - Dissolve on remove for GlassPane
- depth: number - Depth for GlassPane
- castShadow: boolean - Cast shadow for GlassPane
- receiveShadow: boolean - Receive shadow for GlassPane
- showReflection: boolean - Show reflection for GlassPane
- showBackdropBlur: boolean - Show backdrop blur for GlassPane
- backdropBlurAmount: number - Backdrop blur amount for GlassPane
- showDepthOfField: boolean - Show depth of field for GlassPane
- showAmbientOcclusion: boolean - Show ambient occlusion for GlassPane
- showBloom: boolean - Show bloom for GlassPane
- bloomIntensity: number - Bloom intensity for GlassPane
- showMotionBlur: boolean - Show motion blur for GlassPane
- showChromaticAberration: boolean - Show chromatic aberration for GlassPane
- showVignette: boolean - Show vignette for GlassPane
- showGrain: boolean - Show grain for GlassPane
- showOutline: boolean - Show outline for GlassPane
- outlineColor: CSSColorString - Outline color for GlassPane
- outlineWidth: number - Outline width for GlassPane
- showHighlight: boolean - Show highlight for GlassPane
- highlightColor: CSSColorString - Highlight color for GlassPane
- showRipple: boolean - Show ripple for GlassPane
- rippleColor: CSSColorString - Ripple color for GlassPane
- showPulse: boolean - Show pulse for GlassPane
- pulseColor: CSSColorString - Pulse color for GlassPane
- showShake: boolean - Show shake for GlassPane
- showBounce: boolean - Show bounce for GlassPane
- showFlash: boolean - Show flash for GlassPane
- showJelly: boolean - Show jelly for GlassPane
- showWobble: boolean - Show wobble for GlassPane
- showSwing: boolean - Show swing for GlassPane
- showTada: boolean - Show tada for GlassPane
- showSpin: boolean - Show spin for GlassPane
- showFloat: boolean - Show float for GlassPane
- showSink: boolean - Show sink for GlassPane
-->

<svelte:options runes={true} />

<script lang="ts" context="module">
	export { default } from './InternalNode.svelte';
</script>

<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import type { NodeKey, Anchor, AnchorKey, XYPair, Node as NodeType } from '$lib/types';
	import type { Graph, NodeConfig, GroupKey } from '$lib/types';
	import type { Connections, CSSColorString, InitialDimensions } from '$lib/types';
	import { createNode } from '$lib/utils';
	import GlassPane from '$lib/components/Theme/GlassPane.svelte';
	import { createElementRunes } from '$lib/components/Theme/ThemeElements';
	import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
	import type { ElementType } from '$lib/components/Theme/ThemeElements';
	import type { NodeVariant, NodeState, NodeSize } from './Node.types';
	import type { NodeProps } from './Node.types';

	// Theme context
	const theme = getContext<UnifiedThemeContext>('theme');
	const elementRunes = createElementRunes('node');
	const elementState = elementRunes.state.create();

	// Base units in pixels
	const BASE = {
		UNIT: 8,
		XXS: 2,    // 0.25 * BASE_UNIT
		XS: 4,     // ~0.382 * BASE_UNIT
		S: 6,      // ~0.618 * BASE_UNIT
		M: 8,      // 1.0 * BASE_UNIT
		L: 12,     // ~1.618 * BASE_UNIT
		XL: 16,    // ~2.618 * BASE_UNIT
		XXL: 24    // ~4.236 * BASE_UNIT
	} as const;

	// Props
	let props = $props<NodeProps>();

	// Context
	let graph = $state(getContext<Graph>('graph'));
	let group = $state(getContext<GroupKey>('group'));

	setContext('dynamic', () => props.dynamic);

	// State
	let node = $state(props.node);
	let isDissolving = $state(false);
	let mouseX = $state(0);
	let mouseY = $state(0);

	// Current state for theming
	let currentState = $derived.by(() => {
		if (props.locked) return 'disabled';
		if (elementState.active) return 'active';
		if (elementState.hover) return 'hover';
		return props.state || 'default';
	});

	// Derived values
	let nodeScale = $derived(() => {
		if (!node?.dimensions) return 1;
		const size = Math.min(node.dimensions.width, node.dimensions.height);
		return Math.max(0.8, Math.min(1.5, Math.log10(size / 100) + 1));
	});

	// Computed measurements
	let gridGap = $derived(Number(BASE.M) * Number(nodeScale));
	let nodePadding = $derived(Number(BASE.M) * Number(nodeScale));
	let contentMargin = $derived(Number(BASE.S) * Number(nodeScale));
	let nodeRadius = $derived(Number(BASE.M) * Number(nodeScale));
	let inputRadius = $derived(Number(BASE.S) * Number(nodeScale));

	// Node creation and updates
	$effect(() => {
		if (!node) {
			const config: NodeConfig = {
				id: typeof props.id === 'string' ? props.id : props.id?.toString(),
				position: props.position,
				dimensions: props.dimensions ?? { props.width, props.height },
				label: props.label,
				inputs: props.inputs,
				outputs: props.outputs,
				bgColor: props.bgColor ?? undefined,
				borderRadius: props.borderRadius,
				borderColor: props.borderColor ?? undefined,
				borderWidth: props.borderWidth,
				selectionColor: props.selectionColor ?? undefined,
				textColor: props.textColor ?? undefined,
				resizable: props.resizable,
				zIndex: props.zIndex,
				editable: props.editable,
				locked: props.locked,
				rotation: props.rotation,
				edge: props.edge,
				variant: props.variant,
				state: props.state || 'default',
				size: props.size,
				glowOnHover: props.glowOnHover,
				glowIntensity: props.glowIntensity,
				glowColor: props.glowColor,
				elevated: props.elevated,
				componentType: props.componentType,
				tint: props.tint,
				dissolveOnRemove: props.dissolveOnRemove,
				depth: props.depth,
				castShadow: props.castShadow,
				receiveShadow: props.receiveShadow,
				showReflection: props.showReflection,
				showBackdropBlur: props.showBackdropBlur,
				backdropBlurAmount: props.backdropBlurAmount,
				showDepthOfField: props.showDepthOfField,
				showAmbientOcclusion: props.showAmbientOcclusion,
				showBloom: props.showBloom,
				bloomIntensity: props.bloomIntensity,
				showMotionBlur: props.showMotionBlur,
				showChromaticAberration: props.showChromaticAberration,
				showVignette: props.showVignette,
				showGrain: props.showGrain,
				showOutline: props.showOutline,
				outlineColor: props.outlineColor,
				outlineWidth: props.outlineWidth,
				showHighlight: props.showHighlight,
				highlightColor: props.highlightColor,
				showRipple: props.showRipple,
				rippleColor: props.rippleColor,
				showPulse: props.showPulse,
				pulseColor: props.pulseColor,
				showShake: props.showShake,
				showBounce: props.showBounce,
				showFlash: props.showFlash,
				showJelly: props.showJelly,
				showWobble: props.showWobble,
				showSwing: props.showSwing,
				showTada: props.showTada,
				showSpin: props.showSpin,
				showFloat: props.showFloat,
				showSink: props.showSink
			};
			node = createNode(config);
		}
	});

	// Event handlers
	function handleMouseMove(event: MouseEvent) {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width) * 100;
		mouseY = ((event.clientY - rect.top) / rect.height) * 100;
	}

	function handleDissolveComplete() {
		isDissolving = false;
	}

	// Setup effects
	let setupNode: HTMLElement;
	$effect(() => {
		if (setupNode) {
			elementRunes.effects.setupInteractions(setupNode);
			elementRunes.effects.setupAccessibility(setupNode);
			elementRunes.effects.setupGestures(setupNode);
		}
	});
</script>

<div
	class="node-wrapper"
	class:dissolving={isDissolving}
	class:active={elementState.active}
	role="presentation"
	bind:this={setupNode}
>
	<GlassPane
		{props.variant}
		state={currentState}
		{props.glowOnHover}
		{props.componentType}
		{props.elevated}
		style="--node-tint: {props.tint}"
	>
		{#if !node}
			<div class="error">Node not initialized</div>
		{:else if node}
			{#if node?.edge?.render}
				{@render node.edge.render()}
			{:else}
				<div class="error">No renderer provided</div>
			{/if}

			<div class="anchors">
				{#if !props.TD}
					<button 
						id="west-{node.id}" 
						class="anchor left"
						type="button"
						aria-label="Connect west"
					></button>
					<button 
						id="east-{node.id}" 
						class="anchor right"
						type="button"
						aria-label="Connect east"
					></button>
				{/if}
				{#if !props.LR}
					<button 
						id="north-{node.id}" 
						class="anchor top"
						type="button"
						aria-label="Connect north"
					></button>
					<button 
						id="south-{node.id}" 
						class="anchor bottom"
						type="button"
						aria-label="Connect south"
					></button>
				{/if}
			</div>
		{/if}
	</GlassPane>
</div>

<style>
	.node-wrapper {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, auto);
		grid-template-rows: repeat(3, auto);
		justify-items: center;
		align-items: center;
		gap: var(--grid-gap);
		padding: var(--node-padding);
		border-radius: var(--node-radius);
		transform-style: preserve-3d;
		backface-visibility: hidden;
		will-change: transform, opacity;
	}

	.error {
		color: var(--color-error);
		padding: var(--space-md);
		font-size: var(--text-sm);
	}

	.anchors {
		position: absolute;
		inset: 0;
		pointer-events: none;
		transform-style: preserve-3d;
	}

	.anchor {
		position: absolute;
		width: var(--anchor-size);
		height: var(--anchor-size);
		border-radius: 50%;
		background: var(--anchor-color);
		cursor: pointer;
		z-index: 1;
		pointer-events: auto;
		transform-style: preserve-3d;
		transition: all var(--transition-normal) var(--ease-standard);
	}

	.anchor:hover {
		transform: scale(1.2);
		background: var(--anchor-hover-color);
	}

	.anchor:active {
		transform: scale(0.9);
		background: var(--anchor-active-color);
	}

	.left { left: 0; top: 50%; transform: translate3d(-50%, -50%, var(--depth-anchor)); }
	.right { right: 0; top: 50%; transform: translate3d(50%, -50%, var(--depth-anchor)); }
	.top { top: 0; left: 50%; transform: translate3d(-50%, -50%, var(--depth-anchor)); }
	.bottom { bottom: 0; left: 50%; transform: translate3d(-50%, 50%, var(--depth-anchor)); }

	.dissolving {
		animation: dissolve 0.5s ease-out forwards;
	}

	@keyframes dissolve {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(1.2);
			opacity: 0;
		}
	}

	/* Spatial adjustments */
	@media (--ar) {
		.node-wrapper {
			transform: translateZ(var(--depth-node));
		}

		.anchor {
			transform: translateZ(calc(var(--depth-node) + var(--depth-anchor)));
		}
	}

	@media (--vr) {
		.node-wrapper {
			transform: translateZ(var(--depth-ui));
		}

		.anchor {
			transform: translateZ(calc(var(--depth-ui) + var(--depth-anchor)));
		}
	}
</style>
