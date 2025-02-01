<svelte:options runes={true} />

<script lang="ts">
	import { getContext } from 'svelte';
	import { isArrow } from '$lib/types';
	import { roundNum, calculateRelativeCursor } from '$lib/utils';
	import { tracking } from '$lib/components/Templates/Canvas/stores/CursorStore';
	import type { Writable } from 'svelte/store';
	import type { Graph, Groups } from '$lib/types';
	import type { GlassEffect, GlassState, UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
	import type { ElementType } from '$lib/components/Theme/ThemeElements';
	import GlassPane from '$lib/components/Theme/GlassPane.svelte';
	import { createElementRunes } from '$lib/components/Theme/ThemeElements';

	type GraphActiveGroup = {
		set: (value: null) => void;
	} & (`${string}/${string}` | null);

	interface GraphContext extends Omit<Graph, 'activeGroup'> {
		groups: {
			selected: {
				nodes: {
					set: (value: Set<unknown>) => void;
				};
			};
		};
		activeGroup: GraphActiveGroup;
	}

	// Add new types for materials
	type KnobMaterial = 'brushed-aluminium' | 'gold' | 'silver' | 'rhodium-black' | 'titanium';
	type ColorizedMaterial = 'titanium' | 'brushed-aluminium';

	// Props with defaults
	let {
		minDegree = 60,
		maxDegree = 300,
		min = 0,
		max = 100,
		step = 1,
		label = 'Value',
		fixed = 0,
		// Theme props
		variant = 'primary',
		initialState = 'default' as GlassState,
		glowOnHover = false,
		componentType = 'knob' as ElementType,
		// Style props
		size = 'md',
		material = 'brushed-aluminium' as KnobMaterial,
		materialColor = 'var(--color-primary)',
		fontColor = 'var(--color-text)',
		knobValueColor = 'var(--color-text)',
		indicatorColor = 'var(--color-border)'
	} = $props();

	// Local state
	let parameterValue = $state(0);
	let currentDegree = $state(minDegree);
	let isConnected = $state(false);
	let sliderWidth = $state(0);
	let isRotating = $state(false);
	let previousValue = $state(0);
	let isHovering = $state(false);
	

	// Graph context
	const graph = getContext<GraphContext>('graph');
	const { groups, activeGroup } = graph;
	const selected = groups.selected;

	// Theme context
	const theme = getContext<UnifiedThemeContext>('theme');

	// Element refs
	let knobWrapperElement = $state<HTMLDivElement | null>(null);
	let knobElement = $state<HTMLDivElement | null>(null);

	// Derived values
	let cursor = $derived(graph.cursor);
	let scale = $derived(graph.transforms.scale);
	let translation = $derived(graph.transforms.translation);
	let isActive = $derived(isRotating || isHovering);

	// Current state for theming
	let currentState = $derived.by(() => {
		if (isRotating) return 'active' as GlassState;
		if (isHovering) return 'hover' as GlassState;
		return initialState;
	});

	// Computed styles
	let knobStyle = $derived.by(() => {
		return `transform: rotate(${currentDegree}deg);`;
	});

	// Add material style computation
	let materialStyle = $derived.by(() => {
		const baseStyle = {
			'brushed-aluminium': `
				background: linear-gradient(45deg, #d4d4d4, #f5f5f5);
				box-shadow: 
					inset 0 0 20px rgba(0,0,0,0.2),
					0 2px 4px rgba(0,0,0,0.2);
			`,
			'gold': `
				background: linear-gradient(45deg, #bf9b30, #ffdc73);
				box-shadow: 
					inset 0 0 20px rgba(0,0,0,0.1),
					0 2px 4px rgba(0,0,0,0.2);
			`,
			'silver': `
				background: linear-gradient(45deg, #e3e3e3, #ffffff);
				box-shadow: 
					inset 0 0 20px rgba(0,0,0,0.1),
					0 2px 4px rgba(0,0,0,0.2);
			`,
			'rhodium-black': `
				background: linear-gradient(45deg, #1a1a1a, #2c2c2c);
				box-shadow: 
					inset 0 0 20px rgba(0,0,0,0.4),
					0 2px 4px rgba(0,0,0,0.3);
			`,
			'titanium': `
				background: linear-gradient(45deg, #434343, #535353);
				box-shadow: 
					inset 0 0 20px rgba(0,0,0,0.3),
					0 2px 4px rgba(0,0,0,0.25);
			`
		}[material];

		// Add color tint for materials that can be colorized
		if ((material === 'titanium' || material === 'brushed-aluminium') && materialColor) {
			return `
				${baseStyle}
				background-blend-mode: overlay;
				background-color: ${materialColor};
			`;
		}

		return baseStyle;
	});

	// Effects
	$effect(() => {
		if (isRotating) {
			calculateNewAngle(cursor.x, cursor.y);
		}
		currentDegree = ((parameterValue - min) / (max - min)) * (maxDegree - minDegree) + minDegree;
	});

	// Event handlers
	function startRotate(e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		window.addEventListener('mouseup', stopRotate, { once: true });
		isRotating = true;
	}

	function startTouchRotate(e: TouchEvent) {
		if (activeGroup?.set) activeGroup.set(null);
		if (selected?.nodes?.set) selected.nodes.set(new Set());
		(tracking as unknown as Writable<boolean>).set(false);
		e.stopPropagation();
		e.preventDefault();
		window.addEventListener('touchend', stopRotate, { once: true });
		isRotating = true;
	}

	function stopRotate() {
		if (previousValue === parameterValue) {
			knobElement?.focus();
		} else {
			previousValue = parameterValue;
		}
		isRotating = false;
		window.removeEventListener('mouseup', stopRotate);
	}

	function rotatable(node: HTMLElement) {
		node.addEventListener('mousedown', startRotate);
		node.addEventListener('touchstart', startTouchRotate);
		return {
			destroy() {
				node.removeEventListener('mousedown', startRotate);
				node.removeEventListener('touchstart', startTouchRotate);
			}
		};
	}

	function updateValue(delta: number, increment = ((maxDegree - minDegree) / (max - min)) * step) {
		currentDegree = roundNum(
			Math.max(minDegree, Math.min(currentDegree + delta * increment, maxDegree)),
			3
		);
		parameterValue = Number(
			(((clamp(currentDegree) - minDegree) / (maxDegree - minDegree)) * (max - min) + min).toFixed(fixed)
		);
	}

	function clamp(num: number): number {
		const increment = ((maxDegree - minDegree) / (max - min)) * step;
		const degreeRoundToStep = Math.round((num - minDegree) / increment) * increment + minDegree;
		const degree = Math.min(Math.max(degreeRoundToStep, minDegree), maxDegree);
		currentDegree = degree;
		return degree;
	}

	function calculateNewAngle(cursorX: number, cursorY: number): void {
		const { top = 0, left = 0, width = 0, height = 0 } = knobWrapperElement?.getBoundingClientRect() || {};
		const e = { clientX: cursorX, clientY: cursorY };
		const { x, y } = calculateRelativeCursor(e, top, left, width, height, scale, translation);
		const relativeX = x + (2 * translation.x) / scale - width / 2;
		const relativeY = height / 2 - (y + (2 * translation.y) / scale);

		let angle =
			relativeX > 0 && relativeY > 0
				? 270 - Math.atan(relativeY / relativeX) * (180 / Math.PI)
				: relativeX < 0 && relativeY > 0
				? Math.atan(relativeY / -relativeX) * (180 / Math.PI) + 90
				: relativeX > 0 && relativeY < 0
				? 270 + Math.atan(-relativeY / relativeX) * (180 / Math.PI)
				: relativeX < 0 && relativeY < 0
				? 90 - Math.atan(-relativeY / -relativeX) * (180 / Math.PI)
				: currentDegree;

		parameterValue = Number(
			(((clamp(angle) - minDegree) / (maxDegree - minDegree)) * (max - min) + min).toFixed(fixed)
		);
	}
</script>

{#if !isConnected}
	<GlassPane
		variant={variant}
		state={currentState}
		{glowOnHover}
		{componentType}
		on:mouseenter={() => isHovering = true}
		on:mouseleave={() => isHovering = false}
	>
		<div class="wrapper" style:color={fontColor} bind:this={knobWrapperElement}>
			<div class="knob-container" bind:offsetWidth={sliderWidth} style={knobStyle}>
				<div
					tabindex={0}
					id="knob"
					class="knob"
					class:brushed={material === 'brushed-aluminium'}
					class:has-metal-finish={true}
					data-material={material}
					aria-label="knob component"
					role="slider"
					aria-valuemin={min}
					aria-valuemax={max}
					aria-valuenow={parameterValue}
					style="{materialStyle}"
					onwheel={(event) => {
						event.stopPropagation();
						event.preventDefault();
						updateValue(Math.sign(event.deltaY));
					}}
					onkeydown={(e) => {
						e.stopPropagation();
						const { key } = e;
						if (isArrow(key)) {
							e.preventDefault();
							updateValue(key === 'ArrowDown' ? -1 : key === 'ArrowUp' ? 1 : 0);
						}
					}}
					use:rotatable
					bind:this={knobElement}
				>
					<div class="knob-surface"></div>
				</div>
				<div class="indicator" style="background: {material === 'rhodium-black' ? '#444' : indicatorColor}"></div>
			</div>
			<div class="knob-value" style:color={knobValueColor}>
				{parameterValue.toFixed(fixed)}
			</div>
		</div>
	</GlassPane>
{:else}
	<div class="wrapper connected">
		<div class="knob connected" style:--percentage="10%" aria-label={label}>
			<p>{label}</p>
			<p>{currentDegree}</p>
		</div>
	</div>
{/if}

<style>
	* {
		box-sizing: border-box;
	}

	.wrapper {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		align-items: center;
		height: 7rem;
		width: 7rem;
		position: relative;
	}

	.knob-container {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform var(--transition-normal) var(--ease-standard);
	}

	.knob {
		display: flex;
		border-radius: 50%;
		width: 100%;
		height: 100%;
		pointer-events: auto;
		cursor: pointer;
		padding: 0.25rem;
		position: relative;
		overflow: hidden;
		transition: all var(--transition-normal) var(--ease-standard);
	}

	.knob.has-metal-finish::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.1) 50%, transparent 52%);
		pointer-events: none;
		z-index: 1;
	}

	.knob.brushed::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 1px,
			rgba(255,255,255,0.05) 1px,
			rgba(255,255,255,0.05) 2px
		);
		pointer-events: none;
		z-index: 2;
	}

	.knob-surface {
		position: absolute;
		top: 10%;
		left: 10%;
		right: 10%;
		bottom: 10%;
		border-radius: 50%;
		background: radial-gradient(
			circle at 30% 30%,
			rgba(255,255,255,0.2) 0%,
			rgba(255,255,255,0.1) 20%,
			rgba(0,0,0,0.1) 80%
		);
		pointer-events: none;
		z-index: 3;
	}

	.knob:hover {
		transform: scale(1.05);
	}

	.knob:active {
		transform: scale(0.95);
	}

	.indicator {
		top: 80%;
		left: 48%;
		transform-origin: 50% -50%;
		position: absolute;
		width: 4%;
		height: 15%;
		border-radius: 30%/10%;
		pointer-events: none;
		transition: background-color var(--transition-normal) var(--ease-standard);
	}

	.knob-value {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 2.5em;
		font-weight: var(--font-weight-bold);
		text-shadow: var(--text-shadow-default);
		z-index: 100;
		transition: all var(--transition-normal) var(--ease-standard);
	}

	.connected {
		display: flex;
		justify-content: space-between;
		padding: 0.25rem 0.5rem;
		background: var(--color-surface);
		border-radius: var(--border-radius-medium);
		box-shadow: var(--shadow-elevation-low);
	}

	/* Media queries for AR/VR support */
	@media (--ar) {
		.wrapper {
			transform-style: preserve-3d;
			transform: translateZ(var(--depth-floating));
		}
	}

	@media (--vr) {
		.wrapper {
			transform-style: preserve-3d;
			transform: translateZ(var(--depth-ui));
		}
	}
</style>
