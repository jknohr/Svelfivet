<!--
@component ContrastTheme
A theme switcher component that provides high-contrast theme options and custom theme creation.
Features:
- Predefined high-contrast themes
- Custom theme creation with color pickers
- Position control (NE, NW, SE, SW)
- Theme persistence using localStorage
- Accessibility support with ARIA labels
-->

<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { ContrastConfig, ContrastThemeName, ContrastThemeProps, ThemeContext, ColorConfig } from './Theme.types';
  import { CONTRAST_THEME_NAMES } from './Theme.types';

  // Props
  interface Props extends ContrastThemeProps {}
  let { 
    position = 'NE',
    availableThemes = CONTRAST_THEME_NAMES,
    defaultTheme = 'Default' as const,
    onThemeChange
  } = $props();

  // Theme context
  const themeContext = getContext<ThemeContext>('theme');

  // State
  let currentTheme = $state<ContrastThemeName>(defaultTheme);
  let isCustomizing = $state(false);
  let customTheme = $state<ContrastConfig>({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    nodeColor: '#3b82f6',
    edgeColor: '#94a3b8'
  });

  // Predefined contrast themes
  const defaultThemes = {
    'Default': {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      nodeColor: '#3b82f6',
      edgeColor: '#94a3b8'
    },
    'Black/White': {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      nodeColor: '#ffffff',
      edgeColor: '#ffffff'
    },
    'Yellow/Black': {
      backgroundColor: '#ffff00',
      textColor: '#000000',
      nodeColor: '#000000',
      edgeColor: '#000000'
    },
    'Black/Yellow': {
      backgroundColor: '#000000',
      textColor: '#ffff00',
      nodeColor: '#ffff00',
      edgeColor: '#ffff00'
    },
    'Black/Green': {
      backgroundColor: '#000000',
      textColor: '#00ff00',
      nodeColor: '#00ff00',
      edgeColor: '#00ff00'
    },
    'Blue/Yellow': {
      backgroundColor: '#0000ff',
      textColor: '#ffff00',
      nodeColor: '#ffff00',
      edgeColor: '#ffff00'
    },
    'Yellow/Blue': {
      backgroundColor: '#ffff00',
      textColor: '#0000ff',
      nodeColor: '#0000ff',
      edgeColor: '#0000ff'
    },
    'Grayscale': {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      nodeColor: '#666666',
      edgeColor: '#999999'
    },
    'Black/Pink': {
      backgroundColor: '#000000',
      textColor: '#ff69b4',
      nodeColor: '#ff69b4',
      edgeColor: '#ff69b4'
    },
    'Custom': {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      nodeColor: '#3b82f6',
      edgeColor: '#94a3b8'
    }
  } as const satisfies Record<ContrastThemeName, ContrastConfig>;

  // Theme state
  const activeTheme = $derived.by(() => {
    const theme = currentTheme === 'Custom' ? customTheme : defaultThemes[currentTheme];
    return theme satisfies ContrastConfig;
  });

  // Generate theme colors
  const themeColors = $derived.by(() => {
    const theme = $state.snapshot(activeTheme);
    const colors: ColorConfig = {
      primary: theme.nodeColor,
      secondary: theme.edgeColor,
      accent: theme.nodeColor,
      background: theme.backgroundColor,
      surface: theme.backgroundColor,
      text: theme.textColor,
      textLight: theme.textColor,
      textDark: theme.textColor,
      border: theme.edgeColor,
      shadow: 'rgba(0, 0, 0, 0.1)',
      glass: {
        tint: theme.backgroundColor,
        border: theme.edgeColor,
        glow: theme.nodeColor,
        shadow: 'rgba(0, 0, 0, 0.1)',
        highlight: theme.nodeColor,
        backdrop: theme.backgroundColor
      },
      states: {
        focus: theme.nodeColor,
        attention: theme.nodeColor,
        error: '#ff0000',
        success: '#00ff00'
      }
    };
    return colors;
  });

  // Type guard for theme names
  function isValidThemeName(name: string): name is ContrastThemeName {
    return CONTRAST_THEME_NAMES.includes(name as ContrastThemeName);
  }

  // Load saved theme from localStorage
  $effect(() => {
    const savedTheme = localStorage.getItem('contrastTheme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if ('backgroundColor' in parsed) {
          customTheme = parsed as ContrastConfig;
          currentTheme = 'Custom';
        } else if (typeof parsed === 'string' && isValidThemeName(parsed)) {
          currentTheme = parsed;
        } else {
          currentTheme = defaultTheme;
        }
      } catch {
        currentTheme = defaultTheme;
      }
    }
  });

  // Apply theme changes
  $effect(() => {
    themeContext.setTheme({ colors: themeColors });

    // Save to localStorage
    const saveValue = currentTheme === 'Custom' ? customTheme : currentTheme;
    localStorage.setItem('contrastTheme', JSON.stringify(saveValue));

    // Call onThemeChange callback
    onThemeChange?.(saveValue);
  });

  // Handle theme selection
  function handleThemeChange(event: Event) {
    const selected = (event.target as HTMLSelectElement).value;
    if (isValidThemeName(selected)) {
      currentTheme = selected;
      isCustomizing = selected === 'Custom';
    }
  }

  // Reset to default theme
  function resetTheme() {
    currentTheme = defaultTheme;
    isCustomizing = false;
  }
</script>

<div 
  class="contrast-theme"
  class:ne={position === 'NE'}
  class:nw={position === 'NW'}
  class:se={position === 'SE'}
  class:sw={position === 'SW'}
>
  <label for="themeSelector" class="visually-hidden">Select Theme:</label>
  <select 
    id="themeSelector"
    value={currentTheme}
    onchange={handleThemeChange}
    aria-label="Select contrast theme"
  >
    {#each availableThemes as theme (theme)}
      <option value={theme}>{theme}</option>
    {/each}
  </select>

  {#if isCustomizing}
    <div class="custom-theme">
      <div class="color-picker">
        <label for="bgColor">Background</label>
        <input 
          type="color" 
          id="bgColor"
          bind:value={customTheme.backgroundColor}
        />
      </div>

      <div class="color-picker">
        <label for="textColor">Text</label>
        <input 
          type="color" 
          id="textColor"
          bind:value={customTheme.textColor}
        />
      </div>

      <div class="color-picker">
        <label for="nodeColor">Node</label>
        <input 
          type="color" 
          id="nodeColor"
          bind:value={customTheme.nodeColor}
        />
      </div>

      <div class="color-picker">
        <label for="edgeColor">Edge</label>
        <input 
          type="color" 
          id="edgeColor"
          bind:value={customTheme.edgeColor}
        />
      </div>

      <button onclick={resetTheme} class="reset-button">
        Reset to Default
      </button>
    </div>
  {/if}
</div>

<style>
  .contrast-theme {
    position: fixed;
    padding: var(--space-md, 1rem);
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-lg, 0.5rem);
    box-shadow: 0 2px 4px var(--color-shadow, rgba(0, 0, 0, 0.1));
    z-index: 100;
  }

  .ne { top: 1rem; right: 1rem; }
  .nw { top: 1rem; left: 1rem; }
  .se { bottom: 1rem; right: 1rem; }
  .sw { bottom: 1rem; left: 1rem; }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--color-border, #e5e7eb);
    border-radius: var(--radius-md, 0.375rem);
    background: var(--color-surface, #ffffff);
    color: var(--color-text, #000000);
  }

  .custom-theme {
    margin-top: 1rem;
    display: grid;
    gap: 0.5rem;
  }

  .color-picker {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 0.5rem;
  }

  .reset-button {
    margin-top: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    background: var(--color-primary, #3b82f6);
    color: var(--color-surface, #ffffff);
    border: none;
    border-radius: var(--radius-md, 0.375rem);
    cursor: pointer;
  }

  .reset-button:hover {
    opacity: 0.9;
  }
</style> 
