<script lang="ts">
	import { Svelvet, Minimap, Node, Anchor, Background } from '$lib';
	import CustomEdge from '../../example-components/CustomEdge.svelte';
	import type { BackgroundStyles } from '$lib/types/general';
	import type { Snippet } from 'svelte';

	interface Props {
		background: Snippet;
	}

	let style: BackgroundStyles = 'dots';
</script>

<body>
	<Svelvet TD theme="dark" width={800} height={500} zoom={0.5} controls title="tests">
		<Node
			label="Node 1"
			connections={[2, 3, 4, [5, 1], 6, [7, 7]]}
		/>
		{#snippet background()}
			<Background {style} />
		{/snippet}
	</Svelvet>
</body>

<style>
	body {
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
	}
</style>
