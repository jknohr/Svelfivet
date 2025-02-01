<script lang="ts">
	import type { CustomWritable } from '$lib/types';

	interface Props {
		options: string[];
		parameterStore: CustomWritable<string> | null;
	}

	let { options = [], parameterStore = null } = $props();
	let initial = $state(0);

	$effect(() => {
		if (parameterStore) {
			parameterStore.set(options[initial]);
		}
	});

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/./g, '');

	function cycleThroughGroup(event: KeyboardEvent) {
		const key = event.key;
		const currentInitial = initial;
		const optionsLength = options.length;

		if (key !== 'Tab') event.preventDefault();
		event.stopPropagation();
		if (key === 'ArrowRight' || key === 'ArrowDown') {
			initial = (currentInitial + 1) % optionsLength;
		} else if (key === 'ArrowLeft' || key === 'ArrowUp') {
			initial = (currentInitial - 1 + optionsLength) % optionsLength;
		}
	}
</script>

<div class="radio-group" role="radiogroup" onkeydown={cycleThroughGroup} tabindex={0}>
	{#each options as label, index}
		<button
			onmousedown={() => {
				initial = index;
			}}
			aria-checked={initial === index}
			aria-label={label}
			role="radio"
		>
			<label class="option-wrapper">
				<input class="option" type="radio" id={slugify(label)} bind:group={initial} value={index} />
				<p>{label}</p>
			</label>
		</button>
	{/each}
</div>

<style>
	p {
		line-height: 1rem;
		padding: 0;
		margin: 0;
	}
	.option-wrapper {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
	}

	.radio-group {
		display: flex;
		width: 100%;
		justify-content: space-evenly;
		height: 1.5rem;
	}
</style>
