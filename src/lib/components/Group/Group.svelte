<script lang="ts">
	import { setContext, getContext } from 'svelte';
	import type { Group, Graph, GroupBox, GroupKey } from '$lib/types';
	import { getRandomColor } from '$lib/utils';

	let {
		width = 0,
		height = 0,
		position = null,
		color = getRandomColor(),
		groupName = ''
	} = $props();

	// Get the graph context
	const graph = getContext<Graph>('graph');
	const groupKey: GroupKey = `${groupName}/${graph.id}`;

	// Reactive state using Svelte 5 runes
	let group = $state(groupKey);
	let dimensions = $state({ 
		width: $state(width), 
		height: $state(height) 
	});
	let positionState = $state(position);
	let colorState = $state(color);
	let moving = $state(false);

	// Create group box object with reactive properties
	const groupBox: GroupBox = {
		get group() { return group },
		get dimensions() { return dimensions },
		get position() { return positionState },
		get color() { return colorState },
		get moving() { return moving }
	};

	// Add to graph context
	graph.groupBoxes.add(groupBox, groupKey);
	graph.groups = {
		...graph.groups,
		[groupKey]: {
			parent: groupBox,
			nodes: new Set([groupBox])
		}
	};

	setContext('group', groupKey);
</script>

<slot />
