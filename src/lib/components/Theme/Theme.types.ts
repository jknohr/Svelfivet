// /home/subtomic/svelfivet/Svelfivet/src/lib/components/Theme/Theme.types.ts

/**
 * Theme system types for Svelfivet
 * Provides type definitions for the theming system, including colors, components, and configuration.
 */

import type { Snippet } from 'svelte';

/**
 * Core theme and spatial system type definitions
 */

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

// Spatial System Types
export type Density = 'compact' | 'comfortable' | 'spacious';

export interface ScaleContext {
  density: Density;
  scale: number;
  baseUnit: number;
  gridUnit: number;
  spaceUnit: number;
}

/**
 * Spatial Anchor System Types
 */

// Spatial Environment Type
export type SpatialEnvironment = 'desktop' | 'ar' | 'vr' | 'mixed';

// Spatial Anchor Position
export interface SpatialAnchorPosition {
  x: number;
  y: number;
  z: number;
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
}

// Spatial Bounds
export interface SpatialBounds {
  width: number;
  height: number;
  depth: number;
}

// Environment Constraints
export interface EnvironmentConstraints {
  minScale: number;
  maxScale: number;
  minDistance: number;
  maxDistance: number;
  viewingAngle: number;
}

// Spatial Anchor Configuration
export interface SpatialAnchorConfig {
  enabled: boolean;
  position?: SpatialAnchorPosition;
  bounds?: SpatialBounds;
  constraints?: EnvironmentConstraints;
  adaptiveScaling?: boolean;
  followUser?: boolean;
  collisionDetection?: boolean;
}

export interface SpatialConstraints {
  minScale: number;
  maxScale: number;
  minDistance?: number;
  maxDistance?: number;
  viewingAngle?: number;
}

export interface SpatialRatios {
  phi: number;
  minor: number;
  major: number;
}

export interface SpatialConfig {
  base: {
    unit: number;
    scale: number;
  };
  ratios: SpatialRatios;
  constraints: Record<SpatialEnvironment, SpatialConstraints>;
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

export interface ComponentConfig {
  node: NodeConfig;
  edge: EdgeConfig;
  anchor: AnchorConfig;
  tooltip: TooltipConfig;
  glass: {
    blur: string;
    opacity: number;
    borderOpacity: number;
    lightEffect: boolean;
    lightIntensity: number;
  };
}

export interface TransitionConfig {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    standard: string;
    accelerate: string;
    decelerate: string;
    sharp: string;
    linear: string;
  };
}

export interface ThemeConfig {
  colors: ColorConfig;
  typography: TypographyConfig;
  components: ComponentConfig;
  transitions: TransitionConfig;
  spatial: SpatialConfig;
  effects: {
    glass: GlassEffectConfig;
    lighting: {
      ambient: string;
      key: string;
      fill: string;
      intensity: number;
      angle: number;
    };
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