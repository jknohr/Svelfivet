<!--
@component Typography
Provides consistent typography scaling and styling across components.
Features:
- Font size scale
- Line height scale
- Font weight presets
- Responsive text scaling
- Font family management
- Text color themes
- Google Fonts integration
- Material Icons (Outlined) support
-->
<svelte:options runes={true} />

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
</svelte:head>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { defaultTheme } from './defaulttheme';

  type FontWeight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  type TextAlign = 'left' | 'center' | 'right' | 'justify';
  type FontFamily = 'sans' | 'serif' | 'mono' | 'display' | 'icon';

  // Typography configuration props
  let {
    size = 'base' as TextSize,
    weight = 'regular' as FontWeight,
    align = 'left' as TextAlign,
    family = 'sans' as FontFamily,
    color = 'inherit',
    lineHeight = 'normal',
    letterSpacing,
    isIcon = false,
    children
  } = $props<{
    size?: TextSize;
    weight?: FontWeight;
    align?: TextAlign;
    family?: FontFamily;
    color?: string;
    lineHeight?: string;
    letterSpacing?: string;
    isIcon?: boolean;
    children?: Snippet;
  }>();

  // Font size scale (in rem)
  const fontSizes: Record<TextSize, string> = {
    'xs': '0.75rem',    // 12px
    'sm': '0.875rem',   // 14px
    'base': '1rem',     // 16px
    'lg': '1.125rem',   // 18px
    'xl': '1.25rem',    // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem'       // 48px
  };

  // Font weight scale
  const fontWeights: Record<FontWeight, number> = {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  };

  // Font families
  const fontFamilies: Record<FontFamily, string> = {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: '"Roboto Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    display: '"Plus Jakarta Sans", system-ui, sans-serif',
    icon: '"Material Symbols Outlined"'
  };

  // Line height scale
  const lineHeights: Record<string, string> = {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  };

  // Generate typography CSS variables
  let typographyVars = $state<Record<string, string>>({});

  $effect(() => {
    typographyVars = {
      '--font-size': fontSizes[size as TextSize],
      '--font-weight': fontWeights[weight as FontWeight].toString(),
      '--font-family': isIcon ? fontFamilies.icon : fontFamilies[family as FontFamily],
      '--line-height': lineHeights[lineHeight] || lineHeight,
      '--text-align': align,
      '--color': color,
      '--letter-spacing': letterSpacing || 'normal'
    };
  });
</script>

<div 
  class="typography"
  class:icon={isIcon}
  style="{Object.entries(typographyVars)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')}"
>
  {@render children?.()}
</div>

<style>
  .typography {
    font-size: var(--font-size);
    font-weight: var(--font-weight);
    font-family: var(--font-family);
    line-height: var(--line-height);
    text-align: var(--text-align);
    color: var(--color);
    letter-spacing: var(--letter-spacing);
  }

  .icon {
    font-variation-settings:
      'FILL' 0,
      'wght' var(--font-weight),
      'GRAD' 0,
      'opsz' 24;
    font-feature-settings: 'liga' 1;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Global typography utility classes */
  :global(.text-truncate) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :global(.text-break) {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
  }

  :global(.text-no-wrap) {
    white-space: nowrap;
  }

  :global(.text-uppercase) {
    text-transform: uppercase;
  }

  :global(.text-lowercase) {
    text-transform: lowercase;
  }

  :global(.text-capitalize) {
    text-transform: capitalize;
  }

  /* Responsive text adjustments */
  @media (max-width: 640px) {
    .typography {
      font-size: calc(var(--font-size) * 0.875);
    }
  }
</style>

<!-- Usage Examples:

Regular text:
<Typography size="lg" weight="medium" family="sans">
  Hello World
</Typography>

Material Icon:
<Typography isIcon size="2xl">
  arrow_forward
</Typography>

Display Font:
<Typography family="display" size="4xl" weight="bold">
  Big Title
</Typography>

Monospace:
<Typography family="mono" size="sm">
  console.log('Hello');
</Typography>
--> 
