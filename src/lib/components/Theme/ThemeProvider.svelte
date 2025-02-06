<!-- /home/subtomic/svelfivet/Svelfivet/src/lib/components/Theme/ThemeProvider.svelte -->
<!--
@component ThemeProvider
Root component for the Svelfivet theme system.
Features:
- Theme mode switching (light/dark/high-contrast)
- Custom theme configuration
- CSS variable generation
- Theme transitions
- Spatial system integration
-->

<svelte:options runes={true} />

<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { 
    UnifiedThemeContext, 
    ThemeConfig, 
    Density, 
    SpatialEnvironment, 
    GlassConfig, 
    ContrastThemeName, 
    ContrastConfig,
    ThemeEventType,
    ThemeEvent,
    ThemeEventMap,
    SpatialAnchorConfig
  } from './Theme.types';
  import { defaultTheme } from './defaulttheme';

  // Props with TypeScript interface
  interface Props {
    config?: Partial<ThemeConfig>;
    mode?: 'light' | 'dark' | 'high-contrast';
    transition?: boolean;
    children?: Snippet;
  }

  // Props using Svelte 5 style
  let props = $props();
  let {
    config = {},
    mode = 'light',
    transition = true,
    children
  } = props as Props;

  // Theme state
  let theme = $state<ThemeConfig>({ ...defaultTheme, ...config });
  let isTransitioning = $state(false);
  let transitionTimeout = $state<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Scale and density state
  let density = $state<Density>('comfortable');
  let scaleFactor = $state(1);

  // Spatial state
  let environment = $state<SpatialEnvironment>('desktop');
  let spatialAnchor = $state<SpatialAnchorConfig | null>(null);

  // Glass effects registry
  let glassRegistry = $state(new Map<string, GlassConfig>());

  // Contrast theme state
  let contrastTheme = $state<ContrastThemeName>('Default');
  const isHighContrast = $derived(mode === 'high-contrast');

  // CSS variables cache
  let cssVars = $state(new Map<string, string>());

  // Derived theme values
  const currentTheme = $derived.by(() => {
    const themeValue = { ...theme };
    return themeValue satisfies ThemeConfig;
  });

  const currentDensity = $derived.by(() => density as Density);
  const currentEnvironment = $derived.by(() => environment as SpatialEnvironment);
  const currentSpatialAnchor = $derived.by(() => spatialAnchor as SpatialAnchorConfig | null);
  const currentGlassRegistry = $derived.by(() => {
    const registry = new Map(glassRegistry);
    return registry;
  });
  const currentContrastTheme = $derived.by(() => contrastTheme as ContrastThemeName);

  // Clean up function for transitions
  function cleanupTransition() {
    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
      transitionTimeout = undefined;
    }
  }

  // Enhanced setTheme with transition handling
  function setThemeWithTransition(newTheme: Partial<ThemeConfig>) {
      isTransitioning = true;
    cleanupTransition();

      theme = { ...theme, ...newTheme };

    const duration = parseInt(theme.transitions.duration.normal);
    transitionTimeout = setTimeout(() => {
      isTransitioning = false;
    }, duration);
  }

  // Theme context implementation
  const themeContext: UnifiedThemeContext = {
    get theme() { return $state.snapshot(currentTheme); },
    setTheme: setThemeWithTransition,
    resetTheme: () => setThemeWithTransition(defaultTheme),

    events: {
      on: <T extends ThemeEventType>(type: T, handler: (event: ThemeEvent<T>) => void) => {
        const typedHandler = (e: Event) => handler(e as ThemeEvent<T>);
        window.addEventListener(type, typedHandler);
        return () => window.removeEventListener(type, typedHandler);
      },
      dispatch: <T extends ThemeEventType>(type: T, detail: ThemeEventMap[T]) => {
        const event = new CustomEvent(type, { detail, bubbles: true });
        window.dispatchEvent(event);
      }
    },

    scale: {
      get density() { return $state.snapshot(currentDensity); },
      get factor() { return $state.snapshot(scaleFactor); },
      setDensity: (newDensity: Density) => { density = newDensity; },
      setScale: (scale: number) => { scaleFactor = scale; }
    },

    spatial: {
      get environment() { return $state.snapshot(currentEnvironment); },
      setEnvironment: (env: SpatialEnvironment) => { environment = env; },
      get anchor() { return $state.snapshot(currentSpatialAnchor); },
      updateAnchor: (config: Partial<SpatialAnchorConfig>) => {
        if (spatialAnchor) {
          spatialAnchor = { ...spatialAnchor, ...config };
        }
      }
    },

    glass: {
      createPane: (config: Partial<GlassConfig>) => {
        const themeValue = $state.snapshot(currentTheme);
        const fullConfig = { ...themeValue.effects.glass.base, ...config };
        return fullConfig;
      },
      updatePane: (id: string, config: Partial<GlassConfig>) => {
        const registry = $state.snapshot(currentGlassRegistry);
        if (registry.has(id)) {
          const current = registry.get(id)!;
          glassRegistry.set(id, { ...current, ...config });
        }
      },
      registerPane: (id: string, config: GlassConfig) => {
        glassRegistry.set(id, config);
      }
    },

    typography: {
      setScale: (scale: number) => {
        const themeValue = $state.snapshot(currentTheme);
        type FontSizes = typeof themeValue.typography.fontSize;
        const newFontSizes = Object.entries(themeValue.typography.fontSize).reduce<FontSizes>(
          (acc, [key, value]) => {
            acc[key as keyof FontSizes] = `${parseFloat(value) * scale}rem`;
            return acc;
          },
          { xs: '', sm: '', base: '', lg: '', xl: '', xxl: '' }
        );

        theme = {
          ...theme,
          typography: {
            ...themeValue.typography,
            fontSize: newFontSizes
          }
        };
      },
      setFontFamily: (family: Partial<Record<keyof typeof currentTheme.typography.fontFamily, string>>) => {
        const themeValue = $state.snapshot(currentTheme);
        theme = {
          ...theme,
          typography: {
            ...themeValue.typography,
            fontFamily: {
              ...themeValue.typography.fontFamily,
              ...family
            }
          }
        };
      }
    },

    contrast: {
      get currentTheme() { return $state.snapshot(currentContrastTheme); },
      setTheme: (newTheme: ContrastThemeName | ContrastConfig) => {
        if (typeof newTheme === 'string') {
          contrastTheme = newTheme;
      }
      },
      get isHighContrast() { return $state.snapshot(isHighContrast); }
    },

    utils: {
      getCSSVariable: (name: string) => cssVars.get(name) ?? '',
      setCSSVariable: (name: string, value: string) => cssVars.set(name, value),
      getComputedTheme: () => ({ ...$state.snapshot(currentTheme) }),
      getDerivedValues: () => Object.fromEntries($state.snapshot(cssVars))
    }
  };

  // Set theme context
  setContext('theme', themeContext);

  // Apply theme CSS variables
  $effect(() => {
    const root = document.documentElement;
    cssVars.forEach((value, name) => {
      root.style.setProperty(name, value);
    });
  });
</script>

<svelte:head>
  <meta name="theme-color" content={$state.snapshot(currentTheme).colors.primary} />
  <meta name="color-scheme" content={mode} />
</svelte:head>

<div
  class="theme-root"
  class:transition
  role="presentation"
>
  {@render children?.()}
</div>

<style>
  .theme-root {
    height: 100%;
  }

  .transition {
    transition: all var(--transition-normal, 300ms) var(--ease-standard, cubic-bezier(0.4, 0.0, 0.2, 1));
  }

  /* Theme mode adjustments */
  :global([data-theme="dark"]) {
    color-scheme: dark;
    --color-background: #1a1a1a;
    --color-surface: #2a2a2a;
    --color-text: #ffffff;
    --color-textLight: #a0a0a0;
    --color-textDark: #e0e0e0;
    --color-border: #404040;
    --color-shadow: rgba(0, 0, 0, 0.3);
  }

  :global([data-theme="high-contrast"]) {
    --color-background: #ffffff;
    --color-surface: #ffffff;
    --color-text: #000000;
    --color-textLight: #000000;
    --color-textDark: #000000;
    --color-border: #000000;
    --color-primary: #000000;
    --color-secondary: #000000;
    --color-accent: #000000;
  }
</style>
