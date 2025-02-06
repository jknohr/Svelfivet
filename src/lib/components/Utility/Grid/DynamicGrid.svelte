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
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import type { 
    UnifiedThemeContext,
    SpatialEnvironment,
    BaseElementRequirements
  } from '$lib/components/Theme/Theme.types';
  
  // Base spatial types
  import type { 
    SpatialAnchorConfig,
    SpatialConstraints,
    ScaleContext,
    SpatialConfig
  } from '$lib/types/spatial';
  
  // OpenXR and implementation specific types
  import type { 
    SpatialMesh,
    SpatialUnderstandingConfig,
    RoomBoundaryConfig,
    EnvironmentSpatialConfig
  } from '$lib/components/Theme/configs/spatialAnchor';
  
  // Default configurations and utilities
  import { 
    defaultSpatialConstraints,
    defaultSpatialUnderstandingConfig,
    defaultRoomBoundaryConfig,
    getEnvironmentSpatialConfig
  } from '$lib/components/Theme/configs/spatialAnchor';
  import { BASE, SPACE_3D } from '$lib/components/Theme/SpatialDesign';
  import { ENVIRONMENT_GRID_CONSTRAINTS } from '$lib/components/Theme/configs/gridConstraints';
  import type { 
    DynamicGridProps, 
    GridItem, 
    VirtualListState, 
    GridLayout,
    GridMode,
    GridDensity 
  } from './DynamicGrid.types';
  import { optimizeGridRenders } from './gridRenderOptimization';

  // Golden ratio constant for grid calculations
  const phi = 1.618033988749895;

  let props = $props();
  let { 
    items = [],
    templateColumns = 'auto',
    templateRows = 'auto',
    gap = '1rem',
    density = 'comfortable',
    environment = 'desktop',
    spatialConfig = undefined,
    spatialAnchor = undefined,
    spatialUnderstanding = undefined,
    roomBoundary = undefined,
    spatialConstraints = undefined,
    mode = 'auto',
    minItemWidth = `${BASE.UNIT * 12}px`,  // 192px base
    maxItemWidth = `${BASE.UNIT * 25}px`,  // 400px base
    minItemHeight = `${BASE.UNIT * 8}px`,   // 128px base
    maxItemHeight = `${BASE.UNIT * 20}px`,  // 320px base,
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

  // Generate unique IDs for different environments and spatial anchors
  const baseGridId = generateId(`grid-${environment || 'browser'}`);
  const gridId = spatialAnchor ? `${baseGridId}-anchor-${generateId()}` : baseGridId;
  setContext('gridId', gridId);
  
  // Make grid ID available for spatial anchor calculations
  const getGridId = () => gridId;
  setContext('getGridId', getGridId);

  // Theme and scale context
  const theme = getContext<UnifiedThemeContext>('theme');
  const scale = getContext<ScaleContext>('spatial-scale');
  const { factor } = scale;
  const parentGrid = getContext<GridLayout | null>('parent-grid');

  // State management using Svelte 5 runes
  let containerWidth = $state(0);
  let containerHeight = $state(0);
  let spatialTransform = $state('');

  // Calculate spatial anchor transform
  $effect(() => {
    // Calculate spatial transform using the anchor-specific grid ID
    spatialTransform = calculateSpatialTransform(gridId, spatialAnchor);
  });
  let containerRef: HTMLElement | null = null;
  let virtualState = $state<VirtualListState | null>(null);
  let gridLayout = $state<GridLayout | null>(null);
  let visibleItems = $state<GridItem[]>([]);
  let observer: IntersectionObserver | null = null;

  // Setup lazy loading intersection observer
  $effect(() => {
    if (!lazy || !containerRef) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '-1');
            if (index !== -1 && !visibleItems.includes(items[index])) {
              visibleItems = [...visibleItems, items[index]];
            }
          }
        });
      },
      { root: containerRef, threshold: 0.1 }
    );

    return () => {
      observer?.disconnect();
      observer = null;
    };
  });

  // Set parent grid context
  setContext('parent-grid', gridLayout);

  // Get parent grid context for nested grids
  const parentGridLayout = getContext<GridLayout | null>('parent-grid');

  // Update layout when parent grid changes
  $effect(() => {
    if (nested && parentGridLayout) {
      // Adjust our layout based on parent grid's constraints
      const parentColumns = parentGridLayout.columns;
      const parentItemWidth = parentGridLayout.itemWidth;
      
      if (mode === 'auto') {
        // Adjust our columns to fit within parent grid item
        const availableWidth = parentItemWidth - parseFloat(gap);
        const optimalColumns = calculateOptimalColumns(availableWidth);
        gridLayout = {
          ...gridLayout!,
          columns: Math.min(optimalColumns, parentColumns)
        };
      }
    }
  });
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
  const currentDensity = $derived(density as GridDensity);
  const currentEnvironment = $derived(environment as SpatialEnvironment);

  import { calculateSpatialUnit, calculateSpatialTransform } from './spatialUnitCalculator';
  import { loadLensConfig, convertToSpatialConfig } from '$lib/configs/devices/lensConfigLoader';
  
  // Device configuration
  let deviceConfig = $state(null);
  
  // Load device config
  const loadDeviceConfig = async () => {
    if (environment === 'vr' || environment === 'ar') {
      // Get environment-specific spatial configuration
      const envConfig = getEnvironmentSpatialConfig(environment);
      
      // Merge with any user-provided overrides using new spatial configuration
      const mergedConfig = {
        ...envConfig,
        ...spatialConfig,
        anchor: {
          ...envConfig.anchor,
          ...spatialConfig?.anchor,
          ...spatialAnchor
        },
        understanding: {
          ...defaultSpatialUnderstandingConfig,
          ...envConfig.understanding,
          ...spatialConfig?.understanding,
          ...spatialUnderstanding
        },
        boundary: {
          ...defaultRoomBoundaryConfig,
          ...envConfig.boundary,
          ...spatialConfig?.boundary,
          ...roomBoundary
        },
        constraints: {
          ...defaultSpatialConstraints,
          ...envConfig.constraints,
          ...spatialConfig?.constraints,
          ...spatialConstraints
        }
      };

      // Initialize spatial understanding if enabled
      if (mergedConfig.understanding.enabled) {
        await initializeSpatialUnderstanding(mergedConfig.understanding);
      }

      // Initialize room boundary system if enabled
      if (mergedConfig.boundary.enabled) {
        await initializeRoomBoundary(mergedConfig.boundary);
      }

      // Update device configuration
      deviceConfig = mergedConfig;
    }
  };

  // Trigger config load on mount and when environment changes
  $effect(() => {
    loadDeviceConfig();
  });

  // Get spatial configuration from theme
  const themeSpatialConfig = $derived(() => {
    const config = theme.utils.getComputedTheme().spatial as SpatialConfig;
    return config;
  });

  // Compute effective spatial configuration
  // Get environment defaults
  const envDefaults = getEnvironmentSpatialConfig(environment);

  // Allow granular overrides of spatial configuration
  let effectiveSpatialConfig = $state<EnvironmentSpatialConfig>({
    anchor: spatialAnchor || envDefaults.anchor,
    understanding: spatialUnderstanding || envDefaults.understanding,
    boundary: roomBoundary || envDefaults.boundary,
    constraints: spatialConstraints || envDefaults.constraints
  });

  // Update when any spatial config props change
  $effect(() => {
    const newEnvDefaults = getEnvironmentSpatialConfig(environment);
    effectiveSpatialConfig = spatialConfig || {
      anchor: spatialAnchor || newEnvDefaults.anchor,
      understanding: spatialUnderstanding || newEnvDefaults.understanding,
      boundary: roomBoundary || newEnvDefaults.boundary,
      constraints: spatialConstraints || newEnvDefaults.constraints
    };
  });

  // Calculate optimal number of columns based on container width and environment
  function calculateOptimalColumns(width: number): number {
    if (fixedColumns) return fixedColumns;
    
    // Get environment-specific constraints
    // Handle default case by falling back to desktop environment
    const effectiveEnvironment = currentEnvironment === 'default' ? 'desktop' : currentEnvironment;
    const envConstraints = ENVIRONMENT_GRID_CONSTRAINTS[effectiveEnvironment]?.[currentDensity] ?? 
      ENVIRONMENT_GRID_CONSTRAINTS.desktop.comfortable;
    
    // Get base unit and calculate minimum width
    const baseUnit = BASE.UNIT;
    const minWidthBase = parseFloat(theme.utils.getCSSVariable(minItemWidth as string) ?? minItemWidth);
    const minWidthScaled = minWidthBase * envConstraints.minScale;
    
    // Apply environment-specific scaling
    const scaleFactor = Math.min(
      envConstraints.maxScale,
      Math.max(envConstraints.minScale, factor)
    );
    
    // Calculate effective width considering environment
    const effectiveWidth = width * scaleFactor;
    
    // Apply immersive adjustments if needed
    const isImmersive = currentEnvironment === 'vr' || currentEnvironment === 'ar';
    const viewingFactor = isImmersive ? 
      Math.cos(envConstraints.viewingAngle * (Math.PI / 180)) : 1;
    
    const adjustedWidth = effectiveWidth * viewingFactor;
    
    // Calculate columns based on mode
    if (mode === 'auto') {
      // Use golden ratio for optimal proportions
      const optimalWidth = minWidthScaled * phi;
      const columns = Math.floor(adjustedWidth / optimalWidth);
      return Math.max(1, Math.min(columns, items.length));
    } 
    
    if (mode === 'masonry') {
      // Use square proportions for masonry
      const columns = Math.floor(adjustedWidth / (minWidthScaled * 1.2)); // Slight rectangle
      return Math.max(2, columns);
    }
    
    // Default to responsive columns
    return Math.max(1, Math.floor(adjustedWidth / minWidthScaled));
  }

  // Calculate optimal number of rows based on layout and content
  function calculateOptimalRows(columns: number): number {
    if (fixedRows) return fixedRows;
    
    // Get environment-specific constraints
    // Handle default case by falling back to desktop environment
    const effectiveEnvironment = currentEnvironment === 'default' ? 'desktop' : currentEnvironment;
    const envConstraints = ENVIRONMENT_GRID_CONSTRAINTS[effectiveEnvironment]?.[currentDensity] ?? 
      ENVIRONMENT_GRID_CONSTRAINTS.desktop.comfortable;
    
    // Calculate base height using environment constraints
    const baseHeight = parseFloat(theme.utils.getCSSVariable(minItemHeight as string) ?? minItemHeight);
    const scaledHeight = baseHeight * envConstraints.minScale;
    
    // Apply environment-specific scaling
    const scaleFactor = Math.min(
      envConstraints.maxScale,
      Math.max(envConstraints.minScale, factor)
    );
    
    // Calculate effective height
    const effectiveHeight = containerHeight * scaleFactor;
    
    if (mode === 'masonry') {
      // For masonry, maintain visual balance with columns
      const optimalHeight = scaledHeight * phi;
      
      // Apply viewing angle adjustment for immersive
      const isImmersive = currentEnvironment === 'vr' || currentEnvironment === 'ar';
      const viewingFactor = isImmersive ? 
        Math.cos(envConstraints.viewingAngle * (Math.PI / 180)) : 1;
      
      const adjustedHeight = effectiveHeight * viewingFactor;
      const spatialRows = Math.ceil(adjustedHeight / optimalHeight);
      const contentRows = Math.ceil(items.length / columns);
      
      return Math.max(spatialRows, contentRows);
    }
    
    if (mode === 'auto') {
      // Calculate rows to maintain golden ratio proportions
      const contentRows = Math.ceil(items.length / columns);
      const availableHeight = effectiveHeight / contentRows;
      const rows = Math.max(1, Math.floor(availableHeight / scaledHeight));
      return Math.min(rows, contentRows);
    }
    
    // Default to content-based rows
    return Math.ceil(items.length / columns);
  }

  // Calculate item size with proper golden ratio proportions
  function calculateItemSize(columns: number, rows: number) {
    // Get environment-specific constraints
    // Handle default case by falling back to desktop environment
    const effectiveEnvironment = currentEnvironment === 'default' ? 'desktop' : currentEnvironment;
    const envConstraints = ENVIRONMENT_GRID_CONSTRAINTS[effectiveEnvironment]?.[currentDensity] ?? 
      ENVIRONMENT_GRID_CONSTRAINTS.desktop.comfortable;
    
    // Calculate base dimensions
    const baseUnit = BASE.UNIT;
    const baseGap = effectiveEnvironment === 'vr' || effectiveEnvironment === 'ar' ?
      envConstraints.minDistance : BASE.M;
    
    // Apply environment-specific scaling
    const scaleFactor = Math.min(
      envConstraints.maxScale,
      Math.max(envConstraints.minScale, factor)
    );
    
    // Calculate effective spacing
    const effectiveGap = baseGap * scaleFactor;

    // Calculate available space
    const availableWidth = containerWidth - (columns - 1) * effectiveGap;
    const availableHeight = containerHeight - (rows - 1) * effectiveGap;
    
    // Calculate base item dimensions
    const itemWidth = Math.max(
      baseUnit * 8 * scaleFactor, // Minimum width
      availableWidth / columns
    );
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
  async function initializeSpatialUnderstanding(config: SpatialUnderstandingConfig) {
    if (!config.enabled) return;
    
    try {
      // Start mesh tracking if enabled
      if (config.meshTracking) {
        await startMeshTracking(config);
      }

      // Enable semantic labeling if configured
      if (config.semanticLabeling) {
        await enableSemanticLabeling(config);
      }

      // Set up occlusion if enabled
      if (config.occlusionEnabled) {
        await setupOcclusion(config);
      }
    } catch (error) {
      console.error('Failed to initialize spatial understanding:', error);
    }
  }

  async function initializeRoomBoundary(config: RoomBoundaryConfig) {
    if (!config.enabled) return;
    
    try {
      // Initialize boundary tracking
      await startBoundaryTracking(config);

      // Set up safety system if warning distance is configured
      if (config.warningDistance > 0) {
        setupSafetySystem(config);
      }
    } catch (error) {
      console.error('Failed to initialize room boundary:', error);
    }
  }

  // Placeholder functions for XR functionality - implement these based on your XR framework
  async function startMeshTracking(config: SpatialUnderstandingConfig) {
    // Implementation depends on your XR framework
  }

  async function enableSemanticLabeling(config: SpatialUnderstandingConfig) {
    // Implementation depends on your XR framework
  }

  async function setupOcclusion(config: SpatialUnderstandingConfig) {
    // Implementation depends on your XR framework
  }

  async function startBoundaryTracking(config: RoomBoundaryConfig) {
    // Implementation depends on your XR framework
  }

  function setupSafetySystem(config: RoomBoundaryConfig) {
    // Implementation depends on your XR framework
  }

  function calculateGridLayout(): GridLayout {
    const columns = calculateOptimalColumns(containerWidth);
    const rows = calculateOptimalRows(columns);
    const { width: itemWidth, height: itemHeight } = calculateItemSize(columns, rows);
    
    // Calculate effective gap using UIScalingLayout's scale context
    const baseGap = parseFloat(theme.utils.getCSSVariable(gap as string) ?? gap.toString());
    const scaledGap = baseGap * factor;

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

  // Default settings for virtualization
  const defaultVirtualizationSettings = {
    enabled: true,
    overscan: 1.5,
    chunkSize: 10,
    scrollThreshold: 50,
    measureTimeout: 100
  };

  // Create a virtual list with environment-specific optimizations
  function createVirtualList() {
    if (!virtualization?.enabled || !items.length || !gridLayout) {
      virtualState = null;
      return;
    }

    const themeContext = getContext<UnifiedThemeContext>('theme');
    const computedTheme = themeContext?.utils?.getComputedTheme();
    const virtualizationSettings = computedTheme?.virtualization ?? defaultVirtualizationSettings;
    const constraints = computedTheme?.spatial?.constraints ?? defaultSpatialConstraints;
    const itemHeight = gridLayout.itemHeight + gridLayout.gap;
    const itemsPerRow = gridLayout.columns;
    const totalRows = Math.ceil(items.length / itemsPerRow);
    const isImmersive = currentEnvironment === 'vr' || currentEnvironment === 'ar';
    
    // Calculate buffer size based on viewport and environment
    const visibleRows = Math.ceil(containerHeight / itemHeight);
    const bufferRows = Math.ceil(visibleRows * virtualizationSettings.overscan);
    
    // Create chunks with environment-specific handling
    const chunks = [];
    for (let i = 0; i < totalRows; i += virtualizationSettings.chunkSize) {
      const chunk = {
        startRow: i,
        endRow: Math.min(i + virtualizationSettings.chunkSize, totalRows),
        items: items.slice(i * itemsPerRow, Math.min((i + virtualizationSettings.chunkSize) * itemsPerRow, items.length)),
        measured: false,
        height: virtualizationSettings.measureTimeout * virtualizationSettings.chunkSize
      };

      if (isImmersive) {
        // Add spatial properties for VR/AR
        const chunkDepth = (i / totalRows) * (constraints.maxDistance - constraints.minDistance);
        Object.assign(chunk, {
          depth: chunkDepth,
          angle: (i / totalRows) * constraints.viewingAngle,
          distance: constraints.minDistance + chunkDepth
        });
      }

      chunks.push(chunk);
    }

    virtualState = {
      chunks,
      visibleItems: items.slice(0, itemsPerRow * bufferRows),
      scrollTop: 0,
      viewportHeight: containerHeight,
      totalHeight: totalRows * itemHeight,
      itemHeight,
      itemsPerRow,
      bufferRows,
      lastMeasuredIndex: -1
    };
  }

  $effect(() => {
    if (items.length && virtualization?.enabled && gridLayout) {
      createVirtualList();
    }
  });

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
      }, 300); // Using a standard transition duration of 300ms
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
      '--grid-scale': factor.toString(),
      '--transition-state': isTransitioning ? 'transitioning' : 'stable'
    };
  });

  // Update virtualization when items or layout changes
  // Measure chunk dimensions for accurate virtualization
  function measureChunk(chunk: VirtualChunk) {
    const { measureTimeout } = defaultVirtualizationSettings;
    const chunkElement = containerRef?.querySelector(`[data-chunk="${chunk.startRow}"]`);
    
    if (!chunkElement) return;
    
    // Use ResizeObserver for accurate measurements
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chunk.height = entry.borderBoxSize[0].blockSize;
        chunk.measured = true;
        
        // Update total height
        if (virtualState) {
          virtualState.totalHeight = virtualState.chunks.reduce(
            (total, c) => total + (c.measured ? c.height : c.items.length * virtualState.itemHeight),
            0
          );
        }
      }
      observer.disconnect();
    });
    
    observer.observe(chunkElement);
    
    // Cleanup after timeout
    setTimeout(() => {
      observer.disconnect();
      if (!chunk.measured) {
        chunk.measured = true;
        chunk.height = chunk.items.length * (virtualState?.itemHeight || defaultVirtualizationSettings.measureTimeout);
      }
    }, measureTimeout);
  }

  // Handle window resize with debouncing and spatial constraints
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
        
        // Apply spatial constraints
        const constraints = GRID_CONSTRAINTS[currentDensity] || GRID_CONSTRAINTS.DEFAULT;
        const scaledWidth = width * (constraints.minScale + constraints.maxScale) / 2;
        const scaledHeight = height * Math.cos(constraints.viewingAngle * Math.PI / 180);
        
        containerWidth = Math.min(Math.max(scaledWidth, constraints.minDistance), constraints.maxDistance);
        containerHeight = scaledHeight;
        
        if (virtualization?.enabled) {
          createVirtualList();
        }
        
        resizeTimeout = null;
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Optimize rendering with environment-aware handling
  function optimizeGridRenders(event: Event) {
    if (!gridLayout) return;
    
    const currentConfig = deviceConfig as EnvironmentSpatialConfig;
    const constraints = currentConfig?.constraints || defaultSpatialConstraints;
    const currentScale = scale?.factor ?? 1;
    
    // Apply spatial constraints
    const effectiveScale = Math.max(
      constraints.minScale,
      Math.min(constraints.maxScale, currentScale)
    );
    
    // Calculate grid dimensions based on BASE units and constraints
    const baseItemWidth = parseInt(minItemWidth) * effectiveScale;
    const baseItemHeight = parseInt(minItemHeight) * effectiveScale;
    const baseGap = BASE.M * effectiveScale;  // Use BASE.M (16px) as default gap
    
    // Apply minimum distance constraint
    const minDistance = Math.max(constraints.minDistance, baseGap);
    
    // Update grid layout with spatially-aware dimensions
    gridLayout = {
      ...gridLayout,
      itemWidth: Math.max(baseItemWidth, constraints.minDistance),
      itemHeight: Math.max(baseItemHeight, constraints.minDistance),
      gap: minDistance
    };
    
    // Only proceed with virtualization if enabled
    if (!virtualization?.enabled || !virtualState) return;
    
    const themeContext = getContext<UnifiedThemeContext>('theme');
    const computedTheme = themeContext?.utils?.getComputedTheme();
    const virtualizationSettings = computedTheme?.virtualization ?? defaultVirtualizationSettings;
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const isImmersive = currentEnvironment === 'vr' || currentEnvironment === 'ar';
    
    // Throttle updates based on environment
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
      const { itemHeight, itemsPerRow, bufferRows, chunks } = virtualState;
      const currentRow = Math.floor(scrollTop / itemHeight);
      const visibleRows = Math.ceil(containerHeight / itemHeight);
      
      // Find visible chunks with environment-specific visibility check
      const visibleChunks = chunks.filter(chunk => {
        const chunkTop = chunk.startRow * itemHeight;
        const chunkBottom = chunk.endRow * itemHeight;
        
        if (isImmersive) {
          // For VR/AR, consider depth and viewing angle
          const depthFactor = Math.cos(chunk.angle * Math.PI / 180);
          const visibilityRange = bufferRows * itemHeight * depthFactor;
          return chunkBottom >= scrollTop - visibilityRange && 
                 chunkTop <= scrollTop + containerHeight + visibilityRange &&
                 chunk.distance >= constraints.minDistance &&
                 chunk.distance <= constraints.maxDistance;
        }
        
        // Standard visibility check for desktop/mobile
        return chunkBottom >= scrollTop - (bufferRows * itemHeight) && 
               chunkTop <= scrollTop + containerHeight + (bufferRows * itemHeight);
      });
      
      // Update visible items with proper ordering
      const visibleItems = isImmersive
        ? visibleChunks
            .sort((a, b) => b.distance - a.distance) // Sort by distance for proper z-ordering
            .flatMap(chunk => chunk.items)
        : visibleChunks.flatMap(chunk => chunk.items);
      
      virtualState = {
        ...virtualState,
        visibleItems,
        scrollTop,
        currentRow,
        visibleRows,
        visibleChunks
      };
      
      // Measure unmeasured chunks with environment-specific timing
      visibleChunks
        .filter(chunk => !chunk.measured)
        .forEach(chunk => {
          const measureDelay = isImmersive ? 0 : virtualizationSettings.measureTimeout;
          setTimeout(() => measureChunk(chunk), measureDelay);
        });
    });
  }

  // Generate unique ID for accessibility
  // Using existing gridId from context

  // Handle item click with proper event typing
  // Handle keyboard navigation
function handleKeyboardNavigation(event: KeyboardEvent) {
  if (!keyboardNavigation) return;
  
  const currentFocus = document.activeElement;
  const gridItems = Array.from(document.querySelectorAll('.grid-item'));
  const currentIndex = gridItems.indexOf(currentFocus as Element);
  
  switch(event.key) {
    case 'ArrowRight':
      if (currentIndex < gridItems.length - 1) {
        (gridItems[currentIndex + 1] as HTMLElement).focus();
      }
      break;
    case 'ArrowLeft':
      if (currentIndex > 0) {
        (gridItems[currentIndex - 1] as HTMLElement).focus();
      }
      break;
    case 'ArrowDown':
      const nextRowIndex = currentIndex + calculateOptimalColumns(containerWidth);
      if (nextRowIndex < gridItems.length) {
        (gridItems[nextRowIndex] as HTMLElement).focus();
      }
      break;
    case 'ArrowUp':
      const prevRowIndex = currentIndex - calculateOptimalColumns(containerWidth);
      if (prevRowIndex >= 0) {
        (gridItems[prevRowIndex] as HTMLElement).focus();
      }
      break;
    case 'Enter':
    case ' ':
      if (currentFocus && currentIndex !== -1) {
        handleItemClick(items[currentIndex], currentIndex, event);
      }
      break;
  }
}

// Handle mouse interactions
function handleMouseInteraction(event: MouseEvent) {
  if (!mouseInteraction) return;
  
  const target = event.target as HTMLElement;
  const gridItem = target.closest('.grid-item');
  
  if (gridItem) {
    const index = parseInt(gridItem.getAttribute('data-index') || '-1');
    if (index !== -1) {
      handleItemClick(items[index], index, event);
    }
  }
}

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

<UIScalingLayout
  scale={1}
  density={currentDensity}
  environment={environment}
  spatialAnchor={spatialAnchor}
>
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
  class:vr={currentEnvironment === 'vr'}
  class:ar={currentEnvironment === 'ar'}
  role="grid"
  id={gridId}
  aria-label={ariaLabel}
  aria-describedby={ariaDescription ? `${gridId}-desc` : undefined}
  aria-rowcount={gridLayout?.rows ?? 0}
  aria-colcount={gridLayout?.columns ?? 0}
  tabindex={focusable ? 0 : -1}
  style:grid-template-columns={typeof templateColumns === 'string' ? templateColumns : Array.isArray(templateColumns) ? templateColumns.join(' ') : `repeat(${calculateOptimalColumns(containerWidth)}, 1fr)`}
  style:grid-template-rows={templateRows}
  style:gap={gap}
  style:--max-item-width={maxItemWidth}
  style:--min-item-width={minItemWidth}
  style:--max-item-height={maxItemHeight}
  style:--min-item-height={minItemHeight}
  style="
    {Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';')};
    transform: {environmentTransform()};
    --grid-viewing-angle: {environmentSettings().constraints.viewingAngle}deg;
    --grid-min-distance: {environmentSettings().constraints.minDistance}px;
    --grid-max-distance: {environmentSettings().constraints.maxDistance}px;
  "
  bind:this={containerRef}
  onkeydown={keyboardNavigation ? handleKeyboardNavigation : undefined}
  onmousedown={mouseInteraction ? handleMouseInteraction : undefined}
  onscroll={virtualization?.enabled ? optimizeGridRenders : undefined}
  ontouchstart={gestures ? handleTouchStart : undefined}
  ontouchmove={gestures ? handleTouchMove : undefined}
  data-environment={currentEnvironment}
  {...spatialAnchor?.enabled ? { 'data-spatial-anchor': '' } : {}}
  >
  {#if ariaDescription}
    <div id="{gridId}-desc" class="sr-only">{ariaDescription}</div>
  {/if}

  {#if virtualization?.enabled && virtualState}
    <div 
      class="virtual-container"
      style:height="{virtualState.totalHeight}px"
    >
      {#each virtualState.chunks as chunk (chunk.startRow)}
        <div
          class="virtual-chunk"
          data-chunk={chunk.startRow}
          style:transform="translateY({chunk.startRow * virtualState.itemHeight}px)"
        >
          {#each chunk.items as item, chunkIndex (item.id)}
            {@const index = chunk.startRow * virtualState.itemsPerRow + chunkIndex}
            <div
              class="grid-item"
              class:focused={index === focusedItemIndex}
              role="gridcell"
              aria-rowindex={Math.floor(index / (gridLayout?.columns ?? 1)) + 1}
              aria-colindex={(index % (gridLayout?.columns ?? 1)) + 1}
              aria-selected={index === focusedItemIndex}
              tabindex={focusable ? 0 : -1}
              onclick={(e) => mouseInteraction ? handleItemInteraction(item, index, e) : undefined}
              onkeydown={(e) => keyboardNavigation ? handleItemInteraction(item, index, e) : undefined}
              style:width="var(--item-width)"
              style:height={mode === 'masonry' ? 'auto' : 'var(--item-height)'}
              style:transform="translate(
                {(chunkIndex % virtualState.itemsPerRow) * (gridLayout?.itemWidth + (gridLayout?.gap ?? 0))}px,
                {Math.floor(chunkIndex / virtualState.itemsPerRow) * (gridLayout?.itemHeight + (gridLayout?.gap ?? 0))}px
              )"
            >
              {@render children?.(item)}
            </div>
          {/each}
        </div>
      {/each}
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
</UIScalingLayout>

<style>
  .dynamic-grid {
    display: grid;
    width: 100%;
    height: 100%;
    position: relative;

    /* Item size constraints */
    & > * {
      min-width: var(--min-item-width, auto);
      max-width: var(--max-item-width, none);
      min-height: var(--min-item-height, auto);
      max-height: var(--max-item-height, none);
    }

    /* Accessibility and focus styles */
    &:focus {
      outline: 2px solid var(--theme-focus-ring-color, #4c9ffe);
      outline-offset: 2px;
    }

    /* Spatial anchor positioning */
    &[data-spatial-anchor] {
      transform-style: preserve-3d;
      transform: var(--spatial-transform);
      transition: transform 0.3s ease-out;
    }
    box-sizing: border-box;
    position: relative;
    overflow: auto;
    will-change: transform;
    contain: strict;
    -webkit-overflow-scrolling: touch;
    transition: all var(--transition-normal) var(--ease-standard);
    transform-style: preserve-3d;
    perspective: var(--grid-perspective, 1000px);
    transform-origin: center center;
    outline: none;
  }

  .dynamic-grid.vr,
  .dynamic-grid.ar {
    perspective-origin: 50% calc(50% + var(--grid-min-distance));
    transform-style: preserve-3d;
  }

  .dynamic-grid.vr .grid-item,
  .dynamic-grid.ar .grid-item {
    transform-style: preserve-3d;
    backface-visibility: visible;
    transform: translateZ(calc(var(--grid-depth, 0) * 1px));
  }

  .dynamic-grid.ar {
    perspective: none; /* AR handles perspective through the device */
    transform-origin: center center;
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
    will-change: height;
    contain: layout size;
    transition: height var(--transition-normal) var(--ease-standard);
  }

  .virtual-chunk {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    will-change: transform;
    transform-origin: top left;
    contain: layout style paint;
    backface-visibility: hidden;
    transform-style: preserve-3d;
  }

  .grid-item {
    position: absolute;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-2);
    padding: var(--space-2);
    box-sizing: border-box;
    transition: transform var(--transition-normal) var(--ease-standard);
    transform-origin: center center;
    will-change: transform;
    contain: layout style paint;
    backface-visibility: hidden;
    transform-style: preserve-3d;
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
