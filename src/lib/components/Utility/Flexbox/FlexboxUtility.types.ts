import type { SpatialEnvironment, BaseElementRequirements } from '$lib/components/Theme/Theme.types';
import type { Snippet } from 'svelte';

/**
 * Flexbox alignment options
 */
export type FlexAlignment = 
  | 'start' 
  | 'end' 
  | 'center' 
  | 'stretch' 
  | 'space-between' 
  | 'space-around' 
  | 'space-evenly';

export type FlexDirection = 
  | 'row' 
  | 'row-reverse' 
  | 'column' 
  | 'column-reverse';

export type FlexWrap = 
  | 'nowrap' 
  | 'wrap' 
  | 'wrap-reverse';

export type FlexGrow = number | 'auto';
export type FlexShrink = number | 'auto';
export type FlexBasis = string | number | 'auto';

/**
 * Configuration for individual flex items
 */
export interface FlexItemConfig {
  grow?: FlexGrow;
  shrink?: FlexShrink;
  basis?: FlexBasis;
  order?: number;
  alignSelf?: FlexAlignment;
}

/**
 * Spatial configuration for flex container
 */
export interface FlexSpatialConfig {
  depth?: number;
  perspective?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
}

/**
 * Animation configuration for flex transitions
 */
export interface FlexAnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Main props interface for FlexboxUtility component
 */
export interface FlexboxUtilityProps extends BaseElementRequirements {
  // Layout configuration
  direction?: FlexDirection;
  wrap?: FlexWrap;
  justifyContent?: FlexAlignment;
  alignItems?: FlexAlignment;
  alignContent?: FlexAlignment;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;

  // Spatial and environment
  environment?: SpatialEnvironment;
  spatial?: FlexSpatialConfig;
  
  // Responsive behavior
  responsive?: boolean;
  breakpoints?: Record<string, Partial<FlexboxUtilityProps>>;
  
  // Animation and transitions
  animation?: FlexAnimationConfig;
  
  // Item configuration
  items?: FlexItemConfig[];
  defaultItemConfig?: FlexItemConfig;
  
  // Content rendering
  children?: Snippet;
  
  // Events
  onLayoutChange?: (event: FlexLayoutChangeEvent) => void;
  onItemClick?: (event: FlexItemClickEvent) => void;
}

/**
 * Event types for FlexboxUtility
 */
export interface FlexLayoutChangeEvent {
  layout: {
    width: number;
    height: number;
    itemCount: number;
    direction: FlexDirection;
    wrap: FlexWrap;
  };
  breakpoint: string | null;
}

export interface FlexItemClickEvent {
  item: FlexItemConfig;
  index: number;
  element: HTMLElement;
  event: MouseEvent;
}

/**
 * Context interface for nested flex components
 */
export interface FlexContext {
  parentConfig: FlexboxUtilityProps;
  itemConfig?: FlexItemConfig;
  depth: number;
  registerItem: (config: FlexItemConfig) => void;
  unregisterItem: (config: FlexItemConfig) => void;
} 