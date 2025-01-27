<script lang="ts">
	import { Svelvet, Node, Resizer } from '$lib';

	interface NodeProps {
		grabHandle: (node: HTMLElement) => void;
		selected: boolean;
	}
</script>

<Svelvet width={800} height={500}>
	<Node id={1} dimensions={{ width: 200, height: 100 }} position={{ x: 300, y: 200 }}>
		{#snippet node({ grabHandle, selected }: NodeProps)}
			<div class="node" use:grabHandle class:selected>
				<Resizer width height rotation />
			</div>
		{/snippet}
	</Node>
	<Node id={2} position={{ x: 350, y: 350 }} />
</Svelvet>

<style>
	.node {
		width: 100%;
		height: 100%;
		background-color: red;
		border-radius: 8px;
		border: 2px solid black;
	}
</style>
