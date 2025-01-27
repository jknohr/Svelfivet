<script lang="ts">
	import { Svelvet, Node, Anchor } from '$lib';

	let position = $state({ x: 300, y: 300 });
	
	$effect(() => {
		console.log(position);
	});

	interface NodeProps {
		grabHandle: (node: HTMLElement) => void;
		selected: boolean;
	}
</script>

<body>
	<Svelvet minimap title="test">
		<Node bgColor="red" inputs={4} position={position}>
			{#snippet node({ grabHandle, selected }: NodeProps)}
				<div class="node-body" use:grabHandle class:selected>
					<p>{JSON.stringify(position)}</p>
					<button
						onclick={() => {
							position = { x: 100, y: 100 };
						}}>Move</button
					>
				</div>
			{/snippet}
		</Node>
	</Svelvet>
</body>

<style>
	.node-body {
		width: 200px;
		height: 300px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
