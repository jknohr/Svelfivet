<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<script lang="ts">
	import type { CSSColorString } from '$lib/types';
	import { getJSONState } from '$lib/utils/savers/saveStore';
	import { onMount } from 'svelte';
	import { graphStore } from '$lib/stores';

	interface Props {
		main?: string;
		alt?: string;
		mainIcon?: string;
		altIcon?: string;
		corner?: 'NE' | 'NW' | 'SE' | 'SW';
		bgColor?: CSSColorString | null;
		iconColor?: CSSColorString | null;
		onToggleTheme?: (theme: string) => void;
		onSave?: () => void;
		themeOptions?: string[];
	}

	let { main = 'light', alt = 'dark', mainIcon = 'light_mode', altIcon = 'dark_mode', corner = 'NE', bgColor = null, iconColor = null, onToggleTheme = undefined, onSave = undefined, themeOptions = ['light', 'dark', 'Black/White', 'Yellow/Black', 'Black/Yellow', 'Yellow/Blue', 'Grayscale', 'Black/Pink'] }: Props = $props();
	let current = $state(main);

	function toggleTheme() {
		try {
			const currentTheme = document.documentElement.getAttribute('svelvet-theme');
			let newTheme;
			if (!currentTheme || currentTheme === main) {
				newTheme = alt;
				current = alt;
			} else {
				newTheme = main;
				current = main;
			}
			document.documentElement.setAttribute('svelvet-theme', newTheme);
			localStorage.setItem('currentTheme', newTheme);
			if (onToggleTheme) onToggleTheme(newTheme);
		} catch (error) {
			console.error('Error toggling theme:', error);
		}
	}

	function setTheme(theme: string) {
		try {
			document.documentElement.setAttribute('svelvet-theme', theme);
			current = theme;
			localStorage.setItem('currentTheme', theme);
			if (onToggleTheme) onToggleTheme(theme);
		} catch (error) {
			console.error('Error setting theme:', error);
		}
	}

	onMount(() => {
		try {
			const savedTheme = localStorage.getItem('currentTheme');
			if (savedTheme) {
				document.documentElement.setAttribute('svelvet-theme', savedTheme);
				current = savedTheme;
			} else {
				document.documentElement.setAttribute('svelvet-theme', main);
				current = main;
			}
		} catch (error) {
			console.error('Error setting initial theme:', error);
		}
	});

	let graph: any;
	graphStore.subscribe((graphMap) => {
		const graphKey = 'G-1';
		graph = graphMap.get(graphKey);
	});
</script>

<div
	class="controls-wrapper"
	style:--prop-theme-toggle-color={bgColor}
	style:--prop-theme-toggle-text-color={iconColor}
	class:SW={corner === 'SW'}
	class:NE={corner === 'NE'}
	class:SE={corner === 'SE'}
	class:NW={corner === 'NW'}
>
	<button onclick={toggleTheme} ontouchstart={toggleTheme}>
		<span class="material-symbols-outlined">{current === main ? altIcon : mainIcon}</span>
	</button>

	<button
		class="save-button NW"
		onclick={() => {
			try {
				getJSONState(graph);
				if (onSave) onSave();
			} catch (error) {
				console.error('Error saving graph state:', error);
			}
		}}>Save</button
	>

	<select
		class="theme-selector"
		onchange={(e) => setTheme((e.target as HTMLSelectElement).value)}
	>
		{#each themeOptions as themeOption}
			<option value={themeOption} selected={themeOption === current}>{themeOption}</option>
		{/each}
	</select>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0');

	span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}

	* {
		box-sizing: border-box;
	}
	.NW {
		left: 10px;
		top: 10px;
	}

	.NE {
		right: 10px;
		top: 10px;
	}

	.SE {
		right: 10px;
		bottom: 10px;
	}

	.SW {
		left: 10px;
		bottom: 10px;
	}
	.controls-wrapper {
		position: absolute;
		display: flex;
		width: 1.5rem;
		flex-direction: column;
		border-radius: 6px;
		overflow: hidden;
		padding: 4px;
		width: fit-content;
		height: fit-content;
		cursor: pointer;
		box-shadow: var(--theme-toggle-shadow, var(--default-theme-toggle-shadow));
		border: solid 1px var(--theme-toggle-border, var(--default-theme-toggle-border));
		color: var(
			--prop-theme-toggle-text-color,
			var(--theme-toggle-text-color, var(--default-theme-toggle-text-color))
		);
		background-color: var(
			--prop-theme-toggle-color,
			var(--theme-toggle-color, var(--default-theme-toggle-color))
		);
	}

	button {
		margin: 0;
		padding: 0;
		border: none;
		background: none;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem 0;
		border-bottom: solid 1px rgb(190, 188, 188);
		color: inherit;
	}
	span {
		font-family: 'Material Symbols Outlined';
		font-size: 1.2rem;
		color: inherit;
	}
	button:last-child {
		border-bottom: none;
	}
	button:hover {
		cursor: pointer;
	}
	.save-button {
		top: 10px;
		left: 10px;
		background-color: var(--save-button-bg-color, var(--default-save-button-bg-color));
		color: var(--save-button-text-color, var(--default-save-button-text-color));
		border: solid 1px var(--save-button-border-color, var(--default-save-button-border-color));
		cursor: pointer;
	}
	.theme-selector {
		margin-top: 10px;
		padding: 5px;
		border-radius: 4px;
		border: 1px solid var(--theme-toggle-border, var(--default-theme-toggle-border));
		background-color: var(--theme-toggle-color, var(--default-theme-toggle-color));
		color: var(--theme-toggle-text-color, var(--default-theme-toggle-text-color));
	}
</style>
