<!-- /src/lib/components/NotificationToast.svelte -->
<!--
@component NotificationToast
A modern notification toast component with glass effect styling and theme integration.
Features:
- Different types (info, success, warning, error)
- Auto-dismiss with configurable duration
- Glass effect styling with hover states
- Position control (top-left, top-right, bottom-left, bottom-right)
- Multiple sizes with responsive design
- Theme system integration
- Accessibility support
- Animated entrance and exit
-->

<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import type { NotificationToastProps } from './Notification.types';
  import { NOTIFICATION_SIZE_STYLES, NOTIFICATION_POSITION_STYLES } from './Notification.types';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import { createElementRunes } from '$lib/components/Theme/ThemeElements';
  import type { ElementType } from '$lib/components/Theme/ThemeElements';
  import type { NotificationPosition, NotificationSize, NotificationType, NotificationPositionStyle } from './Notification.types';

  // Props
  const {
    type = 'info',
    message,
    duration = 3000,
    dismissible = true,
    position = 'top-right',
    size = 'md',
    variant = 'light',
    state: notificationState = 'default',
    glowOnHover = true,
    onDismiss
  } = $props();

  // Theme context
  const themeContext = getContext<UnifiedThemeContext>('theme');

  // State
  let isVisible = $state(true);
  let isHovered = $state(false);
  let isFocused = $state(false);

  // Create element runes
  const element = createElementRunes('notification' as ElementType);
  const elementState = element.state.create();

  // Get styles from constants
  let sizeStyles = $derived.by(() => NOTIFICATION_SIZE_STYLES[size as keyof typeof NOTIFICATION_SIZE_STYLES]);
  let positionStyles = $derived.by(() => NOTIFICATION_POSITION_STYLES[position as keyof typeof NOTIFICATION_POSITION_STYLES]);

  // Create a style object for positioning
  let positionStyleString = $derived.by(() => {
    const styles: string[] = [];
    const pos = positionStyles as NotificationPositionStyle;
    if (pos.top) styles.push(`top: ${pos.top}`);
    if (pos.right) styles.push(`right: ${pos.right}`);
    if (pos.bottom) styles.push(`bottom: ${pos.bottom}`);
    if (pos.left) styles.push(`left: ${pos.left}`);
    return styles.join(';');
  });

  // Compute current glass state
  const currentGlassState = $derived.by(() => {
    if (notificationState !== 'default') return notificationState;
    return type === 'error' ? 'error' : 
           type === 'success' ? 'success' : 
           type === 'warning' ? 'attention' : 
           'default';
  });

  // Auto-dismiss timer
  let dismissTimer: ReturnType<typeof setTimeout>;

  // Setup auto-dismiss
  $effect(() => {
    if (isVisible && !isHovered && duration > 0) {
      dismissTimer = setTimeout(handleDismiss, duration);
      return () => clearTimeout(dismissTimer);
    }
  });

  // Event Handlers
  function handleDismiss() {
    isVisible = false;
    onDismiss?.();
  }

  function handleMouseEnter() {
    isHovered = true;
    if (dismissTimer) {
      clearTimeout(dismissTimer);
    }
  }

  function handleMouseLeave() {
    isHovered = false;
    if (duration > 0) {
      dismissTimer = setTimeout(handleDismiss, duration);
    }
  }

  // Generate unique ID
  const id = `toast-${Math.random().toString(36).slice(2, 11)}`;

  // Map notification size to Typography size
  let typographySize = $derived.by(() => {
    switch (size) {
      case 'sm': return 'sm' as const;
      case 'md': return 'base' as const;
      case 'lg': return 'lg' as const;
      default: return 'base' as const;
    }
  });
</script>

{#snippet notificationIcon()}
  <Typography family="icon" size={typographySize}>
    {#if type === 'info'}info{/if}
    {#if type === 'success'}check_circle{/if}
    {#if type === 'warning'}warning{/if}
    {#if type === 'error'}error{/if}
  </Typography>
{/snippet}

{#if isVisible}
  <div
    {id}
    class="notification-toast"
    style="{positionStyleString}; font-size: {sizeStyles.fontSize}; max-width: {sizeStyles.maxWidth}; padding: {sizeStyles.padding};"
    class:hovered={isHovered}
    class:focused={isFocused}
    role="alert"
    aria-live="polite"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
  >
    <GlassPane
      {variant}
      state={currentGlassState}
      interactive={dismissible}
      {glowOnHover}
      componentType="notification"
    >
      <div class="toast-content">
        <div class="toast-icon">
          {@render notificationIcon()}
        </div>
        
        <div class="toast-message">
          <Typography size={typographySize}>
            {message}
          </Typography>
        </div>

        {#if dismissible}
          <button
            class="toast-dismiss"
            aria-label="Dismiss notification"
            onclick={handleDismiss}
          >
            <Typography family="icon" size={typographySize}>
              close
            </Typography>
          </button>
        {/if}
      </div>
    </GlassPane>
  </div>
{/if}

<style>
  .notification-toast {
    position: fixed;
    z-index: var(--ui-layer-toast, 9000);
    top: var(--toast-top);
    right: var(--toast-right);
    bottom: var(--toast-bottom);
    left: var(--toast-left);
    max-width: var(--toast-max-width);
    animation: toast-enter 300ms var(--ease-standard);
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: var(--ui-space-2);
    padding: var(--toast-padding);
  }

  .toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }

  .toast-message {
    flex: 1;
    min-width: 0;
  }

  .toast-dismiss {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--ui-space-1);
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  .toast-dismiss:hover {
    color: var(--color-text);
  }

  /* Animation keyframes */
  @keyframes toast-enter {
    from {
      opacity: 0;
      transform: translateY(-1rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Spatial adjustments */
  @media (--ar) {
    .notification-toast {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-floating));
    }
  }

  @media (--vr) {
    .notification-toast {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }
  }
</style>