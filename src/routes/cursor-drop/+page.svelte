<script lang="ts">
	import { getContext, onMount, setContext } from 'svelte';
	import { Node, Svelvet, Anchor } from '$lib';
	//import Graph from '$lib/containers/Graph/Graph.svelte';
	import { graphStore } from '$lib/stores';
	import type { Graph, NodeConfig, CSSColorString, InitialDimensions, XYPair } from '$lib/types';

	const graph = getContext<Graph>('graph');

	let dropZoneClass = 'inactive';
	let NODE_BG_TYPE = 'nodebg';
	let NODE_HEIGHT_DIMENSIONS_TYPE = 'nodeHeight';
	let NODE_WIDTH_DIMENSIONS_TYPE = 'nodeWidth';
	let NODE_BORDER_TYPE = 'nodeborder';
	let NODE_BORDER_WIDTH = 'borderWidth';
	let NODE_TD_ANCHOR_POSITION_TYPE = 'nodeTD';
	let NODE_LR_ANCHOR_POSITION_TYPE = 'nodeLR';
	let NODE_INPUTS = 'inputs';
	let NODE_OUTPUTS = 'outputs';

	function handleInputChange(e: Event, setter: (value: any) => void) {
		const target = e.target as HTMLInputElement;
		if (!target) return;
		const value = target.type === 'number' ? Number(target.value) : target.value;
		setter(value);
	}

	// Convert let declarations to $state
	let bgColor = $state<CSSColorString>('#F2F2F2');
	let borderColor = $state<CSSColorString>('#DEDEDE');
	let width = $state(200);
	let height = $state(100);
	let nodeTD = $state(false);
	let nodeLR = $state(false);
	let inputs = $state(1);
	let outputs = $state(1);
	let borderWidth = $state(1);
	let label = $state('');
	let locked = $state(false);
	let center = $state(false);
	let direction = $state<'LR' | 'TD' | undefined>(undefined);
	let nodes = $state<NodeConfig[]>([]);

	const onDragStart = (e: any) => {
		// e.dataTransfer.setData(NODE_BG_TYPE, nodeBackgroundColor);
		//e.dataTransfer.setData(NODE_BORDER_TYPE, nodeBorderColor);
		// e.dataTransfer.setData(NODE_BORDER_WIDTH, border_width);
		// e.dataTransfer.setData(NODE_WIDTH_DIMENSIONS_TYPE, nodeWidth);
		//e.dataTransfer.setData(NODE_HEIGHT_DIMENSIONS_TYPE, nodeHeight);
		// e.dataTransfer.setData(NODE_TD_ANCHOR_POSITION_TYPE, nodeTD);
		// e.dataTransfer.setData(NODE_LR_ANCHOR_POSITION_TYPE, nodeLR);
	};

	const onDragOver = (e: Event) => {
		e.preventDefault();
		return false;
	};

	const onDragEnter = (e: Event) => {
		dropZoneClass = 'active';
	};

	const onDragLeave = (e: Event) => {
		dropZoneClass = 'inactive';
	};

	const setPositionTD = (e: any) => {
		direction = 'TD';
	};

	const setPositionLR = (e: any) => {
		direction = 'LR';
	};

	const onDrop = (e: any) => {
		e.stopPropagation();
		//Issue click event
		const moveEvent = new MouseEvent('mousemove', {
			clientX: e.clientX,
			clientY: e.clientY,
			bubbles: true
		});
		e.target.dispatchEvent(moveEvent);

		dropZoneClass = 'inactive';

		// const nodeType: CSSColorString = e.dataTransfer.getData(NODE_BG_TYPE);
		//const borderType: CSSColorString = e.dataTransfer.getData(NODE_BORDER_TYPE);
		// const width: number = e.dataTransfer.getData(NODE_WIDTH_DIMENSIONS_TYPE);
		// const height: number = e.dataTransfer.getData(NODE_HEIGHT_DIMENSIONS_TYPE);
		const dimensions: InitialDimensions = { width, height };
		// const TD: boolean =  e.dataTransfer.getData(NODE_TD_ANCHOR_POSITION_TYPE);
		//const LR: boolean =  e.dataTransfer.getData(NODE_LR_ANCHOR_POSITION_TYPE);
		//let direction: 'TD' | 'LR' | undefined = TD ? 'TD' : LR ? 'LR' : undefined;

		// if(TD) ? direction = 'TD' : direction : 'LR'

		// const inputs: number = input;
		// const outputs: number = output;
		// const label: string = nodeText;
		//const borderWidth: number = e.dataTransfer.getData(NODE_BORDER_WIDTH);
		// console.log('border width', borderWidth)
		//console.log('border',borderType);
		// console.log('background', nodeType);
		// console.log('direction', TD);
		//const direction = 'TD';
		nodes = [
			...nodes,
			{ borderColor, bgColor, dimensions, inputs, outputs, label, locked, center, direction }
		];
		return false;
	};

	//
	const handleClick = (e: any) => {
		bgColor = '#F2F2F2';
		borderColor = '#DEDEDE';
		width = 200;
		height = 100;
		inputs = 1;
		outputs = 1;
		direction = undefined;
	};

	const handleLockedButtonClick = (e: any) => {
		locked = e.target.checked;
	};

	const handleCenterButtonClick = (e: any) => {
		center = e.target.checked;
	};
</script>

<div
	class={dropZoneClass}
	on:dragover={onDragOver}
	on:dragenter={onDragEnter}
	on:dragleave={onDragLeave}
	on:drop={onDrop}
>
	<Svelvet height={800} zoom={0.75} minimap controls>
		{#each nodes as node (node.id)}
			<Node {...node} drop="cursor" />
		{/each}
	</Svelvet>
</div>

<div class="drawer">
	<h1>Create Node</h1>
	<div id="node">
		<ul>
			<li class="list-item">Background Color: <input type="color" value={bgColor} on:input={(e) => handleInputChange(e, v => bgColor = v)} /></li>
			<li class="list-item">Border Color: <input type="color" value={borderColor} on:input={(e) => handleInputChange(e, v => borderColor = v)} /></li>
			<li class="list-item">Label: <input type="text" value={label} on:input={(e) => handleInputChange(e, v => label = v)} /></li>
			<li class="list-item">Border Width: <input type="number" value={borderWidth} on:input={(e) => handleInputChange(e, v => borderWidth = v)} /></li>
			<li class="list-item">
				<h3>Dimensions:</h3>
				<label for="width">Height:</label>
				<input id="width" type="number" value={width} on:input={(e) => handleInputChange(e, v => width = v)} />
				<label for="height">Width:</label>
				<input id="height" type="number" value={height} on:input={(e) => handleInputChange(e, v => height = v)} />
			</li>
			<li>
				<h3>Default Anchors</h3>
				<label for="#inputAnchor">Input Anchors: </label>
				<input id="inputAnchor" type="number" value={inputs} on:input={(e) => handleInputChange(e, v => inputs = v)} />
				<label for="#outputAnchor">Output Anchors: </label>
				<input id="outputAnchor" type="number" value={outputs} on:input={(e) => handleInputChange(e, v => outputs = v)} />
			</li>
			<li class="list-item">
				<h3>Anchor Position:</h3>
				<label for="#td">TD: </label>
				<input id="td" type="checkbox" bind:value={nodeTD} on:change={setPositionTD} />
				<label for="#lr">LR: </label>
				<input id="lr" type="checkbox" bind:value={nodeLR} on:change={setPositionLR} />
			</li>
			<li class="list-item">
				Locked: <input type="checkbox" bind:value={locked} on:change={handleLockedButtonClick} />
			</li>
			<li class="list-item">
				Centered: <input type="checkbox" bind:value={center} on:change={handleCenterButtonClick} />
			</li>
			<li class="list-item">
				<div id="createNode" draggable="true" on:dragstart={onDragStart}>Node</div>
			</li>
			<li>
				<button on:click|stopPropagation={handleClick}>Reset</button>
			</li>
		</ul>
	</div>
</div>

<!-- <div class="toolbox">
	<h3 class="title">Toolbox</h3>
	<ul class="toolbox-items">
		<li class="list-item" draggable="true" data-bordervalue='red' data-bordervalue='red' on:dragstart={onDragStart}>
			<div class="icon green" />
			Green Square
		</li>
		<li class="list-item" draggable="true" data-bgvalue="blue" on:dragstart={onDragStart}>
			<div class="icon blue" />
			Blue Square
		</li>
		<li class="list-item" draggable="true" data-bgvalue="red" on:dragstart={onDragStart}>
			<div class="icon red" />
			Red Square
		</li>
	</ul>
</div> -->

<style>
	#createNode {
		font-size: 2em;
		font-weight: bold;
	}

	.listItem {
		list-style: none;
	}
</style>
