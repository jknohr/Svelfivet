<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	// State management
	let totalNodes = $state(0);

	// Event handlers
	function addAndConnect(connect: (connections: string | number) => void) {
		connect(totalNodes + 4);
		totalNodes++;
	}

	// Type definitions for snippet props
	interface ConnectorProps {
		connect: (connections: string | number) => void;
		disconnect: (connections: string | number | [string | number, string][]) => void;
	}
</script>

{#snippet connector({ connect, disconnect }: ConnectorProps)}
	<div>
		<button onclick={() => connect(2)}>
			Connect 2
		</button>
		<button onclick={() => addAndConnect(connect)}>
			Connect and Add
		</button>
		<button onclick={() => disconnect(2)}>
			Disconnect Last From 2
		</button>
		<button onclick={() => disconnect([[2, '3']])}>
			Disconnect Node 2/Anchor 3
		</button>
		<button onclick={() => connect(3)}>
			Connect 3
		</button>
		<button onclick={() => disconnect(3)}>
			Disconnect Last From 3
		</button>
	</div>
	<Anchor />
{/snippet}

<svelte:element this={'div'} data-svelte-ignore>
	{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
	<Node
		position={{ x: 100, y: 300 }}
		dimensions={{ width: 400, height: 300 }}
		useDefaults
	>
		{@render connector({ 
			connect: (c) => console.log('connect', c), 
			disconnect: (d) => console.log('disconnect', d)
		})}
	</Node>
</svelte:element>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
	}

	button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		background: #fff;
		cursor: pointer;
	}

	button:hover {
		background: #eee;
	}
</style>
