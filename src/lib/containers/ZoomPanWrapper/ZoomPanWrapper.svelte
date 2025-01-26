<script lang="ts">
	import type { Graph } from '$lib/types';
	import { getContext } from 'svelte';
	import { initialClickPosition } from '$lib/stores/CursorStore';
	import { updateTranslation } from '$lib/utils';
	import { get } from 'svelte/store';

	const graph = getContext<Graph>('graph');
	let { isMovable = false, children } = $props();

	let transforms = $state(graph.transforms);
	let translation = $state(transforms.translation);
	let scale = $state(transforms.scale);
	let cursor = $state(graph.cursor);
	let animationFrameId = $state(0);
	let moving = $state(false);

	let transform = $derived(
		`translate(${translation.x}px, ${translation.y}px) scale(${scale})`
	);

	$effect(() => {
		if (isMovable && !moving) {
			moving = true;
			animationFrameId = requestAnimationFrame(translate);
		} else if (!isMovable || !moving) {
			moving = false;
			cancelAnimationFrame(animationFrameId);
		}
	});

	function translate() {
		translation = updateTranslation(get(initialClickPosition), cursor, transforms);
		animationFrameId = requestAnimationFrame(translate);
	}

	function preventDefault(e: Event) {
		e.preventDefault();
	}
</script>

<div
	role="presentation"
	class="svelvet-graph-wrapper"
	style:transform
	{...$$restProps}
	onclick={preventDefault}
	oncontextmenu={preventDefault}
	ontouchstart={preventDefault}
>
	{@render children?.()}
</div>

<style>
	.svelvet-graph-wrapper {
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none !important;
		touch-action: none;
		/* outline: solid 1px red; */
	}
</style>
