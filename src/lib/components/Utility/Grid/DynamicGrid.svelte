<!-- /src/lib/components/DynamicGrid.svelte -->
<!--
@component
A smart, flexible, responsive, and dynamic grid system that adapts to the theme and environment.

Features:
- Responsive behavior based on viewport and device
- Golden ratio based grid calculations
- Adaptive spacing and sizing
- Support for different grid templates
- Integration with UIScalingLayout system
- AR/VR spatial awareness
- Lazy loading and virtualization

@example
```svelte
<DynamicGrid
  items={gridItems}
  density="comfortable"
  mode="auto"
  environment={currentEnvironment}
>
  {#snippet item(gridItem)}
    <div class="item-content">
      {gridItem.content}
    </div>
  {/snippet}
</DynamicGrid>
```

@integration Theme System
- Uses theme's spatial scaling system
- Adapts to theme's density settings
- Follows theme's golden ratio proportions
- Supports theme's environment contexts
-->

<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import { generateId } from '$lib/utils/id';
  import type { 
    UnifiedThemeContext, 
    ScaleContext, 
    SpatialConfig,
    SpatialConstraints,
    SpatialEnvironment,
    BaseElementRequirements
  } from '$lib/components/Theme/Theme.types';
  import { BASE, SPACE_3D } from '$lib/components/Theme/SpatialDesign';
  import type { 
    DynamicGridProps, 
    GridItem, 
    VirtualListState, 
    GridLayout,
    GridMode,
    GridDensity 
  } from './DynamicGrid.types';
  import { createVirtualList } from './virtuallist';
  import { optimizeRenders } from './renderOptimization';

  // Props using Svelte 5 runes with proper typing
  let props = $props();
  let { 
    items = [],
    templateColumns = 'auto',
    templateRows = 'auto',
    gap = '1rem',
    density = 'comfortable',
    environment = 'desktop',
    spatialAnchor,
    mode = 'auto',
    minItemWidth = '200px',
    maxItemWidth = '400px',
    minItemHeight,
    maxItemHeight,
    fixedColumns,
    fixedRows,
    nested = false,
    lazy = false,
    virtualization,
    onItemClick,
    children,
    // Add accessibility and interaction props
    ariaLabel = 'Dynamic Grid',
    ariaDescription,
    focusable = true,
    keyboardNavigation = true,
    gestures = true,
    mouseInteraction = true
  } = props satisfies DynamicGridProps;

  // Theme and scale context
  const theme = getContext<UnifiedThemeContext>('theme');
  const scale = getContext<ScaleContext>('spatial-scale');
  const parentGrid = getContext<GridLayout | null>('parent-grid');

  // State management using Svelte 5 runes
  let containerWidth = $state(0);
  let containerHeight = $state(0);
  let containerRef: HTMLElement | null = null;
  let virtualState = $state<VirtualListState | null>(null);
  let gridLayout = $state<GridLayout | null>(null);
  let isTransitioning = $state(false);
  let resizeTimeout = $state<number | null>(null);
  let previousLayout = $state<GridLayout | null>(null);
  let resizeObserver: ResizeObserver;
  let focusedItemIndex = $state(-1);
  let interactionState = $state<BaseElementRequirements['states']>({
    default: true,
    hover: false,
    active: false,
    focus: false,
    disabled: false,
    loading: false,
    error: false,
    success: false
  });

  // Reactive state using derived values
  const effectiveScale = $derived(scale.scale);
  const currentDensity = $derived(density as GridDensity);
  const currentEnvironment = $derived(environment as SpatialEnvironment);
  const baseUnit = $derived(scale.baseUnit);

  // Get spatial configuration from theme
  const spatialConfig = $derived(() => {
    const config = theme.utils.getComputedTheme().spatial as SpatialConfig;
    return {
      phi: config?.ratios?.phi || 1.618033988749895,
      baseUnit: config?.base?.unit || 8,
      constraints: config?.constraints || {}
    };
  });

  // Density multipliers based on theme's golden ratio
  const densityScales = $derived(() => {
    const phi = spatialConfig().phi;
    return {
      compact: 1 / phi,
      comfortable: 1,
      spacious: phi
    } satisfies Record<GridDensity, number>;
  });

  // Get current environment constraints
  const spatialConstraints = $derived(() => {
    const constraints = spatialConfig().constraints;
    return constraints[currentEnvironment] || null;
  });

  // Calculate optimal number of columns based on container width and content
  function calculateOptimalColumns(width: number): number {
    if (fixedColumns) return fixedColumns;
    
    const minWidth = parseFloat(theme.utils.getCSSVariable(minItemWidth) || minItemWidth);
    const scaledMinWidth = minWidth * effectiveScale;
    const phi = spatialConfig().phi;
    
    // Apply spatial constraints if available
    const constraints = spatialConstraints();
    if (constraints) {
      const constrainedWidth = Math.min(
        Math.max(scaledMinWidth * (constraints.minScale || 0.5), width),
        scaledMinWidth * (constraints.maxScale || 2.0)
      );
      width = constrainedWidth;
    }
    
    if (mode === 'auto') {
      // Auto mode uses golden ratio for optimal sizing
      const baseColumns = Math.floor(width / (scaledMinWidth * phi));
      return Math.max(1, Math.min(baseColumns, items.length));
    } else if (mode === 'masonry') {
      // Masonry mode tries to maintain square-ish items
      return Math.max(2, Math.floor(width / scaledMinWidth));
    }
    
    // Fixed mode uses the specified columns or defaults to auto-fit
    return Math.floor(width / scaledMinWidth);
  }

  // Calculate optimal number of rows based on layout and content
  function calculateOptimalRows(columns: number): number {
    if (fixedRows) return fixedRows;
    
    if (mode === 'masonry') {
      // Masonry mode has variable height rows
      return Math.ceil(items.length / columns);
    }
    
    const minHeight = minItemHeight ? 
      parseFloat(theme.utils.getCSSVariable(minItemHeight) || minItemHeight) : 
      parseFloat(minItemWidth) / spatialConfig().phi;
    
    if (mode === 'auto') {
      // Auto mode tries to maintain golden ratio
      const idealRows = Math.ceil(items.length / columns);
      const heightRatio = containerHeight / (minHeight * idealRows);
      return Math.max(1, Math.round(idealRows * heightRatio));
    }
    
    // Fixed mode uses explicit rows or calculates based on content
    return Math.ceil(items.length / columns);
  }

  // Calculate item size with proper golden ratio proportions
  function calculateItemSize(columns: number, rows: number) {
    const phi = spatialConfig().phi;
    const availableWidth = containerWidth - (columns - 1) * gap;
    const itemWidth = availableWidth / columns;
    let itemHeight: number;

    const minHeight = minItemHeight ? 
      parseFloat(theme.utils.getCSSVariable(minItemHeight) || minItemHeight) : 
      parseFloat(minItemWidth) / phi;
    
    if (mode === 'auto') {
      // Auto mode uses golden ratio for height
      itemHeight = itemWidth / phi;
    } else if (mode === 'masonry') {
      // Masonry mode allows variable heights
      itemHeight = minHeight;
    } else {
      // Fixed mode uses specified height or golden ratio
      itemHeight = minItemHeight ? 
        parseFloat(theme.utils.getCSSVariable(minItemHeight) || minItemHeight) :
        itemWidth / phi;
    }

    return { width: itemWidth, height: itemHeight };
  }

  // Calculate grid layout with proper typing
  function calculateGridLayout(): GridLayout {
    const columns = calculateOptimalColumns(containerWidth);
    const rows = calculateOptimalRows(columns);
    const { width: itemWidth, height: itemHeight } = calculateItemSize(columns, rows);
    
    // Calculate effective gap using type-safe density access and theme scaling
    const baseGap = parseFloat(theme.utils.getCSSVariable(gap) || gap.toString());
    const scaledGap = baseGap * effectiveScale * densityScales()[currentDensity];

    const layout: GridLayout = {
      columns,
      rows,
      itemWidth,
      itemHeight,
      gap: scaledGap,
      mode: mode as GridMode,
      containerWidth,
      containerHeight
    };

    // Provide layout context for nested grids
    setContext('parent-grid', layout);

    return layout;
  }

  // Handle container resizing with cleanup
  $effect(() => {
    if (!containerRef) return;

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        containerWidth = width;
        containerHeight = height;
      }
    });

    resizeObserver.observe(containerRef);

    return () => resizeObserver.disconnect();
  });

  // Handle smooth transitions between layouts
  function handleLayoutTransition(newLayout: GridLayout) {
    if (!previousLayout) {
      previousLayout = newLayout;
      return newLayout;
    }

    const transitionConfig = theme.utils.getComputedTheme().transitions;
    const hasSignificantChange = 
      Math.abs(previousLayout.columns - newLayout.columns) > 0 ||
      Math.abs(previousLayout.rows - newLayout.rows) > 0 ||
      Math.abs(previousLayout.itemWidth - newLayout.itemWidth) > 10 ||
      Math.abs(previousLayout.itemHeight - newLayout.itemHeight) > 10;

    if (hasSignificantChange) {
      isTransitioning = true;
      previousLayout = newLayout;
      
      setTimeout(() => {
        isTransitioning = false;
      }, parseInt(transitionConfig.duration.normal));
    }

    return newLayout;
  }

  // Computed styles using derived values
  const styles = $derived(() => {
    const layout = handleLayoutTransition(calculateGridLayout());
    gridLayout = layout;

    const gridTemplate = mode === 'masonry' 
      ? {
          'grid-template-columns': `repeat(${layout.columns}, ${layout.itemWidth}px)`,
          'grid-auto-rows': 'auto'
        }
      : {
          'grid-template-columns': `repeat(${layout.columns}, ${layout.itemWidth}px)`,
          'grid-template-rows': `repeat(${layout.rows}, ${layout.itemHeight}px)`
        };

    return {
      ...gridTemplate,
      'gap': `${layout.gap}px`,
      'padding': nested ? '0' : theme.utils.getCSSVariable('1rem'),
      '--item-width': `${layout.itemWidth}px`,
      '--item-height': `${layout.itemHeight}px`,
      '--grid-scale': effectiveScale.toString(),
      '--transition-state': isTransitioning ? 'transitioning' : 'stable'
    };
  });

  // Update virtualization when items or layout changes
  $effect(() => {
    if (items.length && virtualization?.enabled && gridLayout) {
      updateVirtualization();
    }
  });

  // Handle window resize with debouncing
  $effect(() => {
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = window.setTimeout(() => {
        if (!containerRef) return;
        const { width, height } = containerRef.getBoundingClientRect();
        containerWidth = width;
        containerHeight = height;
        
        if (virtualization?.enabled) {
          updateVirtualization();
        }
        
        resizeTimeout = null;
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Initialize virtualization if enabled
  function updateVirtualization() {
    if (!virtualization?.enabled || !items.length || !gridLayout) {
      virtualState = null;
      return;
    }

    const itemHeight = gridLayout.itemHeight + gridLayout.gap;
    virtualState = {
      visibleItems: items.slice(0, gridLayout.columns * 3), // Initial viewport
      scrollTop: 0,
      viewportHeight: containerHeight,
      totalHeight: Math.ceil(items.length / gridLayout.columns) * itemHeight
    };
  }

  // Handle scroll for virtualization
  function handleScroll(event: Event) {
    if (!virtualization?.enabled || !gridLayout) return;
    
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const itemHeight = gridLayout.itemHeight + gridLayout.gap;
    const visibleRows = Math.ceil(containerHeight / itemHeight);
    const overscan = virtualization.overscan || 1;
    
    const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endRow = Math.min(
      Math.ceil(items.length / gridLayout.columns),
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const startIndex = startRow * gridLayout.columns;
    const endIndex = Math.min(items.length, endRow * gridLayout.columns);

    virtualState = {
      ...virtualState!,
      visibleItems: items.slice(startIndex, endIndex),
      scrollTop
    };
  }

  // Generate unique ID for accessibility
  const gridId = generateId();

  // Handle item click with proper event typing
  function handleItemClick(item: GridItem, index: number, event: MouseEvent | KeyboardEvent) {
    const syntheticEvent = event instanceof KeyboardEvent ? 
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }) : event;
    
    onItemClick?.({ item, index, event: syntheticEvent });
  }

  // Enhanced keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    if (!keyboardNavigation || !gridLayout) return;

    const { key } = event;
    const { columns } = gridLayout;
    const itemCount = items.length;

    let newIndex = focusedItemIndex;

    switch (key) {
      case 'ArrowRight':
        newIndex = Math.min(focusedItemIndex + 1, itemCount - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(focusedItemIndex - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(focusedItemIndex + columns, itemCount - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(focusedItemIndex - columns, 0);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = itemCount - 1;
        break;
      case 'Enter':
      case ' ':
        if (focusedItemIndex >= 0) {
          const item = items[focusedItemIndex];
          handleItemClick(item, focusedItemIndex, event);
        }
        break;
      default:
        return;
    }

    if (newIndex !== focusedItemIndex) {
      event.preventDefault();
      focusedItemIndex = newIndex;
      scrollToItem(newIndex);
    }
  }

  // Scroll item into view
  function scrollToItem(index: number) {
    if (!gridLayout || !containerRef) return;

    const { itemHeight, columns, gap } = gridLayout;
    const row = Math.floor(index / columns);
    const scrollTop = row * (itemHeight + gap);

    if (virtualization?.enabled) {
      containerRef.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }

  // Enhanced item interaction handling
  function handleItemInteraction(item: GridItem, index: number, event: Event) {
    if (event instanceof MouseEvent) {
      handleItemClick(item, index, event);
    } else if (event instanceof KeyboardEvent && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleItemClick(item, index, event);
    }
    focusedItemIndex = index;
    interactionState = { ...interactionState, focus: true };
  }

  // Gesture handling for touch devices
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(event: TouchEvent) {
    if (!gestures) return;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event: TouchEvent) {
    if (!gestures || !gridLayout) return;
    
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;

    // Handle swipe gestures
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      event.preventDefault();
      containerRef?.scrollBy(0, -deltaY);
    }
  }
</script>

<div
  class="dynamic-grid"
  class:virtual={virtualization?.enabled}
  class:nested={nested}
  class:compact={currentDensity === 'compact'}
  class:spacious={currentDensity === 'spacious'}
  class:masonry={mode === 'masonry'}
  class:transitioning={isTransitioning}
  class:focused={interactionState.focus}
  class:loading={interactionState.loading}
  class:error={interactionState.error}
  class:success={interactionState.success}
  style={Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';')}
  role="grid"
  aria-label={ariaLabel}
  aria-describedby={ariaDescription ? `grid-desc-${gridId}` : undefined}
  aria-rowcount={gridLayout?.rows ?? 0}
  aria-colcount={gridLayout?.columns ?? 0}
  bind:this={containerRef}
  onscroll={virtualization?.enabled ? handleScroll : undefined}
  onkeydown={handleKeyDown}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  data-environment={currentEnvironment}
  tabindex={focusable ? 0 : -1}
>
  {#if ariaDescription}
    <div id="grid-desc-{gridId}" class="sr-only">{ariaDescription}</div>
  {/if}

  {#if virtualization?.enabled && virtualState}
    <div 
      class="virtual-container"
      style:height="{virtualState.totalHeight}px"
    >
      <div
        class="virtual-items"
        style:transform="translateY({virtualState.scrollTop}px)"
      >
        {#each virtualState.visibleItems as item, index (item.id)}
          <div
            class="grid-item"
            class:focused={index === focusedItemIndex}
            role="gridcell"
            aria-rowindex={Math.floor(index / (gridLayout?.columns ?? 1)) + 1}
            aria-colindex={(index % (gridLayout?.columns ?? 1)) + 1}
            aria-selected={index === focusedItemIndex}
            tabindex={focusable ? 0 : -1}
            onclick={(e) => handleItemInteraction(item, index, e)}
            onkeydown={(e) => handleItemInteraction(item, index, e)}
            style:width="var(--item-width)"
            style:height={mode === 'masonry' ? 'auto' : 'var(--item-height)'}
          >
            {@render children?.(item)}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    {#each items as item, index (item.id)}
      <div
        class="grid-item"
        class:focused={index === focusedItemIndex}
        role="gridcell"
        aria-rowindex={Math.floor(index / (gridLayout?.columns ?? 1)) + 1}
        aria-colindex={(index % (gridLayout?.columns ?? 1)) + 1}
        aria-selected={index === focusedItemIndex}
        tabindex={focusable ? 0 : -1}
        onclick={(e) => handleItemInteraction(item, index, e)}
        onkeydown={(e) => handleItemInteraction(item, index, e)}
        style:width="var(--item-width)"
        style:height={mode === 'masonry' ? 'auto' : 'var(--item-height)'}
      >
        {@render children?.(item)}
      </div>
    {/each}
  {/if}
</div>

<style>
  .dynamic-grid {
    display: grid;
    width: 100%;
    box-sizing: border-box;
    transition: all var(--transition-normal) var(--ease-standard);
    transform-style: preserve-3d;
    perspective: 1000px;
    contain: layout style;
    outline: none;
  }

  .dynamic-grid.nested {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .dynamic-grid.masonry {
    grid-auto-flow: dense;
  }

  /* Add will-change when transitioning */
  .dynamic-grid.transitioning {
    will-change: grid-template-columns, grid-template-rows, gap;
  }

  .dynamic-grid.virtual {
    position: relative;
    overflow-y: auto;
    contain: strict;
  }

  .virtual-container {
    position: relative;
    width: 100%;
    transition: height var(--transition-normal) var(--ease-standard);
  }

  .virtual-items {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: inherit;
    grid-template-rows: inherit;
    gap: inherit;
    will-change: transform;
    transition: transform var(--transition-normal) var(--ease-standard);
  }

  .grid-item {
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-2);
    padding: var(--space-2);
    box-sizing: border-box;
    transition: all var(--transition-normal) var(--ease-standard);
    transform-origin: center center;
    transform: scale(calc(1 * var(--grid-scale)));
    contain: layout style;
    outline: none;
  }

  .grid-item.focused {
    border-color: var(--focus);
    box-shadow: 0 0 0 2px var(--focus);
    z-index: 2;
  }

  .nested .grid-item {
    border: none;
    padding: var(--space-1);
  }

  /* Smooth transitions for grid items */
  .transitioning .grid-item {
    animation: item-resize var(--transition-normal) var(--ease-standard);
  }

  @keyframes item-resize {
    from {
      opacity: 0.7;
      transform: scale(calc(0.95 * var(--grid-scale)));
    }
    to {
      opacity: 1;
      transform: scale(calc(1 * var(--grid-scale)));
    }
  }

  .grid-item:hover {
    background: var(--surface-2);
    transform: scale(calc(1.05 * var(--grid-scale)));
    z-index: 1;
  }

  .nested .grid-item:hover {
    transform: scale(calc(1.02 * var(--grid-scale)));
  }

  .grid-item:active {
    transform: scale(calc(0.98 * var(--grid-scale)));
  }

  /* Environment-specific styles */
  .dynamic-grid[data-environment="ar"],
  .dynamic-grid[data-environment="vr"] {
    transform-style: preserve-3d;
    perspective-origin: center center;
  }

  /* Density variations with golden ratio */
  .dynamic-grid.compact {
    gap: calc(var(--gap) * 0.618);
  }

  .dynamic-grid.spacious {
    gap: calc(var(--gap) * 1.618);
  }

  /* Responsive breakpoints */
  @media (max-width: 640px) {
    .grid-item {
      transform: scale(calc(0.9 * var(--grid-scale)));
    }
  }

  @media (max-width: 1024px) {
    .grid-item {
      transform: scale(calc(0.95 * var(--grid-scale)));
    }
  }

  /* State-based styles */
  .dynamic-grid.loading .grid-item {
    opacity: 0.7;
    pointer-events: none;
  }

  .dynamic-grid.error .grid-item {
    border-color: var(--error);
  }

  .dynamic-grid.success .grid-item {
    border-color: var(--success);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>