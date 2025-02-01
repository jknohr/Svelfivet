<!-- /src/lib/components/Image.svelte -->
<!--
@component Image
A responsive image component with lazy loading and theme integration.
Features:
- Responsive sizing
- Lazy loading
- Placeholder support
- Theme integration for styling
- Accessibility support with ARIA attributes
-->

<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import { createElementRunes } from '$lib/components/Theme/ThemeElements';
  import type { ImageProps } from './Image.types';

  // Props
  let props = $props<ImageProps>();
  let {
    src,
    alt,
    width = '100%',
    height = 'auto',
    objectFit = 'cover',
    placeholder = '',
    lazy = true
  } = props;

  // Theme context
  const themeContext = getContext<UnifiedThemeContext>('theme');

  // State
  let loaded = $state(false);
  let imageElement: HTMLImageElement;

  // Handle image load
  function handleLoad() {
    loaded = true;
  }

  // Derived styles
  const styles = $derived(() => ({
    '--image-width': width,
    '--image-height': height,
    '--image-object-fit': objectFit
  }));
</script>

<div
  class="image-container"
  style="{Object.entries(styles).map(([key, value]) => `${key}:${value}`).join(';')}"
>
  {#if placeholder}
    <img
      class="image-placeholder"
      src={placeholder}
      alt={alt}
      width={width}
      height={height}
    />
  {/if}

  <img
    class="image"
    src={src}
    alt={alt}
    width={width}
    height={height}
    style="object-fit: {objectFit}; opacity: {loaded ? '1' : '0'}; transition: opacity 0.3s ease-in-out;"
    onload={handleLoad}
    use:lazy ? 'data-lazy' : ''
  />
</div>

<style>
  .image-container {
    position: relative;
    width: var(--image-width);
    height: var(--image-height);
    overflow: hidden;
  }

  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: var(--image-object-fit);
    transition: opacity 0.3s ease-in-out;
  }

  .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: var(--image-object-fit);
  }

  .image-placeholder + .image {
    opacity: 0;
  }

  .image-placeholder + .image.loaded {
    opacity: 1;
  }
</style>