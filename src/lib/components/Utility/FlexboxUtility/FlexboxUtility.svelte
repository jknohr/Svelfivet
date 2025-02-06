<!-- /src/lib/components/FlexboxUtility.svelte -->
<!--
@component FlexboxUtility
A flexible and responsive layout utility using CSS Flexbox with Svelte 5 runes.
Features:
- Direction control (row, column, row-reverse, column-reverse)
- Alignment and justification (start, center, end, space-between, space-around, space-evenly)
- Responsive behavior based on theme and viewport
- Integration with theme system for spacing and styling
- Support for wrapping and gap management
-->

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext, ScaleContext } from '$lib/components/Theme/Theme.types';
  import type { FlexboxUtilityProps } from './FlexboxUtility.types';

  // Props using Svelte 5 runes
  let { 
    direction = 'row',
    justifyContent = 'flex-start',
    alignItems = 'flex-start',
    wrap = false,
    gap = '1rem',
    padding = '0',
    margin = '0',
    density = 'comfortable',
    children
  } = $props() satisfies FlexboxUtilityProps;

  // Theme context
  const theme = getContext<UnifiedThemeContext>('theme');
  const scale = getContext<ScaleContext>('spatial-scale');

  // Reactive state using Svelte 5 runes
  let effectiveScale = $derived(scale.scale);
  let currentDensity = $derived(density);

  // Helper function for theme value computation
  function computeThemeValue(value: string): string {
    return theme.utils.getCSSVariable(value) || value;
  }

  // Derived styles using Svelte 5's $derived
  let styles = $derived({
    display: 'flex',
    'flex-direction': direction,
    'justify-content': justifyContent,
    'align-items': alignItems,
    'flex-wrap': wrap ? 'wrap' : 'nowrap',
    gap: computeThemeValue(gap),
    padding: computeThemeValue(padding),
    margin: computeThemeValue(margin)
  });
</script>

<div
  class="flexbox-utility"
  class:compact={currentDensity === 'compact'}
  class:spacious={currentDensity === 'spacious'}
  style={Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';')}
>
  {@render children?.()}
</div>

<style>
  .flexbox-utility {
    box-sizing: border-box;
    transition: all var(--transition-normal, 0.2s) var(--ease-standard, ease-in-out);
  }

  /* Density variations */
  .flexbox-utility.compact {
    gap: calc(var(--gap, 1rem) * 0.618);
  }

  .flexbox-utility.spacious {
    gap: calc(var(--gap, 1rem) * 1.618);
  }
</style>
