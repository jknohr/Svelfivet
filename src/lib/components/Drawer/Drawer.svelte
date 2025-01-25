<script lang="ts">
	import { Node, Svelvet, Anchor, Edge } from '$lib';
	import type { SvelvetConfig, NodeConfig, XYPair, EdgeStyle, NodeDrawerConfig } from '$lib/types';
	import type { ComponentType } from 'svelte';
	import { defaultNodePropsStore } from './DrawerNode.svelte';
	import { writable } from 'svelte/store';

	$props = {
		width: null,
		height: null,
		minimap: null,
		translation: null,
		controls: null,
		edge: null,
		edgeStyle: null,
		snapTo: null,
		editable: null,
		fitView: null,
		locked: null,
		zoom: null,
		theme: null,
		mermaid: null,
		mermaidConfig: null,
		TD: null,
		disableSelection: null,
		raiseEdgesOnSelect: null,
		modifier: null,
		trackpadPan: null,
		toggle: null
	};

	$state = {
		svelvetProps: $props,
		defaultNodes: [],
		dropped_in: false
	};

	const handleDragEnter = (): void => {
		if (!$state.dropped_in) $state.dropped_in = true;
	};

	const handleDragLeave = (): void => {
		$state.dropped_in = false;
	};

	const onDragOver = (e: DragEvent): boolean => {
		e.preventDefault();
		return false;
	};

	const handleDrop = (e: MouseEvent): void => {
		e.stopPropagation();
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		const target = e.target as HTMLElement;
		target.dispatchEvent(moveEvent);

		$state.defaultNodes = $defaultNodePropsStore;
	};
</script>

<div
	role="presentation"
	class="drop_zone"
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={onDragOver}
	ondrop={handleDrop}
>
	<Svelvet {...$state.svelvetProps} drawer>
		{#each $state.defaultNodes as { anchors, edgeProps, ...nodeProps }}
			{#if anchors}
				<Node {...nodeProps} drop="cursor">
					{#each anchors.left as leftAnchorProps}
						{#if edgeProps}
							<Anchor {...leftAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...leftAnchorProps} />
						{/if}
					{/each}
					{#each anchors.right as rightAnchorProps}
						{#if edgeProps}
							<Anchor {...rightAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...rightAnchorProps} />
						{/if}
					{/each}
					{#each anchors.top as topAnchorProps}
						{#if edgeProps}
							<Anchor {...topAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...topAnchorProps} />
						{/if}
					{/each}
					{#each anchors.bottom as bottomAnchorProps}
						{#if edgeProps}
							<Anchor {...bottomAnchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...bottomAnchorProps} />
						{/if}
					{/each}
					{#each anchors.self as anchorProps}
						{#if edgeProps}
							<Anchor {...anchorProps}>
								<Edge {...edgeProps} />
							</Anchor>
						{:else}
							<Anchor {...anchorProps} />
						{/if}
					{/each}
				</Node>
			{:else}
				<Node {...nodeProps} drop="cursor" />
			{/if}
		{/each}

		{@render children}
		{@render $props.minimap as minimap}
		{@render $props.controls as controls}
		{@render $props.toggle as toggle}
	</Svelvet>
</div>
