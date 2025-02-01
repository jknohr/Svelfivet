<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!-- @migration-task Error while migrating Svelte code: Unexpected token
https://svelte.dev/e/js_parse_error -->
<!--
@component Controls
A Svelte 5 component that provides zoom, fit view, and lock controls for the graph.

Key Features:
- Uses runes for state management
- Direct DOM event handling
- Proper TypeScript types
-->
<script lang="ts">
	import type { Graph } from '$lib/types';
	import { calculateFitView } from '$lib/utils';
	import type { CSSColorString } from '$lib/types';
	import { zoomAndTranslate } from '$lib/utils/movers/';
	import { tracking } from '$lib/components/Templates/Canvas/stores';
	import Icon from '$lib/assets/icons/Icon.svelte';
	import { $state, $derived, $props } from 'svelte/state';

	// Props with TypeScript types
	interface Props {
		increment?: number;
		horizontal?: boolean;
		bgColor?: CSSColorString | null;
		iconColor?: CSSColorString | null;
		corner?: 'SW' | 'NW' | 'SE' | 'NE';
		onZoomIn?: () => void;
		onZoomOut?: () => void;
		onFitView?: () => void;
		onLock?: () => void;
		onUnhideAll?: () => void;
	}

	// Initialize props with defaults
	const props = $props<Props>({
		increment: 0.1,
		horizontal: false,
		bgColor: null,
		iconColor: null,
		corner: 'SW',
		onZoomIn: null,
		onZoomOut: null,
		onFitView: null,
		onLock: null,
		onUnhideAll: null
	});

	// State management
	const transforms = $state({
		scale: 1,
		translation: { x: 0, y: 0 }
	});

	const dimensions = $state({
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	});

	const locked = $state(false);
	const groups = $state({
		hidden: { nodes: new Set() }
	});

	// Derived values
	const hidden = $derived(groups.hidden.nodes);

	// Event handlers
	function unhideAll() {
		try {
			groups.hidden.nodes = new Set();
			props.onUnhideAll?.();
		} catch (error) {
			console.error('Error in unhideAll:', error);
		}
	}

	function zoomIn() {
		try {
			zoomAndTranslate(-1, dimensions, transforms, props.increment);
			props.onZoomIn?.();
		} catch (error) {
			console.error('Error in zoomIn:', error);
		}
	}

	function zoomOut() {
		try {
			zoomAndTranslate(1, dimensions, transforms, props.increment);
			props.onZoomOut?.();
		} catch (error) {
			console.error('Error in zoomOut:', error);
		}
	}

	function fitView() {
		try {
			tracking.set(true);
			const { x, y, scale } = calculateFitView(dimensions, transforms);
			transforms.translation = { x: x || 0, y: y || 0 };
			transforms.scale = scale || 1;
			tracking.set(false);
			props.onFitView?.();
		} catch (error) {
			console.error('Error in fitView:', error);
		}
	}

	function toggleLock() {
		try {
			locked = !locked;
			props.onLock?.();
		} catch (error) {
			console.error('Error in lock:', error);
		}
	}
</script>

<nav
	class="graph-controls"
	class:SW={props.corner === 'SW'}
	class:NE={props.corner === 'NE'}
	class:SE={props.corner === 'SE'}
	class:NW={props.corner === 'NW'}
	aria-label="navigation"
>
	<div
		class="controls-wrapper"
		class:horizontal={props.horizontal}
		style:--prop-controls-background-color={props.bgColor}
		style:--prop-controls-text-color={props.iconColor}
	>
		{#if hidden.size > 0}
			<button class="unhide" onclick={unhideAll}>
				<Icon icon="visibility_off" />
			</button>
		{/if}
		<button class="zoom-in" onclick={zoomIn}>
			<Icon icon="zoom_in" />
		</button>
		<button class="zoom-out" onclick={zoomOut}>
			<Icon icon="zoom_out" />
		</button>
		<button class="reset" onclick={fitView}>
			<Icon icon="filter_center_focus" />
		</button>
		<button class="lock" onclick={toggleLock}>
			<Icon icon={locked ? 'lock_open' : 'lock'} />
		</button>
	</div>
</nav>

<style>
	* {
		box-sizing: border-box;
	}

	.graph-controls {
		position: absolute;
	}

	.NW {
		left: 10px;
		top: 10px;
	}

	.NE {
		right: 10px;
		top: 10px;
	}

	.SE {
		right: 10px;
		bottom: 10px;
	}

	.SW {
		left: 10px;
		bottom: 10px;
	}

	.controls-wrapper {
		left: 10px;
		bottom: 10px;
		display: flex;
		width: 1.8rem;
		flex-direction: column;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: var(--controls-shadow, var(--default-controls-shadow));
		border: solid 1px var(--controls-border, var(--default-controls-border));
		padding: 4px;
		color: var(
			--prop-controls-text-color,
			var(--controls-text-color, var(--default-controls-text-color))
		);
		background-color: var(
			--prop-controls-background-color,
			var(--controls-background-color, var(--default-controls-background-color))
		);
	}

	button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0;
		border-bottom: solid 1px rgb(190, 188, 188);
		color: inherit;
	}

	.horizontal > button {
		border-bottom: none;
	}

	button:last-child {
		border-bottom: none;
	}

	button:hover {
		cursor: pointer;
	}

	.horizontal {
		flex-direction: row-reverse !important;
		height: 1.5rem;
		gap: 6px;
		width: fit-content;
	}
</style>
