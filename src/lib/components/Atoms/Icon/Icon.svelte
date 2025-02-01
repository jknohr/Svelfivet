<!-- /src/lib/components/Icon.svelte -->
<!--
@component Icon
A versatile icon component that utilizes Material Symbols Outlined from Google Fonts.
Features:
- Integration with Material Symbols Outlined
- Customizable size and weight
- Supports font variation settings for advanced styling
- Accessibility support with ARIA attributes
-->

<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  
  import type { IconProps } from './Icon.types';

  // Props
  let { name, size = '24px', weight = 'regular', fill = 'currentColor', 
        grade = 0, opacity = 1, style: additionalStyle = {} }: IconProps = $props();

  // Theme context
  const themeContext = getContext<UnifiedThemeContext>('theme');

  // Derived styles
  const styles = $derived(() => ({
    '--icon-size': size,
    '--icon-weight': fontWeights[weight],
    '--icon-fill': fill,
    '--icon-grade': grade,
    '--icon-opacity': opacity
  }));

  // Font weight mapping
  const fontWeights: Record<string, number> = {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700
  };
</script>

<span
  class="icon"
  style="{Object.entries(styles).map(([key, value]) => `${key}:${value}`).concat(Object.entries(additionalStyle).map(([key, value]) => `${key}:${value}`)).join(';')}"
  aria-hidden="true"
>
  <span class="material-symbols-outlined">
    {name}
  </span>
</span>

<style>
  .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-variation-settings:
      'FILL' var(--icon-fill),
      'wght' var(--icon-weight),
      'GRAD' var(--icon-grade),
      'opsz' calc(var(--icon-size) / 1px);
    font-size: var(--icon-size);
    opacity: var(--icon-opacity);
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined', sans-serif;
    font-weight: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
  }
</style>