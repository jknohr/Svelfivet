<!-- /src/lib/components/UIScalingLayout.svelte -->
<!--
@component UIScalingLayout
Central controller for spatial scaling and layout following Dieter Rams principles:
1. Good design is innovative - Adaptive scaling based on context
2. Good design makes a product useful - Consistent spatial relationships
3. Good design is aesthetic - Golden ratio based proportions
4. Good design is unobtrusive - Subtle transitions and depth
5. Good design is honest - True to the spatial grid system
6. Good design is long-lasting - Based on fundamental design principles
7. Good design is thorough - Comprehensive spatial system
8. Good design is as little as possible - Minimal yet meaningful spacing

Features:
- Responsive scaling based on viewport and device
- AR/VR spatial anchor support (optional)
- Adaptive UI scaling based on environment
- Collision detection and bounds checking
- Environment-aware constraints
@component UIScalingLayout
Central controller for spatial scaling and layout with z-index management.
Features:
- Responsive scaling based on viewport and device
- AR/VR spatial anchor support (optional)
- Adaptive UI scaling based on environment
- Collision detection and bounds checking
- Environment-aware constraints
- z-index management for layering elements
-->

<svelte:options runes={true} />

<script lang="ts">
  import { setContext, getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { 
    Density, 
    ScaleContext,
    SpatialEnvironment,
    SpatialAnchorConfig,
    EnvironmentConstraints,
    ScalingConstraints
  } from '$lib/types/spatial';
import type { UnifiedThemeContext } from './Theme.types';
  import { BASE, SPACE_3D } from './SpatialDesign';

  // Props with TypeScript interface
  interface Props {
    scale?: number;
    density?: Density;
    environment?: SpatialEnvironment;
    spatialAnchor?: SpatialAnchorConfig;
    children?: Snippet;
  }

  // Props using Svelte 5 style
  let props = $props();
  let {
    scale = 1,
    density: initialDensity = 'comfortable',
    environment = 'desktop',
    spatialAnchor,
    children
  } = props as Props;

  let density = $state(initialDensity);

  // Theme context
  const themeContext = getContext<UnifiedThemeContext>('theme');

  // Density multipliers based on golden ratio
  const PHI = 1.618033988749895;
  const densityScales = {
    compact: 1 / PHI,      // ≈ 0.618
    comfortable: 1,        // Base scale
    spacious: PHI         // ≈ 1.618
  } as const;

  // Environment detection
  let hasXRSupport = $state(false);
  let currentConstraints = $state<ScalingConstraints | null>(null);

  // Calculate effective scale based on environment and constraints
  const effectiveScale = $derived.by(() => {
    const baseScale = scale * densityScales[density];
    
      // Apply environment-specific constraints if available
    if (currentConstraints) {
      const constrainedScale = Math.max(
        Math.min(baseScale, currentConstraints.maxScale),
        currentConstraints.minScale
      );
      
      // If spatial anchor is enabled, we still use the same constraints
      // as they represent the environment bounds
      return constrainedScale;
    }

    return baseScale;
  });
  
  // Base measurements
  const baseUnit = $derived.by(() => 16 * effectiveScale);
  const gridUnit = $derived.by(() => baseUnit / 2);
  const spaceUnit = $derived.by(() => baseUnit * 2);

  // Generate spacing variables
  const spacingVars = $derived.by(() => ({
    '--ui-grid': `${gridUnit}px`,
    '--ui-space': `${spaceUnit}px`,
    '--ui-unit': `${baseUnit}px`,
    
    '--space-xxs': `${baseUnit * 0.382}px`,
    '--space-xs': `${baseUnit * 0.618}px`,
    '--space-sm': `${baseUnit}px`,
    '--space-md': `${baseUnit * 1.618}px`,
    '--space-lg': `${baseUnit * 2.618}px`,
    '--space-xl': `${baseUnit * 4.236}px`,
    
    '--radius-sm': `${gridUnit * 0.5}px`,
    '--radius-md': `${gridUnit}px`,
    '--radius-lg': `${baseUnit}px`,
    
    '--depth-base': '0px',
    '--depth-raised': '2px',
    '--depth-floating': '8px',
    
    '--transition-fast': '150ms',
    '--transition-normal': '300ms',
    '--transition-slow': '450ms',
    '--ease-standard': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    '--spatial-enabled': spatialAnchor?.enabled ? '1' : '0',
    '--spatial-environment': environment,
    '--spatial-scale': effectiveScale.toString()
  } as const));

   // Provide scaling context
  const scaleContext: ScaleContext = {
    get density() { return density; },
    get factor() { return effectiveScale; },
    setDensity: (newDensity: Density) => { density = newDensity; },
    setScale: (newScale: number) => { scale = newScale; }
  };
  
  setContext('spatial-scale', scaleContext);

  // Check XR support
  $effect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      const xr = (navigator as Navigator & { xr?: { isSessionSupported(mode: string): Promise<boolean> } }).xr;
      if (xr) {
        xr.isSessionSupported('immersive-ar')
          .then((supported) => {
            hasXRSupport = supported;
          })
          .catch(() => {
            hasXRSupport = false;
          });
      }
    }
  });

  // Get environment constraints
  $effect(() => {
    const computedTheme = themeContext?.utils?.getComputedTheme();
    if (environment !== 'desktop' && computedTheme?.spatial?.constraints) {
      const constraints = computedTheme.spatial.constraints;
      const envKey = environment as SpatialEnvironment;
      if (envKey in constraints) {
        const envConstraints = constraints[envKey];
        if (envConstraints) {
          currentConstraints = {
            minScale: envConstraints.minScale ?? 0.5,
            maxScale: envConstraints.maxScale ?? 2,
            minDistance: envConstraints.minDistance,
            maxDistance: envConstraints.maxDistance,
            viewingAngle: envConstraints.viewingAngle
          };
        } else {
          currentConstraints = null;
        }
      } else {
        currentConstraints = null;
      }
    } else {
      currentConstraints = null;
    }
  });

  // Watch viewport changes
  let viewportWidth = $state(0);
  let viewportHeight = $state(0);

  $effect(() => {
    const updateViewport = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    };
    
    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    return () => window.removeEventListener('resize', updateViewport);
  });

  // Z-index management
  const zIndexLevels = {
    base: 1,
    overlay: 10,
    modal: 100,
    tooltip: 1000,
    dropdown: 10000
  };

  // Provide z-index context
  const zIndexContext = {
    get base() { return zIndexLevels.base; },
    get overlay() { return zIndexLevels.overlay; },
    get modal() { return zIndexLevels.modal; },
    get tooltip() { return zIndexLevels.tooltip; },
    get dropdown() { return zIndexLevels.dropdown; },
    set: (key: keyof typeof zIndexLevels, value: number) => {
      zIndexLevels[key] = value;
    }
  };

  setContext('z-index', zIndexContext);
</script>

<div 
  class="ui-scaling-root"
  data-density={density}
  data-environment={environment}
  data-spatial={spatialAnchor?.enabled}
  style="{Object.entries(spacingVars)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')}" 
  role="presentation"
>
  {@render children?.()}
</div>

<style>
  .ui-scaling-root {
    /* Base styles */
    display: contents;
    transform-style: preserve-3d;
    perspective: 1000px;
    
    /* Transition all spatial properties */
    transition: all var(--transition-normal) var(--ease-standard);
  }

  /* Environment-specific styles */
  .ui-scaling-root[data-environment="ar"], 
  .ui-scaling-root[data-environment="vr"], 
  .ui-scaling-root[data-environment="mixed"] {
    transform-style: preserve-3d;
    perspective-origin: center center;
  }

  /* Global spatial classes */
  :global(.ui-grid) {
    display: grid;
    gap: var(--ui-grid);
    padding: var(--ui-space);
  }

  :global(.ui-stack) {
    display: flex;
    flex-direction: column;
    gap: var(--ui-space);
  }

  :global(.ui-row) {
    display: flex;
    flex-direction: row;
    gap: var(--ui-grid);
  }

  /* Spacing utilities */
  :global(.space-xxs) { padding: var(--space-xxs); }
  :global(.space-xs) { padding: var(--space-xs); }
  :global(.space-sm) { padding: var(--space-sm); }
  :global(.space-md) { padding: var(--space-md); }
  :global(.space-lg) { padding: var(--space-lg); }
  :global(.space-xl) { padding: var(--space-xl); }

  /* Border radius utilities */
  :global(.radius-sm) { border-radius: var(--radius-sm); }
  :global(.radius-md) { border-radius: var(--radius-md); }
  :global(.radius-lg) { border-radius: var(--radius-lg); }

  /* Elevation utilities */
  :global(.elevation-base) {
    transform: translateZ(var(--depth-base));
  }
  :global(.elevation-raised) {
    transform: translateZ(var(--depth-raised));
  }
  :global(.elevation-floating) {
    transform: translateZ(var(--depth-floating));
  }

  /* Density-specific adjustments */
  :global([data-density="compact"]) {
    --ui-space: calc(var(--ui-unit) * 0.618);
  }

  :global([data-density="spacious"]) {
    --ui-space: calc(var(--ui-unit) * 1.618);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    :global(.ui-scaling-root) {
      --density-scale: calc(var(--density-scale) * 0.875);
    }
  }

  @media (max-width: 768px) {
    :global(.ui-scaling-root) {
      --density-scale: calc(var(--density-scale) * 0.9375);
    }
  }
</style>
