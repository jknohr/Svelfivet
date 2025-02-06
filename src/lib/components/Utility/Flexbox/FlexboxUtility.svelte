<!--
@component
A powerful flexbox utility component that provides advanced layout capabilities with theme integration
and spatial awareness.

Features:
- Full flexbox control with intuitive props
- Spatial awareness for AR/VR environments
- Theme system integration
- Responsive breakpoints
- Animation and transition support
- Nested flex context management

@example
```svelte
<FlexboxUtility
  direction="row"
  wrap="wrap"
  justifyContent="space-between"
  alignItems="center"
  gap="1rem"
>
  {#snippet children()}
    <div class="flex-item">Content</div>
  {/snippet}
</FlexboxUtility>
```
-->

<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import type { 
    UnifiedThemeContext,
    SpatialEnvironment 
  } from '$lib/components/Theme/Theme.types';
  import type { ScaleContext } from '$lib/types/spatial';
  import type {
    FlexboxUtilityProps,
    FlexItemConfig,
    FlexContext,
    FlexLayoutChangeEvent
  } from './FlexboxUtility.types';

  // Props using Svelte 5 runes
  let props = $props();
  let {
    // Layout configuration
    direction = 'row',
    wrap = 'nowrap',
    justifyContent = 'start',
    alignItems = 'stretch',
    alignContent = 'stretch',
    gap = '0',
    rowGap,
    columnGap,

    // Spatial and environment
    environment = 'desktop',
    spatial = {},

    // Responsive behavior
    responsive = true,
    breakpoints = {},

    // Animation and transitions
    animation = {},

    // Item configuration
    items = [],
    defaultItemConfig = {},

    // Content and events
    children,
    onLayoutChange,
    onItemClick,

    // Accessibility
    aria = {},
    keyboard = { focusable: true },
    gestures = {},
    mouse = {}
  } = props satisfies FlexboxUtilityProps;

  // Theme and scale context
  const theme = getContext<UnifiedThemeContext>('theme');
  const scale = getContext<ScaleContext>('spatial-scale');
  const parentFlex = getContext<FlexContext | undefined>('flex-context');

  // State management using Svelte 5 runes
  let containerRef: HTMLElement | null = null;
  let containerWidth = $state(0);
  let containerHeight = $state(0);
  let currentBreakpoint = $state<string | null>(null);
  let registeredItems = $state<FlexItemConfig[]>([]);
  let isTransitioning = $state(false);

  // Reactive values using derived
  const effectiveScale = $derived(scale.factor);
  const currentEnvironment = $derived(environment as SpatialEnvironment);

  // Calculate effective gap sizes
  const gapSizes = $derived(() => {
    const baseGap = theme.utils.getCSSVariable(gap.toString());
    const rowGapValue = rowGap ? theme.utils.getCSSVariable(rowGap.toString()) : baseGap;
    const columnGapValue = columnGap ? theme.utils.getCSSVariable(columnGap.toString()) : baseGap;

    return {
      row: parseFloat(rowGapValue) * effectiveScale,
      column: parseFloat(columnGapValue) * effectiveScale
    };
  });

  // Handle responsive breakpoints
  function updateBreakpoint() {
    if (!responsive || !containerWidth) return;

    const breakpointEntries = Object.entries(breakpoints)
      .map(([key, value]) => ({ key, width: parseInt(key) }))
      .sort((a, b) => b.width - a.width);

    const newBreakpoint = breakpointEntries.find(bp => containerWidth <= bp.width)?.key || null;

    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint;
      const config = breakpoints[newBreakpoint || ''];
      if (config) {
        // Apply breakpoint configuration
        Object.assign(props, config);
      }
    }
  }

  // Create flex context for nested components
  const flexContext: FlexContext = {
    parentConfig: props,
    depth: (parentFlex?.depth ?? 0) + 1,
    registerItem: (config: FlexItemConfig) => {
      registeredItems = [...registeredItems, config];
    },
    unregisterItem: (config: FlexItemConfig) => {
      registeredItems = registeredItems.filter(item => item !== config);
    }
  };

  setContext('flex-context', flexContext);

  // Handle container resizing
  $effect(() => {
    if (!containerRef) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        containerWidth = width;
        containerHeight = height;
        
        updateBreakpoint();
        
        // Notify layout changes
        onLayoutChange?.({
          layout: {
            width,
            height,
            itemCount: registeredItems.length,
            direction,
            wrap
          },
          breakpoint: currentBreakpoint
        });
      }
    });

    observer.observe(containerRef);
    return () => observer.disconnect();
  });

  // Compute spatial transforms
  const spatialTransform = $derived(() => {
    if (currentEnvironment === 'desktop') return '';

    const {
      depth = 0,
      perspective = 1000,
      rotateX = 0,
      rotateY = 0,
      rotateZ = 0,
      scale = 1
    } = spatial;

    return `
      perspective(${perspective}px)
      translateZ(${depth}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      rotateZ(${rotateZ}deg)
      scale(${scale * effectiveScale})
    `;
  });

  // Handle item click events
  function handleItemClick(item: FlexItemConfig, index: number, event: MouseEvent) {
    if (!mouse.clickable) return;
    
    onItemClick?.({
      item,
      index,
      element: event.currentTarget as HTMLElement,
      event
    });
  }

  // Handle keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    if (!keyboard.focusable) return;
    if (keyboard.shortcuts?.[event.key]) {
      keyboard.shortcuts[event.key]();
    }
  }

  // Compute dynamic styles
  // Get effective depth value from theme or numeric value
  const effectiveDepth = $derived(() => {
    const themeConfig = theme.utils.getComputedTheme();
    if (typeof spatial.depth === 'string' && themeConfig.spatial?.depth) {
      const depthKey = spatial.depth as keyof typeof themeConfig.spatial.depth;
      return themeConfig.spatial.depth[depthKey] ?? 0;
    }
    if (spatial.snapToDepth && typeof spatial.depth === 'number' && themeConfig.spatial?.depth) {
      // Find closest depth level
      const depthLevels = Object.values(themeConfig.spatial.depth);
      const closestDepth = depthLevels.reduce((prev, curr) => 
        Math.abs(curr - spatial.depth) < Math.abs(prev - spatial.depth) ? curr : prev
      );
      return closestDepth;
    }
    return spatial.depth || 0;
  });

  const styles = $derived(() => {
    const transitionConfig = theme.utils.getComputedTheme().transitionConfig;
    const { row, column } = gapSizes();
    
    return {
      display: 'flex',
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent,
      alignItems,
      alignContent,
      gap: `${row}px ${column}px`,
      transform: spatialTransform,
      transition: isTransitioning ? `all ${transitionConfig.durationValues.normal} ${transitionConfig.easingValues.standard}` : '',
      '--flex-depth': effectiveDepth,
      '--flex-scale': effectiveScale
    };
  });
</script>

<div
  class="flexbox-utility"
  class:responsive
  class:transitioning={isTransitioning}
  data-environment={currentEnvironment}
  data-breakpoint={currentBreakpoint}
  style={Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';')}
  bind:this={containerRef}
  role={keyboard.focusable ? 'application' : 'group'}
  aria-label={aria.label}
  onkeydown={keyboard.focusable ? handleKeyDown : undefined}
>
  {@render children?.()}
</div>

<style>
  .flexbox-utility {
    position: relative;
    box-sizing: border-box;
    transform-style: preserve-3d;
    contain: layout style;
  }

  .flexbox-utility[data-environment='ar'],
  .flexbox-utility[data-environment='vr'] {
    transform-style: preserve-3d;
    perspective-origin: center center;
  }

  .flexbox-utility.responsive {
    width: 100%;
    height: 100%;
  }

  .flexbox-utility.transitioning {
    will-change: transform, gap;
  }

  /* Theme integration classes */
  :global(.flexbox-utility > *) {
    transform: scale(var(--flex-scale, 1));
    transition: inherit;
  }
</style> 
