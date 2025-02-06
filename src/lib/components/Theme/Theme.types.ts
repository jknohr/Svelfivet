// /home/subtomic/svelfivet/Svelfivet/src/lib/components/Theme/Theme.types.ts

/**
 * Theme system types for Svelfivet
 * Provides type definitions for the theming system, including colors, components, and configuration.
 */

import type { Snippet } from 'svelte';
import type { 
  SpatialAnchorConfig,
  SpatialConfig,
  Density,
  ScaleContext,
  ScalingConstraints
} from '../../types/spatial';

/**
 * Core theme and spatial system type definitions
 */

// Spatial Environment Types
export type SpatialEnvironment = 'default' | 'desktop' | 'mobile' | 'tablet' | 'vr' | 'ar';

export interface SpatialConstraints {
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  padding?: string;
  margin?: string;
  gap?: string;
  perspective?: string;
  elevation?: number;
  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };
}

// Theme Mode
export type ThemeMode = 'light' | 'dark' | 'high-contrast';

// Contrast Theme Names
export const CONTRAST_THEME_NAMES = [
  'Default',
  'Black/White',
  'Yellow/Black',
  'Black/Yellow',
  'Black/Green',
  'Blue/Yellow',
  'Yellow/Blue',
  'Grayscale',
  'Black/Pink',
  'Custom'
] as const;

export type ContrastThemeName = typeof CONTRAST_THEME_NAMES[number];

// Contrast Theme Configuration
export interface ContrastConfig {
  backgroundColor: string;
  textColor: string;
  nodeColor: string;
  edgeColor: string;
}

export interface ContrastThemeProps {
  position?: 'NE' | 'NW' | 'SE' | 'SW';
  availableThemes?: ContrastThemeName[];
  defaultTheme?: ContrastThemeName;
  onThemeChange?: (theme: ContrastThemeName | ContrastConfig) => void;
}



/**
 * Glass Effect System Types
 */

export type GlassEffect = 'light' | 'medium' | 'heavy';
export type GlassState = 'default' | 'focus' | 'attention' | 'error' | 'success';

export interface GlassConfig {
  blur: string;
  opacity: number;
  borderOpacity: number;
  lightEffect: boolean;
  lightIntensity: number;
  lightColor: string;
  tint: string;
  glowRadius: string;
}

export interface GlassEffectConfig {
  base: GlassConfig;
  states: Record<GlassState, Partial<GlassConfig>>;
  variants: Record<GlassEffect, Partial<GlassConfig>>;
}

// Theme System Types
export interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textLight: string;
  textDark: string;
  border: string;
  shadow: string;
  glass: {
    tint: string;
    border: string;
    glow: string;
    shadow: string;
    highlight: string;
    backdrop: string;
  };
  states: {
    focus: string;
    attention: string;
    error: string;
    success: string;
  };
}

export interface TypographyConfig {
  fontFamily: {
    base: string;
    heading: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface NodeConfig {
  background: string;
  borderColor: string;
  borderWidth: string;
  textColor: string;
}

export interface EdgeConfig {
  color: string;
  width: string;
  hoverColor: string;
  selectedColor: string;
}

export interface AnchorConfig {
  size: string;
  color: string;
  hoverColor: string;
  activeColor: string;
}

export interface TooltipConfig {
  background: string;
  textColor: string;
  borderRadius: string;
  padding: string;
}

export interface ControlsConfig {
  background: string;
  border: string;
  text: string;
  icon: string;
  hoverState: {
    background: string;
    border: string;
  };
  activeState: {
    background: string;
  };
}

export interface ComponentConfig {
  node: NodeConfig;
  edge: EdgeConfig;
  anchor: AnchorConfig;
  tooltip: TooltipConfig;
  controls: ControlsConfig;
  glass: GlassConfig;
}

export interface TransitionConfig {
  durationValues: {
    fast: string;
    normal: string;
    slow: string;
  };
  easingValues: {
    standard: string;
    accelerate: string;
    decelerate: string;
    sharp: string;
    linear: string;
  };
}

export interface VirtualizationConfig {
  enabled: boolean;
  overscan: number;
  chunkSize: number;
  scrollThreshold: number;
  measureTimeout: number;
}

export interface ThemeConfig {
  colors: ColorConfig;
  typography: TypographyConfig;
  components: ComponentConfig;
  transitionConfig: TransitionConfig;
  virtualization?: VirtualizationConfig;
  effects: {
    glass: GlassEffectConfig;
    lightingConfig: {
      ambient: string;
      key: string;
      fill: string;
      intensity: number;
      angle: number;
    };
  };
  spatial?: {
    constraints?: Record<SpatialEnvironment, ScalingConstraints>;
    depth?: {
      base: number;
      surface: number;
      floating: number;
      popup: number;
      modal: number;
      overlay: number;
      // Custom depth levels
      custom1: number;
      custom2: number;
      custom3: number;
      custom4: number;
      custom5: number;
      custom6: number;
      custom7: number;
      custom8: number;
      custom9: number;
    };
    space3d?: {
      layerGap: number;
      perspective: string;
      rotation: {
        subtle: number;
        medium: number;
        strong: number;
      };
      elevation: {
        pressed: number;
        default: number;
        raised: number;
        floating: number;
      };
    };
  };
}

// Theme Type
export interface Theme {
  /** Name identifier for the theme */
  name?: string;
  colors: ColorConfig;
  typography: TypographyConfig;
  components: ComponentConfig;
  transitionConfig: TransitionConfig;
  transitions?: TransitionConfig;
  effects: {
    glass: GlassEffectConfig;
    lightingConfig: {
      ambient: string;
      key: string;
      fill: string;
      intensity: number;
      angle: number;
    };
  };
  spatial?: {
    constraints?: Record<SpatialEnvironment, ScalingConstraints>;
  };
  colorScheme: string;
  isDark: boolean;
  custom: {
    primary: string;
    [key: string]: string;
  };
  utils: {
    getCSSVariable: (name: string) => string;
    setCSSVariable: (name: string, value: string) => void;
    getComputedTheme: () => ThemeConfig;
    getDerivedValues: () => Record<string, string>;
  };
}

// Theme Context Type
export interface ThemeContext {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

// Theme Provider Props
export interface ThemeProps {
  mode?: ThemeMode;
  config?: Partial<ThemeConfig>;
  transition?: boolean;
  children?: Snippet;
}

// Theme Snippets
export interface ThemeSnippets {
  header?: Snippet;
  content?: Snippet;
  footer?: Snippet;
}

/**
 * Theme Event System
 */
export type ThemeEventType = 
  | 'theme:change'
  | 'theme:reset'
  | 'density:change'
  | 'environment:change'
  | 'contrast:change'
  | 'glass:register'
  | 'glass:update';

export interface ThemeEventMap {
  'theme:change': { theme: ThemeConfig };
  'theme:reset': undefined;
  'density:change': { density: Density };
  'environment:change': { environment: SpatialEnvironment };
  'contrast:change': { theme: ContrastThemeName | ContrastConfig };
  'glass:register': { id: string; config: GlassConfig };
  'glass:update': { id: string; config: Partial<GlassConfig> };
}

export interface ThemeEvent<T extends ThemeEventType> extends CustomEvent<ThemeEventMap[T]> {
  type: T;
}

/**
 * Unified Theme Context
 */
export interface UnifiedThemeContext extends ThemeContext {
  // Scale and Density Management
  scale: {
    density: Density;
    factor: number;
    setDensity: (density: Density) => void;
    setScale: (scale: number) => void;
  };
  
  // Spatial Configuration
  spatial: {
    environment: SpatialEnvironment;
    setEnvironment: (env: SpatialEnvironment) => void;
    anchor: SpatialAnchorConfig | null;
    updateAnchor: (config: Partial<SpatialAnchorConfig>) => void;
  };
  
  // Glass Effects
  glass: {
    createPane: (config: Partial<GlassConfig>) => GlassConfig;
    updatePane: (id: string, config: Partial<GlassConfig>) => void;
    registerPane: (id: string, config: GlassConfig) => void;
  };
  
  // Typography
  typography: {
    setScale: (scale: number) => void;
    setFontFamily: (family: Partial<Record<keyof TypographyConfig['fontFamily'], string>>) => void;
  };
  
  // Contrast and Accessibility
  contrast: {
    currentTheme: ContrastThemeName;
    setTheme: (theme: ContrastThemeName | ContrastConfig) => void;
    isHighContrast: boolean;
  };
  
  // Theme Utilities
  utils: {
    getCSSVariable: (name: string) => string;
    setCSSVariable: (name: string, value: string) => void;
    getComputedTheme: () => ThemeConfig;
    getDerivedValues: () => Record<string, string>;
  };

  // Event System
  events: {
    on: <T extends ThemeEventType>(
      type: T,
      handler: (event: ThemeEvent<T>) => void
    ) => () => void;
    dispatch: <T extends ThemeEventType>(
      type: T,
      detail: ThemeEventMap[T]
    ) => void;
  };
}

// Base Element Requirements
export interface BaseElementRequirements {
  // Accessibility
  aria: {
    role?: string;
    label?: string;
    description?: string;
    keyboardShortcuts?: string[];
    required?: boolean;
    controls?: string;
    live?: 'off' | 'polite' | 'assertive';
  };

  // Keyboard Navigation
  keyboard: {
    focusable: boolean;
    tabIndex?: number;
    shortcuts?: Record<string, () => void>;
    arrowNavigation?: boolean;
    escapeAction?: () => void;
  };

  // Touch/Gesture Support
  gestures: {
    tap?: boolean;
    doubleTap?: boolean;
    longPress?: boolean;
    swipe?: boolean;
    pinch?: boolean;
    rotate?: boolean;
    multiTouch?: boolean;
  };

  // Mouse Interaction
  mouse: {
    clickable?: boolean;
    draggable?: boolean;
    resizable?: boolean;
    hover?: boolean;
    contextMenu?: boolean;
  };

  // Visual States
  states: {
    default: boolean;
    hover: boolean;
    active: boolean;
    focus: boolean;
    disabled: boolean;
    loading?: boolean;
    error?: boolean;
    success?: boolean;
  };
}