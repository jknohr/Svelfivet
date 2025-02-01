<svelte:options runes={true} />

<!--
@component
A drawer controller component that manages drawer state and content.
-->
<script lang="ts">
	import DrawerNode from './CanvasDrawerNode.svelte';
	import DrawerAnchor from './CanvasDrawerAnchor.svelte';
	import DrawerEdge from './CanvasDrawerEdge.svelte';
	import Icon from '$lib/assets/icons/Icon.svelte';
	import type { AnchorDrawerConfig, EdgeDrawerConfig } from './CanvasDrawer.types';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		nodeContent?: Snippet;
		anchorContent?: Snippet;
	}

	let { children, nodeContent, anchorContent } = $props();

	// State declarations
	let isOpen = $state(false);
	let nodeContainerOpen = $state(false);
	let edgeContainerOpen = $state(false);
	let anchorContainerOpen = $state(false);
	let currentComponent = $state<'Node' | 'Edge' | 'Anchor'>('Node');

	// DOM References
	let nav: HTMLElement;
	let drawerBtn: HTMLButtonElement;
	let nodeBtn: HTMLButtonElement;
	let edgeBtn: HTMLButtonElement;
	let anchorBtn: HTMLButtonElement;
	let drawerContents: HTMLUListElement;
	let nodeContainer: HTMLDivElement;
	let anchorContainer: HTMLDivElement;
	let edgeContainer: HTMLDivElement;

	// Component references
	let anchorComponent: DrawerAnchor;
	let edgeComponent: DrawerEdge;
	let nodeComponent: DrawerNode;

	// Drawer state
	let anchorProps = $state<{ [key: string]: AnchorDrawerConfig[] } | undefined>(undefined);
	let edgeProps = $state<EdgeDrawerConfig | undefined>(undefined);

	// Handle the drag start event for creating node props
	function handleDragStart(e: DragEvent) {
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = 'move';

		// Create props for anchor or edge if values were given
		anchorProps = anchorComponent?.createAnchorProps?.(true);
		edgeProps = edgeComponent?.createEdgeProps?.();
		// Create props for node
		nodeComponent?.createNodeProps?.(edgeProps, anchorProps);
	}

	// Toggle the drawer open or closed
	function handleDrawer() {
		isOpen = !isOpen;
		nav.style.height = isOpen ? 'fit-content' : '35px';
		nav.style.width = isOpen ? '300px' : '35px';
		
		if (!isOpen) {
			anchorContainerOpen = false;
			edgeContainerOpen = false;
			nodeContainerOpen = false;
			nodeContainer.style.display = 'block';
			edgeContainer.style.display = 'none';
			anchorContainer.style.display = 'none';
			nodeBtn.style.borderBottom = '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))';
			edgeBtn.style.borderBottom = 'none';
			anchorBtn.style.borderBottom = 'none';
		}
	}

	// Toggle containers
	function handleNodeContainer() {
		if (!nodeContainerOpen) {
			nodeContainerOpen = true;
			anchorContainerOpen = false;
			edgeContainerOpen = false;
			updateContainerVisibility('node');
		}
	}

	function handleAnchorContainer() {
		if (!anchorContainerOpen) {
			anchorContainerOpen = true;
			edgeContainerOpen = false;
			nodeContainerOpen = false;
			updateContainerVisibility('anchor');
		}
	}

	function handleEdgeContainer() {
		if (!edgeContainerOpen) {
			edgeContainerOpen = true;
			nodeContainerOpen = false;
			anchorContainerOpen = false;
			updateContainerVisibility('edge');
		}
	}

	function updateContainerVisibility(active: 'node' | 'edge' | 'anchor') {
		nodeContainer.style.display = active === 'node' ? 'block' : 'none';
		edgeContainer.style.display = active === 'edge' ? 'block' : 'none';
		anchorContainer.style.display = active === 'anchor' ? 'block' : 'none';

		nodeBtn.style.borderBottom = active === 'node' ? '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))' : 'none';
		edgeBtn.style.borderBottom = active === 'edge' ? '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))' : 'none';
		anchorBtn.style.borderBottom = active === 'anchor' ? '3px solid var(--prop-drawer-button-text-color,var(--drawer-button-text-color, var(--default-drawer-button-text-color)))' : 'none';
	}

	// Handle keyboard shortcuts
	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'D') {
			handleDrawer();
		} else if (e.key === 'T' && isOpen) {
			switch (currentComponent) {
				case 'Node':
					handleAnchorContainer();
					currentComponent = 'Anchor';
					break;
				case 'Anchor':
					handleEdgeContainer();
					currentComponent = 'Edge';
					break;
				case 'Edge':
					handleNodeContainer();
					currentComponent = 'Node';
					break;
			}
		}
	}

	$effect(() => {
		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	});
</script>

<div class="drawer">
	{#if children}
		{@render children()}
	{:else}
		<div class="drawer-default">
			<h3>Graph Controls</h3>
			<p>No custom content provided</p>
		</div>
	{/if}
</div>

<nav id="drawerWrapper" bind:this={nav}>
	<button
		class="drawerBtn"
		bind:this={drawerBtn}
		onclick={handleDrawer}
		aria-label="Open/Close Drawer"
	>
		<Icon icon={isOpen ? 'south_east' : 'north_west'} />
	</button>
	<ul class="drawerContents" bind:this={drawerContents}>
		<li class="list-item">
			<div class="menu">
				<button
					class="dropdown"
					bind:this={nodeBtn}
					onclick={handleNodeContainer}
					aria-label="Component"
				>
					Node
				</button>
				<button
					class="dropdown"
					bind:this={anchorBtn}
					onclick={handleAnchorContainer}
					aria-label="Component"
				>
					Anchor
				</button>
				<button
					class="dropdown"
					bind:this={edgeBtn}
					onclick={handleEdgeContainer}
					aria-label="Component"
				>
					Edge
				</button>
			</div>
		</li>
		<li class="list-item">
			<div class="propsContainer nodeContainer" bind:this={nodeContainer}>
				<DrawerNode bind:this={nodeComponent}>
					{#if nodeContent}
						{@render nodeContent()}
					{:else if children}
						{@render children()}
					{/if}
				</DrawerNode>
			</div>
		</li>
		<li class="list-item">
			<div class="propsContainer anchorContainer" bind:this={anchorContainer}>
				<DrawerAnchor bind:this={anchorComponent}>
					{#if anchorContent}
						{@render anchorContent()}
					{:else if children}
						{@render children()}
					{/if}
				</DrawerAnchor>
			</div>
		</li>
		<li class="list-item">
			<div class="propsContainer edgeContainer" bind:this={edgeContainer}>
				<DrawerEdge bind:this={edgeComponent} />
			</div>
		</li>
		<li class="list-item">
			<div
				role="presentation"
				class="defaultNodes"
				draggable="true"
				ondragstart={handleDragStart}
			>
				Node
			</div>
		</li>
	</ul>
</nav>

<style>
	#drawerWrapper {
		position: absolute;
		width: 35px;
		height: 30px;
		border-radius: 6px;
		left: 10px;
		top: 10px;
		border: solid 1px;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: 1s;
		padding-top: 10px;
		cursor: auto;
		color: var(
			--prop-controls-text-color,
			var(--controls-text-color, var(--default-controls-text-color))
		);
		background-color: var(
			--prop-controls-background-color,
			var(--controls-background-color, var(--default-controls-background-color))
		);
	}

	#drawerWrapper ul {
		display: flex;
		flex-direction: column;
		list-style: none;
		width: 100%;
		text-decoration: none;
		font-size: 20px;
		overflow: hidden;
		transition: 0.3s;
		padding: 0;
		margin-top: 45px;
	}

	.drawerBtn {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 20px;
		left: 20px;
		font-size: 20px;
		cursor: pointer;
		padding: 0.2rem 0;
		border: none;
		background: none;
		color: inherit;
	}
	.menu {
		display: flex;
		justify-content: space-between;
	}

	.menu .dropdown {
		padding: 10px;
		font-size: 1rem;
		flex-grow: 1;
		cursor: pointer;
		border: none;
		margin: 0;
		color: var(
			--prop-drawer-button-text-color,
			var(--drawer-button-text-color, var(--default-drawer-button-text-color))
		);
		background-color: var(
			--prop-drawer-button-color,
			var(--drawer-button-color, var(--default-drawer-button-color))
		);
	}

	.menu .dropdown:first-child {
		border-bottom: 3px solid
			var(
				--prop-drawer-button-text-color,
				var(--drawer-button-text-color, var(--default-drawer-button-text-color))
			);
	}

	.defaultNodes {
		margin: auto;
		margin-top: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
		width: 120px;
		cursor: grab;
		border-radius: 8px;
		background-color: var(--prop-background-color, var(--node-color, var(--default-node-color)));
		color: var(--prop-text-color, var(--text-color, var(--default-text-color)));
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
	}
	button:hover {
		cursor: pointer;
	}

	.propsContainer {
		height: fit-content;
		width: fit-content;
		overflow: hidden;
		padding: 0 18px;
		margin-top: 20px;
	}

	.nodeContainer {
		display: block;
	}
	.edgeContainer {
		display: none;
	}
	.anchorContainer {
		display: none;
	}

	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		width: 300px;
		height: 100%;
		background: var(--drawer-background, #fff);
		box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		overflow-y: auto;
	}

	.drawer-default {
		padding: 1rem;
		text-align: center;
		color: var(--text-color, #333);
	}
</style>
