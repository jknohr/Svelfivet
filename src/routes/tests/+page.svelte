<script lang="ts">
	import { Node, Svelvet } from '$lib';
	import type { Node as NodeType } from '$lib/types';
	import type { SvelvetConnectionEvent } from '$lib/types';
	import { v7 } from 'uuid';
	import type { Snippet } from 'svelte';

	let selected = $state(false);
	let position = $state({ x: 100, y: 100 });
	let label = $state('test');

	type NodeSnippetProps = { selected: boolean; label: string };
	let nodeContent: Snippet<[NodeSnippetProps]> = node;

	function handleConnection(e: CustomEvent<SvelvetConnectionEvent>) {
		console.log(e.detail);
	}

	function handleNodeClick(e: CustomEvent<{ node: NodeType }>) {
		console.log('Node clicked:', e.detail.node);
	}

	function handleNodeRelease(e: CustomEvent<{ node: NodeType }>) {
		console.log('Node released:', e.detail.node);
	}
</script>

{#snippet node({ selected, label }: NodeSnippetProps)}
	<div class="node" class:selected>
		<p>{label}</p>
	</div>
{/snippet}

<div class="wrapper">
	<Svelvet
		theme="dark"
		width={800}
		height={500}
		controls={true}
		title="tests"
	>
		<Node
			id={v7()}
			position={position}
			width={100}
			height={50}
			{nodeContent}
		>
			{@render node({ selected, label: 'Node 1' })}
		</Node>
		<Node
			id={v7()}
			position={{ x: 300, y: 100 }}
			width={100}
			height={50}
			{nodeContent}
		>
			{@render node({ selected, label: 'Node 2' })}
		</Node>
		<Node 
			label="what" 
			position={{ x: 10, y: 200 }} 
			inputs={v7()} 
			TD 
			id={v7()}
			width={100}
			height={50}
			{nodeContent}
		/>
	</Svelvet>
</div>

<style>
	.wrapper {
		display: flex;
		border: solid 1px black;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 0 40px 0 rgba(37, 37, 37, 0.5);
	}

	/* :root[theme='dark'] {
		--node-selection-color: blue;
		--node-color: red;
		--background-color: green;
	}
	:root[theme='light'] {
		--node-selection-color: red;
		--node-color: blue;
		--background-color: yellow;
	} */

	:root[svelvet-theme='my-other-theme'] {
		--node-color: hsl(225, 30%, 50%);
		--node-border-color: hsl(225, 20%, 40%);
		--node-selection-color: hsl(45, 90%, 60%);
		--text-color: hsl(0, 0%, 100%);
		--node-shadow: var(--shadow-elevation-medium);

		--background-color: hsl(225, 20%, 27%);
		--dot-color: hsl(225, 10%, 50%);

		--accent-color: hsl(45, 90%, 60%);
		--primary-color: hsl(225, 30%, 66%);

		--edge-color: hsl(0, 0%, 100%);
		--target-edge-color: hsl(225, 20%, 40%);
		--edge-shadow: var(--shadow-elevation-medium);

		--anchor-color: hsl(45, 90%, 67%);
		--anchor-border-color: hsl(45, 90%, 87%);
		--anchor-connected: hsl(45, 90%, 100%);
		--anchor-connected-border: hsl(225, 20%, 20%);

		--anchor-connecting: hsl(225, 30%, 40%);
		--anchor-connecting-border: hsl(0, 0%, 100%);

		--anchor-hovering: hsl(225, 20%, 46%);
		--anchor-hovering-border: hsl(0, 0%, 0%);

		--minimap-background-color: hsl(225, 20%, 27%);

		--minimap-node-color: hsl(225, 30%, 20%);

		--controls-background-color: hsl(225, 20%, 27%);
		--controls-text-color: hsl(0, 0%, 100%);

		--theme-toggle-text-color: hsl(0, 0%, 100%);
		--theme-toggle-color: hsl(225, 20%, 27%);
	}

	.node {
		padding: 1rem;
		background-color: white;
		border-radius: 0.5rem;
		border: 2px solid #ccc;
	}

	.selected {
		border-color: #00f;
	}

	.minimap {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		width: 200px;
		height: 150px;
		background: rgba(255, 255, 255, 0.9);
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}
</style>
