<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

</script>

<script module lang="ts">
	import type { CSSColorString, EdgeProps, EdgeDrawerConfig } from '$lib/types';
	import { addProps } from '$lib/utils';

	//types for edge creation
	$state.edgeWidth = undefined;
	$state.color = undefined;
	$state.straight = undefined; // Stretch feature, requires additional logic
	$state.step = undefined;
	$state.cornerRadius = undefined;
	$state.animate = undefined;
	$state.edgeLabel = undefined;
	$state.labelColor = undefined;
	$state.textColor = undefined;
	// $state.edgeClick = null; // Stretch feature, needs edgeClick to function
	$state.targetColor = undefined; // Stretch feature, needs edgeClick to function

	export function createEdgeProps() {
		// Object that stores properties for the created edge
		const edgeProps: EdgeDrawerConfig = {};
		// Array of property names and values for edge
		const edgePropsNames: string[] = [
			'width',
			'targetColor',
			'color',
			'straight',
			'step',
			'cornerRadius',
			'animate',
			'label',
			'labelColor',
			'textColor'
		];
		const edgePropsArray: EdgeProps = [
			 $state.edgeWidth,
			 $state.targetColor,
			 $state.color,
			 $state.straight,
			 $state.step,
			 $state.cornerRadius,
			 $state.animate,
			 $state.edgeLabel,
			 $state.labelColor,
			 $state.textColor
		];

		// Add props to edge if they exist
		addProps(edgePropsNames, edgePropsArray, edgeProps);

		// Return edgeProps if they were created or undefined
		if (Object.keys(edgeProps).length) return edgeProps;
		return;
	}

	const handleStepButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		 $state.step = target.checked;
	};
	const handleAnimateButtonClick = (e: Event) => {
		const target = e.target as HTMLInputElement;
		 $state.animate = target.checked;
	};

	const handleEdgeResetButtonClick = (e: Event) => {
		 $state.edgeWidth = undefined;
		 $state.targetColor = undefined;
		 $state.color = undefined;
		 $state.straight = undefined;
		 $state.step = undefined;
		 $state.cornerRadius = undefined;
		 $state.animate = undefined;
		 $state.edgeLabel = undefined;
		 $state.labelColor = undefined;
		 $state.textColor = undefined;
		//edgeClick: () => void | null;
		const target = e.target as HTMLFormElement;
		target.reset();
	};

	// Validation for edge properties
	const validateEdgeProps = () => {
		if ( $state.edgeWidth !== undefined && typeof  $state.edgeWidth !== 'number') {
			throw new Error('Invalid value for edgeWidth property');
		}
		if ( $state.color !== undefined && typeof  $state.color !== 'string') {
			throw new Error('Invalid value for color property');
		}
		if ( $state.straight !== undefined && typeof  $state.straight !== 'boolean') {
			throw new Error('Invalid value for straight property');
		}
		if ( $state.step !== undefined && typeof  $state.step !== 'boolean') {
			throw new Error('Invalid value for step property');
		}
		if ( $state.cornerRadius !== undefined && typeof  $state.cornerRadius !== 'number') {
			throw new Error('Invalid value for cornerRadius property');
		}
		if ( $state.animate !== undefined && typeof  $state.animate !== 'boolean') {
			throw new Error('Invalid value for animate property');
		}
		if ( $state.edgeLabel !== undefined && typeof  $state.edgeLabel !== 'string') {
			throw new Error('Invalid value for edgeLabel property');
		}
		if ( $state.labelColor !== undefined && typeof  $state.labelColor !== 'string') {
			throw new Error('Invalid value for labelColor property');
		}
		if ( $state.textColor !== undefined && typeof  $state.textColor !== 'string') {
			throw new Error('Invalid value for textColor property');
		}
		if ( $state.targetColor !== undefined && typeof  $state.targetColor !== 'string') {
			throw new Error('Invalid value for targetColor property');
		}
	};
</script>

<div id="edgeContainer">
	<!-- On submit resets all the values on the input field in the form to default -->
	<form onsubmit={preventDefault(handleEdgeResetButtonClick)}>
		<ul aria-labelledby="select_props">
			<li class="list-item">
				<label for="color">Background: </label>
				<input id="color" class="colorWheel" type="color" bind:value={$state.color} />
			</li>
			<li class="list-item">
				<label for="labelColor">Label: </label>
				<input id="labelColor" class="colorWheel" type="color" bind:value={$state.labelColor} />
			</li>
			<li class="list-item">
				<label for="textColor">Text: </label>
				<input id="textColor" class="colorWheel" type="color" bind:value={$state.textColor} />
			</li>
			<li class="list-item">
				<label for="animate">Animate : </label>
				<input
					id="animate"
					type="checkbox"
					bind:value={$state.animate}
					onchange={handleAnimateButtonClick}
				/>
			</li>
			<li class="list-item">
				<label for="step">Step: </label>
				<input id="step" type="checkbox" bind:value={$state.step} onchange={handleStepButtonClick} />
			</li>
			<li class="list-item">
				<label for="cornerRadius">Corner Radius:</label>
				<input id="cornerRadius" class="inputField" type="number" bind:value={$state.cornerRadius} />
			</li>
			<li class="list-item">
				<label for="width">Width:</label>
				<input id="width" class="inputField" type="number" bind:value={$state.edgeWidth} />
			</li>
			<li class="list-item">
				<label for="edgeLabel">Edge Label: </label>
				<input id="edgeLabel" type="text" bind:value={$state.edgeLabel} />
			</li>
			<li class="list-item">
				<button class="edgeResetBtn btn" aria-label="Reset">Reset</button>
			</li>
		</ul>
	</form>
</div>

<style>
	/* Edge dropdown Styling */
	#edgeContainer {
		width: 100%;
		font-size: 15px;
	}
	#edgeContainer ul {
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
		padding: 8px 20px;
		margin: auto;
		margin-top: 10px;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 15px;
		margin-left: 70px;
	}

	.edgeResetBtn {
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

	.edgeResetBtn:hover {
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
