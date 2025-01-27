<script lang="ts">
	import { Svelvet, Node } from '$lib';
	import FitContent from './FitContent.svelte';
	import PxValue from './PxValue.svelte';
	import Percent from './Percent.svelte';
</script>

<body>
	<Svelvet theme="dark" minimap width={1000} height={800}>
		<Node id="no-dimensions" resizable />
		<Node id="dimensions" dimensions={{ width: 400, height: 200 }} resizable />
		<Node id="width" width={400} resizable />
		<Node id="height" height={200} resizable />
		<Node id="width-height" width={400} height={200} resizable />
		<Node id="width-height-dimensions" width={400} height={200} dimensions={{ width: 400, height: 200 }} resizable />
		<Node id="width-height-dimensions-center" width={400} height={200} dimensions={{ width: 400, height: 200 }} center resizable />
		<Node id="width-height-dimensions-center-drop" width={400} height={200} dimensions={{ width: 400, height: 200 }} center drop="center" resizable />
		<Node id="width-height-dimensions-center-drop-position" width={400} height={200} dimensions={{ width: 400, height: 200 }} center drop="center" position={{ x: 0, y: 0 }} resizable />
		<Node id="v6-props" width={600} height={300} resizable />
		<Node id="both" dimensions={{ width: 150, height: 10 }} width={600} height={300} resizable />
		<Node id="v6-width" width={600} resizable />
		<Node id="v6-height" height={300} resizable />
		<Node id="width-only" dimensions={{ width: 100 }} resizable />
		<FitContent />
		<PxValue />
		<Percent />
	</Svelvet>
</body>

<style>
	body {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
		margin: 0;
		padding: 0;
		background-color: #333;
	}
</style>