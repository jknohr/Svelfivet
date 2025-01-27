<script lang="ts">
	import { Node, Anchor } from "$lib";
	import Slider from "$lib/components/data/Slider/Slider.svelte";
	import type { CustomWritable } from '$lib/types';

	// Type definitions
	type AnchorProps = {
		hovering: boolean;
		connecting: boolean;
		linked: boolean;
	};

	// State management
	let parameterStore: CustomWritable<number> = {
		subscribe: (fn) => {
			fn(parameter);
			return () => {};
		},
		set: (value) => {
			parameter = value;
		},
		update: (fn) => {
			parameter = fn(parameter);
		}
	};
	let parameter = $state(0);
	let connections = $state<Array<number | string>>([]);

	// Event handlers
	function handleConnect() {
		console.log("connection");
	}

	function handleDisconnect() {
		console.log("disconnection");
	}
</script>

{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
<Node>
	{#snippet node({ grabHandle, selected }: { grabHandle: any; selected: boolean })}
		<div class="node" use:grabHandle class:selected>
			<Slider {parameterStore} />
			<div class="input-anchors">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Anchor 
					onconnect={handleConnect}
					ondisconnect={handleDisconnect}
					value={connections}
					input 
					id="1" 
				/>
			</div>
			<div class="output-anchors">
				{/* @ts-ignore - Library type definitions need updating for Svelte 5 */}
				<Anchor output id="5" />
			</div>
		</div>
	{/snippet}
</Node>

<style>
	.node {
		padding: 1rem;
		background: rgba(128, 128, 128, 0.673);
		border-radius: 20px;
		border: solid 2px rgb(99, 99, 99);
	}
	.selected {
		border: solid 2px white;
	}
	.input-anchors {
		position: absolute;
		top: -20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.output-anchors {
		position: absolute;
		right: 20px;
		bottom: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
