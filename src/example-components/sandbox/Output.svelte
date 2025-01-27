<script lang="ts">
	import { Node, Anchor } from '$lib';
	import CustomAnchor from './CustomAnchor.svelte';

	let value = $state<any>(null);
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node useDefaults id={1} position={{ x: 560, y: 650 }} locked>
	{#snippet node({ selected = false }: { selected: boolean })}
		<div class="node">
			<div class="input-anchors">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Anchor id="input" input locked>
					{#snippet anchor({ hovering = false, connecting = false, linked = false }: { hovering: boolean; connecting: boolean; linked: boolean })}
						<CustomAnchor {hovering} {connecting} {linked} />
					{/snippet}
				</Anchor>
			</div>
			<div class="output">
				<pre>{JSON.stringify(value, null, 2)}</pre>
			</div>
		</div>
	{/snippet}
</Node>

<style>
	.node {
		padding: 1rem;
		background: #2a2a2a;
		border-radius: 0.5rem;
		min-width: 200px;
	}

	.input-anchors {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.output {
		color: #fff;
		font-family: monospace;
		white-space: pre-wrap;
		word-break: break-all;
	}
</style>
