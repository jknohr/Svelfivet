<script module lang="ts">
	import { writable } from 'svelte/store';
	import type {
		NodeDrawerConfig,
		AnchorDrawerConfig,
		EdgeDrawerConfig,
		CSSColorString,
		NodeProps
	} from '$lib/types';
	import { addProps } from '$lib/utils';

	// External stores
	export const defaultNodePropsStore = writable<Array<NodeDrawerConfig>>([]);

	// types for node creation
	$state.bgColor = undefined;
	$state.borderColor = undefined;
	$state.label = undefined;
	$state.width = 200;
	$state.height = 100;
	$state.locked = undefined;
	$state.center = undefined;
	$state.inputs = undefined;
	$state.outputs = undefined;
	$state.rotation = undefined;
	$state.zIndex = undefined;
	$state.TD = undefined;
	$state.LR = undefined;
	$state.useDefaults = undefined;
	$state.nodeDirection = undefined;

	// Let syntax for props in Svelte 5
	let { children } = $props();

	// Creates props and adds to customNodePropsStore if an anchor was created, defaultNodePropsStore if not
	export const createNodeProps = (
		edgeProps?: EdgeDrawerConfig,
		anchorProps?: { [key: string]: AnchorDrawerConfig[] }
	): void => {
		// Object that stores properties for the created node
		const nodeProps: NodeDrawerConfig = {};
		// Array of property names and values for node
		const nodePropNames: string[] = [
			'bgColor',
			'borderColor',
			'label',
			'width',
			'height',
			'locked',
			'center',
			'inputs',
			'outputs',
			'rotation',
			'zIndex',
			'TD',
			'LR',
			'useDefaults'
		];
		const nodePropsArray: NodeProps = [
			$state.bgColor,
			$state.borderColor,
			$state.label,
			$state.width,
			$state.height,
			$state.locked,
			$state.center,
			$state.inputs,
			$state.outputs,
			$state.rotation,
			$state.zIndex,
			$state.TD,
			$state.LR,
			$state.useDefaults
		];

		// Add props to node if they exist
		addProps(nodePropNames, nodePropsArray, nodeProps);
		if (anchorProps) nodeProps.anchors = anchorProps;
		if (edgeProps) nodeProps.edgeProps = edgeProps;
		defaultNodePropsStore.update((nodes) => [...nodes, nodeProps]);
	};

	// Button clicks for defaultNodes
	const handleNodeResetButtonClick = (e: Event) => {
		$state.bgColor = undefined;
		$state.borderColor = undefined;
		$state.label = undefined;
		$state.width = 200;
		$state.height = 100;
		$state.inputs = undefined;
		$state.outputs = undefined;
		$state.locked = undefined;
		$state.center = undefined;
		$state.rotation = undefined;
		$state.zIndex = undefined;
		$state.TD = undefined;
		$state.LR = undefined;
		$state.useDefaults = undefined;

		const formElement = e.target as HTMLFormElement;
		formElement.reset();
	};

	const handleLockedButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		 $state.locked = target.checked;
	};

	const handleCenterButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		 $state.center = target.checked;
	};

	const handleUseDefaultsButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		 $state.useDefaults = target.checked;
	};

	const handleAnchorPositionButton = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target.value == '')  $state.nodeDirection = undefined;
		else {
			 $state.nodeDirection = target.value;
			if ( $state.nodeDirection === 'LR') {
				 $state.LR = true;
				 $state.TD = false;
			} else {
				 $state.TD = true;
				 $state.LR = false;
			}
		}
	};

	// Validation for node properties
	const validateNodeProps = () => {
		if ( $state.bgColor !== undefined && typeof  $state.bgColor !== 'string') {
			throw new Error('Invalid value for bgColor property');
		}
		if ( $state.borderColor !== undefined && typeof  $state.borderColor !== 'string') {
			throw new Error('Invalid value for borderColor property');
		}
		if ( $state.label !== undefined && typeof  $state.label !== 'string') {
			throw new Error('Invalid value for label property');
		}
		if ( $state.width !== undefined && typeof  $state.width !== 'number') {
			throw new Error('Invalid value for width property');
		}
		if ( $state.height !== undefined && typeof  $state.height !== 'number') {
			throw new Error('Invalid value for height property');
		}
		if ( $state.locked !== undefined && typeof  $state.locked !== 'boolean') {
			throw new Error('Invalid value for locked property');
		}
		if ( $state.center !== undefined && typeof  $state.center !== 'boolean') {
			throw new Error('Invalid value for center property');
		}
		if ( $state.inputs !== undefined && typeof  $state.inputs !== 'number') {
			throw new Error('Invalid value for inputs property');
		}
		if ( $state.outputs !== undefined && typeof  $state.outputs !== 'number') {
			throw new Error('Invalid value for outputs property');
		}
		if ( $state.rotation !== undefined && typeof  $state.rotation !== 'number') {
			throw new Error('Invalid value for rotation property');
		}
		if ( $state.zIndex !== undefined && typeof  $state.zIndex !== 'number') {
			throw new Error('Invalid value for zIndex property');
		}
		if ( $state.TD !== undefined && typeof  $state.TD !== 'boolean') {
			throw new Error('Invalid value for TD property');
		}
		if ( $state.LR !== undefined && typeof  $state.LR !== 'boolean') {
			throw new Error('Invalid value for LR property');
		}
		if ( $state.useDefaults !== undefined && typeof  $state.useDefaults !== 'boolean') {
			throw new Error('Invalid value for useDefaults property');
		}
		if ( $state.nodeDirection !== undefined && typeof  $state.nodeDirection !== 'string') {
			throw new Error('Invalid value for nodeDirection property');
		}
	};
</script>

<div id="nodeContainer">
	<!-- On submit resets all the values on the input field in the form to default -->
	<form onreset={handleNodeResetButtonClick}>
		{@render children?.()}
		<ul aria-labelledby="select_props">
			<li class="list-item">
				<label for="bgColor">Background: </label>
				<input id="bgColor" class="colorWheel" type="color" bind:value={$state.bgColor} />
			</li>
			<li class="list-item">
				<label for="borderColor">Border: </label>
				<input id="borderColor" class="colorWheel" type="color" bind:value={$state.borderColor} />
			</li>
			<!-- <li class="list-item">
				<label for="useDefaults">useDefaults: </label>
				<input
					id="useDefaults"
					type="checkbox"
					bind:value={$state.useDefaults}
					onchange={handleUseDefaultsButtonClick}
				/>
			</li> -->

			<li class="list-item">
				<label for="dimensions">Dimensions:</label>
			</li>
			<li class="list-item">
				<label for="width">Width:</label>
				<input id="width" class="inputField" type="input" bind:value={$state.width} />
				<label for="height" style="margin-left: 6px">Height:</label>
				<input id="height" class="inputField" type="input" bind:value={$state.height} />
			</li>
			<li class="list-item">
				<label for="locked">Locked: </label>
				<input id="label" type="checkbox" bind:value={$state.locked} onchange={handleLockedButtonClick} />
			</li>
			<li class="list-item">
				<label for="centered">Centered: </label>
				<input
					id="centered"
					type="checkbox"
					bind:value={$state.center}
					onchange={handleCenterButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="rotation">Rotation:</label>
				<input id="rotation" class="inputField" type="number" bind:value={$state.rotation} />
			</li>
			<li class="list-item">
				<label for="zIndex">zIndex:</label>
				<input id="zIndex" class="inputField" type="number" bind:value={$state.zIndex} />
			</li>
			<li class="list-item">
				<label for="label">Label : </label>
				<input id="label" type="text" bind:value={$state.label} />
			</li>
			<li class="list-item">
				<label for="defaultAnchors">Default Anchors:</label>
			</li>
			<li class="list-item">
				<label for="inputAnchor">Input: </label>
				<input id="inputAnchor" class="inputField" type="number" min="0" bind:value={$state.inputs} />
				<label for="outputAnchor" style="margin-left: 6px">Output: </label>
				<input id="outputAnchor" class="inputField" type="number" min="0" bind:value={$state.outputs} />
			</li>
			<li class="list-item">
				<label for="anchorPositon">Anchor Position: </label>
				<select
					id="anchorPosition"
					bind:value={$state.nodeDirection}
					onchange={handleAnchorPositionButton}
				>
					<option value="">-</option>
					<option value="LR">LR</option>
					<option value="TD">TD</option>
				</select>
			</li>
			<li class="list-item">
				<button class="nodeResetBtn btn" aria-label="Reset">Reset</button>
			</li>
		</ul>
	</form>
</div>

<style>
	/* Node dropdown Styling */
	#nodeContainer {
		width: 100%;
		font-size: 15px;
	}
	#nodeContainer ul {
		margin: 0;
		padding: 0;
	}
	label {
		margin-right: 10px;
	}

	.list-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		list-style: none;
		margin-bottom: 10px;
		margin-right: 3px;
	}
	.colorWheel {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: transparent;
		border: none;
		width: 35px;
		height: 35px;
		cursor: pointer;
		border-radius: 50%;
	}
	.colorWheel::-webkit-color-swatch {
		border-radius: 40%;
	}
	.colorWheel::-moz-color-swatch {
		border-radius: 40%;
	}

	.inputField {
		width: 50px;
	}
	.btn {
		width: 120px;
		color: aliceblue;
		padding: 8px 20px;
		margin: auto;
		margin-top: 10px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 15px;
		margin-left: 70px;
	}
	.nodeResetBtn {
		color: var(
			--prop-drawer-reset-button-text-color,
			var(--drawer-reset-button-text-color, var(--default-reset-drawer-button-text-color))
		);
		background-color: var(
			--prop-drawer-reset-button-color,
			var(--drawer-reset-button-color, var(--default-drawer-reset-button-color))
		);
		box-shadow: 0 0 0 var(--final-border-width) var(--final-border-color),
			var(--default-node-shadow);
	}

	.nodeResetBtn:hover {
		color: var(
			--prop-drawer-reset-button-hover-text-color,
			var(
				--drawer-reset-button-hover-text-color,
				var(--default-drawer-reset-button-hover-text-color)
			)
		);
		background-color: var(
			--prop-drawer-reset-button-hover-color,
			var(--drawer-reset-button-hover-color, var(--default-drawer-reset-button-hover-color))
		);
	}
</style>
