<!--
@component AvatarImg
A basic avatar image component with size and variant options.
Features:
- Image loading with fallback
- Size variants (xs, sm, md, lg, xl)
- Shape variants (rounded, circular)
- Loading state handling
- Error state with fallback display
- Glass effect integration
- Spatial scaling support
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { AvatarImgProps } from './AvatarImg.types';
  import { AVATAR_SIZES, AVATAR_FONT_SIZES } from './AvatarImg.types';
  import GlassPane from '../../Theme/GlassPane.svelte';
  import Typography from '../../Theme/Typography.svelte';

  // Props
  const props = $props();
  let {
    src,
    alt = '',
    size = 'md',
    variant = 'rounded'
  } = props as AvatarImgProps;

  // State
  let hasError = $state(false);
  let isLoading = $state(true);

  // Handle image load events
  function handleLoad() {
    isLoading = false;
    hasError = false;
  }

  function handleError() {
    isLoading = false;
    hasError = true;
  }

  // Generate initials from alt text if needed
  const initials = $derived(() => {
    if (!alt) return '';
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });
</script>

<GlassPane
  variant="medium"
  attentionState={hasError ? 'error' : 'default'}
  interactive={false}
  elevated={false}
  glowOnHover={true}
  componentType="img"
>
  <div 
    class="avatar"
    class:rounded={variant === 'rounded'}
    class:circular={variant === 'circular'}
    class:loading={isLoading}
    class:error={hasError}
    style:width={AVATAR_SIZES[size]}
    style:height={AVATAR_SIZES[size]}
    role="img"
    aria-label={alt}
  >
    {#if src && !hasError}
      <img
        {src}
        {alt}
        on:load={handleLoad}
        on:error={handleError}
      />
    {:else}
      <Typography
        size={AVATAR_FONT_SIZES[size]}
        weight="medium"
        align="center"
        color="var(--color-text-light)"
      >
        {initials}
      </Typography>
    {/if}

    {#if isLoading}
      <div class="loading-overlay" />
    {/if}
  </div>
</GlassPane>

<style>
  .avatar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .rounded {
    border-radius: var(--radius-lg, 0.5rem);
  }

  .circular {
    border-radius: 50%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      var(--color-surface, #f3f4f6) 25%,
      var(--color-surface-hover, #e5e7eb) 50%,
      var(--color-surface, #f3f4f6) 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .error {
    background-color: var(--color-surface-hover, #e5e7eb);
  }
</style>
