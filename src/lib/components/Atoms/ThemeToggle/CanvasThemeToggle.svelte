<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!-- @migration-task Error while migrating Svelte code: Cannot use rune without parentheses
https://svelte.dev/e/rune_missing_parentheses -->
<!--
@component ThemeToggle
A theme toggle component that supports light, dark, and high-contrast modes.
Features:
- Light/Dark/High-contrast mode switching
- Position control (NE, NW, SE, SW)
- Material Icons integration
- Theme persistence using localStorage
- Accessibility support with ARIA labels
-->
<svelte:options runes={true} />

<script lang="ts">
	import { getContext } from 'svelte';
	import type { UnifiedThemeContext, ThemeMode, ContrastThemeName } from '$lib/components/Theme/Theme.types';
	import type { ThemeToggleProps } from './ThemeToggle.types';
	import Typography from '$lib/components/Theme/Typography.svelte';
	import { createElementRunes } from '$lib/components/Theme/ThemeElements';
	import type { AtomicElements, ElementType } from '$lib/components/Theme/ThemeElements';

	// Props
	const {
		mode = 'light',
		position = 'NE',
		lightIcon = 'light_mode',
		darkIcon = 'dark_mode',
		contrastIcon = 'contrast',
		availableThemes = [],
		onThemeChange
	} = $props();

	// Theme context
	const themeContext = getContext<UnifiedThemeContext>('theme');

	// State
	let currentMode = $state<ThemeMode>(mode as ThemeMode);
	let isOpen = $state(false);

	// Create element runes
	const element = createElementRunes('toggle' as ElementType);
	const elementState = element.state.create();

	$effect(() => {
		elementState.disabled = false;
		elementState.active = currentMode === 'dark';
	});

	// Get next mode in cycle
	function getNextMode(): ThemeMode {
		const modes: ThemeMode[] = ['light', 'dark', 'high-contrast'];
		const currentIndex = modes.indexOf(currentMode);
		return modes[(currentIndex + 1) % modes.length];
	}

	// Get current icon
	const currentIcon = $derived(() => {
		switch (currentMode) {
			case 'light': return lightIcon;
			case 'dark': return darkIcon;
			case 'high-contrast': return contrastIcon;
			default: return lightIcon;
		}
	});

	// Toggle theme
	function toggleTheme() {
		const nextMode = getNextMode();
		currentMode = nextMode;
		
		// Update theme context
		if (nextMode === 'high-contrast') {
			themeContext.contrast.setTheme('Black/White');
		} else {
			const colors = nextMode === 'dark' ? {
				background: '#1a1a1a',
				surface: '#2a2a2a',
				text: '#ffffff',
				textLight: '#e0e0e0',
				textDark: '#a0a0a0'
			} : {
				background: '#ffffff',
				surface: '#f5f5f5',
				text: '#1a1a1a',
				textLight: '#4a4a4a',
				textDark: '#2a2a2a'
			};
			
			themeContext.setTheme({
				colors: {
					...themeContext.theme.colors,
					...colors
				}
			});
		}

		// Save to localStorage
		localStorage.setItem('theme-mode', nextMode);

		// Call callback
		onThemeChange?.(nextMode);
	}

	// Select specific theme
	function selectTheme(theme: string) {
		if (theme === 'light' || theme === 'dark' || theme === 'high-contrast') {
			currentMode = theme as ThemeMode;
			
			if (theme === 'high-contrast') {
				themeContext.contrast.setTheme('Black/White');
			} else {
				const colors = theme === 'dark' ? {
					background: '#1a1a1a',
					surface: '#2a2a2a',
					text: '#ffffff',
					textLight: '#e0e0e0',
					textDark: '#a0a0a0'
				} : {
					background: '#ffffff',
					surface: '#f5f5f5',
					text: '#1a1a1a',
					textLight: '#4a4a4a',
					textDark: '#2a2a2a'
				};
				
				themeContext.setTheme({
					colors: {
						...themeContext.theme.colors,
						...colors
					}
				});
			}
		} else {
			currentMode = 'high-contrast';
			themeContext.contrast.setTheme(theme as ContrastThemeName);
		}
		
		// Save to localStorage
		localStorage.setItem('theme-mode', currentMode);
		
		// Call callback
		onThemeChange?.(theme);
		
		// Close dropdown
		isOpen = false;
	}

	// Load saved theme
	$effect(() => {
		const savedMode = localStorage.getItem('theme-mode');
		if (savedMode) {
			selectTheme(savedMode);
		}
	});

	// Setup element effects
	$effect(() => {
		if (element.state.derived.hasState) {
			// Update glass effect based on state
			themeContext.glass.updatePane('theme-toggle', {
				opacity: element.state.derived.currentState.hover ? 0.25 : 0.2,
				blur: element.state.derived.currentState.focus ? '15px' : '10px',
				borderOpacity: element.state.derived.currentState.active ? 0.3 : 0.2
			});
		}
	});

	let toggleButton: HTMLButtonElement;

	$effect(() => {
		if (toggleButton) {
			element.effects.setupInteractions(toggleButton);
			element.effects.setupAccessibility(toggleButton);
			element.effects.setupGestures(toggleButton);
		}
	});
</script>

<div
	class="theme-toggle"
	class:ne={position === 'NE'}
	class:nw={position === 'NW'}
	class:se={position === 'SE'}
	class:sw={position === 'SW'}
	class:open={isOpen}
	use:element.effects.setupInteractions
	use:element.effects.setupAccessibility
	use:element.effects.setupGestures
>
	<button
		bind:this={toggleButton}
		class="theme-toggle"
		data-position={position}
		aria-label={`Switch to ${getNextMode()} mode`}
		onclick={toggleTheme}
	>
		<Typography family="icon" size="lg">
			{currentIcon}
		</Typography>
	</button>

	{#if availableThemes.length > 0}
		<button
			class="menu-button"
			onclick={() => isOpen = !isOpen}
			onkeydown={(e) => e.key === 'Enter' && (isOpen = !isOpen)}
			aria-label="Open theme menu"
			aria-expanded={isOpen}
		>
			<Typography isIcon>
				expand_more
			</Typography>
		</button>

		{#if isOpen}
			<div 
				class="theme-menu"
				role="menu"
				aria-label="Theme options"
			>
				{#each availableThemes as theme (theme)}
					<button
						class="menu-item"
						role="menuitem"
						onclick={() => selectTheme(theme)}
						onkeydown={(e) => e.key === 'Enter' && selectTheme(theme)}
					>
						{theme}
					</button>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.theme-toggle {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border: none;
		background: none;
		cursor: pointer;
		opacity: 0.8;
		transition: opacity 0.2s ease-in-out;
	}

	.theme-toggle:hover {
		opacity: 1;
	}

	/* Position classes */
	.theme-toggle[data-position='NE'] {
		top: 1rem;
		right: 1rem;
	}

	.theme-toggle[data-position='NW'] {
		top: 1rem;
		left: 1rem;
	}

	.theme-toggle[data-position='SE'] {
		bottom: 1rem;
		right: 1rem;
	}

	.theme-toggle[data-position='SW'] {
		bottom: 1rem;
		left: 1rem;
	}

	.menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text);
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-standard);
	}

	.menu-button:hover {
		background: var(--color-surface-hover);
	}

	.menu-button:focus-visible {
		outline: 2px solid var(--color-focus);
		outline-offset: 2px;
	}

	.theme-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: var(--space-2);
		padding: var(--space-2);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.menu-item {
		width: 100%;
		padding: var(--space-2);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-text);
		text-align: left;
		cursor: pointer;
		transition: all var(--duration-normal) var(--ease-standard);
	}

	.menu-item:hover {
		background: var(--color-surface-hover);
	}

	.menu-item:focus-visible {
		outline: 2px solid var(--color-focus);
		outline-offset: -2px;
	}

	/* Glass effect styles */
	:global(.theme-toggle) {
		backdrop-filter: var(--glass-blur);
		background: var(--glass-background);
		border-color: var(--glass-border);
	}

	/* Spatial styles */
	@media (--ar) {
		.theme-toggle {
			position: absolute;
			transform-style: preserve-3d;
			transform: translateZ(var(--depth-floating));
		}
	}

	@media (--vr) {
		.theme-toggle {
			position: absolute;
			transform-style: preserve-3d;
			transform: translateZ(var(--depth-ui));
		}
	}
</style>
