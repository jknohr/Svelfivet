<!--
@component AvatarDisplay
A flexible avatar image component that supports both rounded and circular variants.
Features:
- Rounded and circular variants
- Fallback initials display
- Responsive sizing
- Theme integration
- Loading states
- Error handling
-->
<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import { createElementRunes } from '$lib/components/Theme/ThemeElements';
  import type { ElementType } from '$lib/components/Theme/ThemeElements';
  import Typography from '$lib/components/Theme/Typography.svelte';

  // Props
  interface Props {
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'rounded' | 'circular';
    initials?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
    border?: boolean;
    shadow?: boolean;
  }

  // Size mappings
  const sizes = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px'
  } as const;

  type SizeKey = keyof typeof sizes;
  let {
    src,
    alt = '',
    size = 'md' as SizeKey,
    variant = 'rounded',
    initials,
    status,
    border = false,
    shadow = false
  } = $props();

  // Theme context
  const themeContext = getContext<UnifiedThemeContext>('theme');

  // Create element runes
  const element = createElementRunes('avatar' as ElementType);
  const elementState = element.state.create();

  // State
  let hasError = $state(false);
  let isLoading = $state(true);

  const fontSizes = {
    xs: 'xs',
    sm: 'sm',
    md: 'base',
    lg: 'lg',
    xl: 'xl'
  } as const;

  // Status colors
  const statusColors = {
    online: 'rgb(34, 197, 94)', // green
    offline: 'rgb(156, 163, 175)', // gray
    away: 'rgb(234, 179, 8)', // yellow
    busy: 'rgb(239, 68, 68)' // red
  } as const;

  // Handle image load error
  function handleError() {
    hasError = true;
    isLoading = false;
  }

  // Handle image load success
  function handleLoad() {
    hasError = false;
    isLoading = false;
  }

  // Generate initials from alt text if not provided
  const displayInitials = $derived(() => {
    if (initials) return initials;
    if (!alt) return '';
    return alt
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  // Setup element effects
  $effect(() => {
    if (element.state.derived.hasState) {
      // Update glass effect based on state
      themeContext.glass.updatePane('avatar', {
        opacity: element.state.derived.currentState.hover ? 0.25 : 0.2,
        blur: element.state.derived.currentState.focus ? '15px' : '10px',
        borderOpacity: element.state.derived.currentState.active ? 0.3 : 0.2
      });
    }
  });
</script>

<div
  class="avatar"
  class:rounded={variant === 'rounded'}
  class:circular={variant === 'circular'}
  class:border
  class:shadow
  class:error={hasError}
  class:loading={isLoading}
  style="--avatar-size: {sizes[size]};"
  use:element.effects.setupInteractions
  use:element.effects.setupAccessibility
>
  {#if src && !hasError}
    <img
      {src}
      {alt}
      onload={handleLoad}
      onerror={handleError}
    />
  {:else}
    <div class="initials">
      <Typography
        size={fontSizes[size]}
        weight="medium"
        align="center"
      >
        {displayInitials}
      </Typography>
    </div>
  {/if}

  {#if status}
    <div 
      class="status-indicator"
      style="--status-color: {statusColors[status]};"
      title={status}
    />
  {/if}

  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner" />
    </div>
  {/if}
</div>

<style>
  .avatar {
    position: relative;
    width: var(--avatar-size);
    height: var(--avatar-size);
    background: var(--color-surface, #f8fafc);
    overflow: hidden;
    transition: all var(--transition-normal, 300ms) var(--ease-standard, cubic-bezier(0.4, 0.0, 0.2, 1));
  }

  .rounded {
    border-radius: var(--radius-lg, 0.5rem);
  }

  .circular {
    border-radius: 50%;
  }

  .border {
    border: 2px solid var(--color-border, #e2e8f0);
  }

  .shadow {
    box-shadow: 0 2px 4px var(--color-shadow, rgba(0, 0, 0, 0.1));
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-primary, #3b82f6);
    color: var(--color-surface, #ffffff);
  }

  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 25%;
    height: 25%;
    min-width: 8px;
    min-height: 8px;
    max-width: 12px;
    max-height: 12px;
    border-radius: 50%;
    background-color: var(--status-color);
    border: 2px solid var(--color-surface, #ffffff);
    box-shadow: 0 0 0 1px var(--color-border, #e2e8f0);
  }

  .loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
  }

  .loading-spinner {
    width: 30%;
    height: 30%;
    border: 2px solid var(--color-primary, #3b82f6);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Hover effects */
  .avatar:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px var(--color-shadow, rgba(0, 0, 0, 0.1));
  }

  /* Error state */
  .error .initials {
    background: var(--color-states-error, #ef4444);
  }
</style>
