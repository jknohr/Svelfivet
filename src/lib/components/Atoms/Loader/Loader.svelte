<!--
@component Loader
A simple loading spinner component with theme integration.
Features:
- Multiple sizes with spatial scaling
- Theme-aware variants
- Multiple animation styles (circle, dots)
- Smooth animations
- Full accessibility support
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { LoaderProps } from './Loader.types';
  import { LOADER_SIZES, LOADER_VARIANTS } from './Loader.types';

  // Props
  const props = $props();
  let {
    size = 'md',
    variant = 'primary',
    style = 'circle',
    ariaLabel = 'Loading...'
  } = props as LoaderProps;

  // Computed styles
  function getCircleStyles() {
    const sizeStyles = LOADER_SIZES[size];
    const color = LOADER_VARIANTS[variant];

    return [
      `width: ${sizeStyles.size}`,
      `height: ${sizeStyles.size}`,
      `border-width: ${sizeStyles.border}`,
      `border-color: ${color}`
    ].join(';');
  }

  function getDotsStyles() {
    const sizeStyles = LOADER_SIZES[size];
    const color = LOADER_VARIANTS[variant];

    return [
      `gap: ${sizeStyles.gap}`,
      `--dot-size: ${sizeStyles.dot}`,
      `--dot-color: ${color}`
    ].join(';');
  }
</script>

{#if style === 'circle'}
  <div 
    class="loader-circle"
    role="status"
    aria-label={ariaLabel}
    style={getCircleStyles()}
  ></div>
{:else}
  <div 
    class="loader-dots"
    role="status"
    aria-label={ariaLabel}
    style={getDotsStyles()}
  >
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
{/if}

<style>
  /* Circle loader styles */
  .loader-circle {
    display: inline-block;
    border-style: solid;
    border-bottom-color: transparent !important;
    border-radius: 50%;
    animation: spin var(--transition-normal) linear infinite;
    vertical-align: middle;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Dots loader styles */
  .loader-dots {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }

  .dot {
    width: var(--dot-size);
    height: var(--dot-size);
    background-color: var(--dot-color);
    border-radius: 50%;
    animation: bounce var(--transition-slow) infinite;
  }

  .dot:nth-child(2) {
    animation-delay: calc(var(--transition-normal) / 3);
  }

  .dot:nth-child(3) {
    animation-delay: calc(var(--transition-normal) / 1.5);
  }

  @keyframes bounce {
    0%, 80%, 100% { 
      transform: translateY(0);
      opacity: 0.3;
    }
    40% { 
      transform: translateY(-25%);
      opacity: 1;
    }
  }

  /* Spatial adjustments */
  @media (--ar) {
    .loader-circle,
    .loader-dots {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-floating));
    }
  }

  @media (--vr) {
    .loader-circle,
    .loader-dots {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }
  }
</style> 
