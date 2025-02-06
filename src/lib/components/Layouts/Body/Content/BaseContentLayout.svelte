<svelte:options runes={true} />

<script lang="ts">

  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import type { LayoutAccessibility } from '../../types';
  import { defaultAccessibility } from '../../types';
  import { BASE, SPACE_3D } from '$lib/components/Theme/SpatialDesign';
  import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';
  import type { Snippet } from 'svelte';

  interface $$Props {
    accessibility?: LayoutAccessibility;
    spatialConfig?: typeof BASE | typeof SPACE_3D;
    mainContent?: Snippet;
    leftComponent?: Snippet;
    rightComponent?: Snippet;
    dimensions?: {
      headerHeight?: string;
      footerHeight?: string;
      leftSidebarWidth?: string;
      rightSidebarWidth?: string;
      mainContentWidth?: string;
      expandedHeaderHeight?: string;
      expandedSidebarWidth?: string;
    };
    filters?: Record<string, any>;
    children?: Snippet;
  }

  // Props with defaults using $props
  let { 
    accessibility = defaultAccessibility,
    spatialConfig = BASE,
    mainContent,
    leftComponent = () => undefined,
    rightComponent = () => undefined,
    dimensions = {
      headerHeight: '60px',
      footerHeight: '60px',
      leftSidebarWidth: '250px',
      rightSidebarWidth: '250px',
      mainContentWidth: 'auto',
      expandedHeaderHeight: '120px',
      expandedSidebarWidth: '300px'
    },
    filters = {},
    children
  } = $props();

  // Default immutable states
  const defaultAccessibilityState = $state.raw(defaultAccessibility);
  const defaultSpatialConfig = $state.raw(BASE);

  // Use defaults if props are not provided
  const currentAccessibility = $derived(accessibility ?? defaultAccessibilityState);
  const currentSpatialConfig = $derived(spatialConfig ?? defaultSpatialConfig);

  // Theme
  const theme = createThemeComposition();

  // Reactive state and derived values
  let contentElement = $state<HTMLElement | null>(null);
  let scrollProgress = $derived(
    contentElement ? 
      (contentElement.scrollTop / (contentElement.scrollHeight - contentElement.clientHeight)) * 100 
      : 0
  );

  // Effect to handle scroll updates
  $effect(() => {
    if (!contentElement) return;
    
    const updateScroll = () => {
      // The scroll event will trigger a recalculation of scrollProgress via the $derived
      contentElement?.dispatchEvent(new Event('scroll'));
    };

    contentElement.addEventListener('scroll', updateScroll);
    return () => contentElement?.removeEventListener('scroll', updateScroll);
  });
</script>

<UIScalingLayout {currentSpatialConfig}>
  <div
    style:--left-sidebar-width={dimensions?.leftSidebarWidth ?? '0%'}
    style:--right-sidebar-width={dimensions?.rightSidebarWidth ?? '0%'}
  >
    <GlassPane
      class="content-container"
      role={currentAccessibility.aria.role || 'main'}
      aria-label={currentAccessibility.aria.label || 'Main content area'}
      data-theme={theme.state.mode}
    >
    {#if leftComponent}
      <div class="sidebar left-sidebar">
        {@render leftComponent()}
      </div>
    {/if}
    
    <div 
      bind:this={contentElement}
      class="content-main"
    >
      {@render mainContent()}
      {#if children}
        {@render children()}
      {/if}
    </div>

    {#if rightComponent}
      <div class="sidebar right-sidebar">
        {@render rightComponent()}
      </div>
    {/if}
    </GlassPane>
  </div>
</UIScalingLayout>

<style>
  :global(.content-container) {
    display: flex;
    flex-direction: row;
    height: 100%;
    background: var(--surface-background);
    border-radius: var(--radius-lg);
    overflow: hidden;
    position: relative;
  }

  .content-main {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  .sidebar {
    height: 100%;
    overflow-y: auto;
    padding: var(--spacing-md);
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  .left-sidebar {
    width: var(--left-sidebar-width, 0%);
    border-right: 1px solid var(--border-color);
  }

  .right-sidebar {
    width: var(--right-sidebar-width, 0%);
    border-left: 1px solid var(--border-color);
  }

  @media (prefers-reduced-motion: reduce) {
    .content-main, .sidebar {
      scroll-behavior: auto;
    }
  }

  @media (forced-colors: active) {
    :global(.content-container) {
      border: 1px solid CanvasText;
    }
  }
</style>
