/**
 * Theme Composition System
 * Integrates all theme subsystems into a cohesive whole
 */

import type { ThemeConfig, UnifiedThemeContext, SpatialEnvironment } from './Theme.types';
import type { ElementConfig, ElementRunes } from './ThemeElements';
import type { ThemeAnimationConfig, AnimationController } from './ThemeAnimations';
import { DURATION, EASING } from './ThemeAnimations';
import { defaultTheme } from './defaulttheme';
import { createElementRunes } from './ThemeElements';
import { createAnimationController } from './ThemeAnimations';

// Animation Config Types
interface AnimationTimingConfig {
  duration: string;
  easing: string;
  delay?: string;
}

interface AnimationConfig {
  timing?: AnimationTimingConfig;
  keyframes: Keyframe[];
}

// Theme Instance State
export interface ThemeInstance {
  // Core Theme
  config: ReturnType<typeof $state<ThemeConfig>>;
  mode: ReturnType<typeof $state<'light' | 'dark' | 'high-contrast'>>;
  
  // Environment
  environment: ReturnType<typeof $state<SpatialEnvironment>>;
  density: ReturnType<typeof $state<'compact' | 'comfortable' | 'spacious'>>;
  scale: ReturnType<typeof $state<number>>;
  
  // Element Registry
  elements: ReturnType<typeof $state<Map<string, ElementRunes>>>;
  animations: ReturnType<typeof $state<Map<string, AnimationController>>>;
  
  // CSS Variables
  cssVars: ReturnType<typeof $state<Map<string, string>>>;
}

// Theme Composition
export interface ThemeComposition {
  // State Management
  state: ThemeInstance;
  
  // Derived Values
  derived: {
    isHighContrast: ReturnType<typeof $derived<boolean>>;
    effectiveScale: ReturnType<typeof $derived<number>>;
    currentEnvironment: ReturnType<typeof $derived<SpatialEnvironment>>;
  };
  
  // Element Management
  elements: {
    register: (id: string, config: ElementConfig) => ElementRunes;
    get: (id: string) => ElementRunes | undefined;
    remove: (id: string) => void;
  };
  
  // Animation Management
  animations: {
    create: (id: string, config: AnimationConfig) => AnimationController;
    get: (id: string) => AnimationController | undefined;
    remove: (id: string) => void;
  };
  
  // Theme Utilities
  utils: {
    getCSSVariable: (name: string) => string;
    setCSSVariable: (name: string, value: string) => void;
    computeThemeValue: <T>(value: T, scale?: number) => T;
    getDerivedValues: () => Record<string, string>;
  };
  
  // Effects
  effects: {
    setupTheme: () => ReturnType<typeof $effect>;
    setupEnvironment: () => ReturnType<typeof $effect>;
    cleanup: () => ReturnType<typeof $effect.root>;
  };
}

// Create Theme Composition
export function createThemeComposition(
  initialConfig: Partial<ThemeConfig> = {}
): ThemeComposition {
  // Initialize state
  const state = {
    config: $state<ThemeConfig>({ ...defaultTheme, ...initialConfig } as ThemeConfig),
    mode: $state<'light' | 'dark' | 'high-contrast'>('light'),
    environment: $state<SpatialEnvironment>('desktop'),
    density: $state<'compact' | 'comfortable' | 'spacious'>('comfortable'),
    scale: $state(1),
    elements: $state(new Map<string, ElementRunes>()),
    animations: $state(new Map<string, AnimationController>()),
    cssVars: $state(new Map<string, string>())
  } satisfies {
    [K in keyof ThemeInstance]: ThemeInstance[K]
  };

  // Create derived values
  const derived = {
    isHighContrast: $derived.by(() => state.mode === 'high-contrast'),
    effectiveScale: $derived.by(() => {
      const baseScale = $state.snapshot(state.scale) ?? 1;
      const density = $state.snapshot(state.density) ?? 'comfortable';
      const densityMultiplier = {
        compact: 0.875,
        comfortable: 1,
        spacious: 1.125
      }[density] ?? 1;
      return baseScale * densityMultiplier;
    }),
    currentEnvironment: $derived.by(() => $state.snapshot(state.environment) ?? 'desktop')
  };

  // Animation management
  const animations = {
    create: (id: string, config: AnimationConfig) => {
      const timing: AnimationTimingConfig = {
        duration: typeof DURATION.normal === 'string' ? DURATION.normal : '300ms',
        easing: typeof EASING.standard === 'string' ? EASING.standard : 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        delay: config.timing?.delay
      };

      const controller = createAnimationController({
        timing,
        keyframes: config.keyframes
      });

      const animationMap = $state.snapshot(state.animations);
      if (animationMap) {
        animationMap.set(id, controller);
      }
      return controller;
    },
    get: (id: string) => {
      const animationMap = $state.snapshot(state.animations);
      return animationMap?.get(id);
    },
    remove: (id: string) => {
      const animationMap = $state.snapshot(state.animations);
      animationMap?.delete(id);
    }
  };

  // Element management
  const elements = {
    register: (id: string, config: ElementConfig) => {
      const element = createElementRunes(config.type);
      const elementMap = $state.snapshot(state.elements);
      if (elementMap) {
        elementMap.set(id, element);
      }
      return element;
    },
    get: (id: string) => {
      const elementMap = $state.snapshot(state.elements);
      return elementMap?.get(id);
    },
    remove: (id: string) => {
      const elementMap = $state.snapshot(state.elements);
      elementMap?.delete(id);
    }
  };

  // Theme utilities
  const utils = {
    getCSSVariable: (name: string) => {
      const vars = $state.snapshot(state.cssVars);
      return vars?.get(name) ?? '';
    },
    setCSSVariable: (name: string, value: string) => {
      const vars = $state.snapshot(state.cssVars);
      if (vars) {
        vars.set(name, value);
      }
    },
    computeThemeValue: <T>(value: T, scale?: number): T => {
      const effectiveScale = scale ?? Number($state.snapshot(derived.effectiveScale)) ?? 1;
      if (typeof value === 'number') {
        return (value * effectiveScale) as T;
      }
      if (typeof value === 'string' && value.endsWith('px')) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          return `${num * effectiveScale}px` as T;
        }
      }
      return value;
    },
    getDerivedValues: () => {
      const vars = $state.snapshot(state.cssVars);
      return Object.fromEntries(vars ?? new Map());
    }
  };

  // Return composed theme
  return {
    state,
    derived: {
      isHighContrast: Boolean($state.snapshot(derived.isHighContrast)),
      effectiveScale: Number($state.snapshot(derived.effectiveScale)) || 1,
      currentEnvironment: $state.snapshot(derived.currentEnvironment) ?? 'desktop'
    },
    elements,
    animations,
    utils,
    effects: {
      setupTheme: () => $effect(() => {
        // Theme setup effect
      }),
      setupEnvironment: () => $effect(() => {
        // Environment setup effect
      }),
      cleanup: () => $effect.root(() => {
        // Cleanup effect
      })
    }
  } satisfies ThemeComposition;
}

// Example Usage:
/*
<script lang="ts">
  import { createThemeComposition } from './ThemeComposition';
  
  // Create theme instance
  const theme = createThemeComposition({
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1'
    }
  });
  
  // Setup theme
  theme.effects.setupTheme();
  theme.effects.setupEnvironment();
  
  // Create themed elements
  const button = theme.elements.register('primary-button', {
    type: 'button',
    base: {
      aria: { role: 'button' },
      keyboard: { focusable: true },
      mouse: { clickable: true },
      gestures: { tap: true }
    }
  });
  
  // Create animations
  const fadeIn = theme.animations.create('fade-in', {
    timing: { duration: '300ms', easing: 'ease-out' }
  });
  
  // Cleanup on destroy
  theme.effects.cleanup();
</script>

<div 
  style={Object.entries(theme.utils.getDerivedValues())
    .map(([key, value]) => `${key}:${value}`)
    .join(';')}
>
  <!-- Your themed content -->
</div>
*/ 
