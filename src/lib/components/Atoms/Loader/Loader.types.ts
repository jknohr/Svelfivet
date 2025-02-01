/**
 * Types for the Loader component
 */

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderVariant = 'primary' | 'secondary' | 'surface' | 'current';
export type LoaderStyle = 'circle' | 'dots';

export interface LoaderProps {
  /**
   * Size of the loader
   * @default 'md'
   */
  size?: LoaderSize;

  /**
   * Visual style variant
   * @default 'primary'
   */
  variant?: LoaderVariant;

  /**
   * Animation style
   * @default 'circle'
   */
  style?: LoaderStyle;

  /**
   * ARIA label for accessibility
   * @default 'Loading...'
   */
  ariaLabel?: string;
}

// Size constants with spatial scaling
export const LOADER_SIZES = {
  xs: {
    size: 'calc(var(--ui-unit) * 0.75)',
    border: 'calc(var(--ui-grid) * 0.25)',
    dot: 'calc(var(--ui-grid) * 0.75)',
    gap: 'calc(var(--ui-grid) * 0.5)'
  },
  sm: {
    size: 'calc(var(--ui-unit) * 1)',
    border: 'calc(var(--ui-grid) * 0.375)',
    dot: 'calc(var(--ui-grid))',
    gap: 'calc(var(--ui-grid) * 0.75)'
  },
  md: {
    size: 'calc(var(--ui-unit) * 1.5)',
    border: 'calc(var(--ui-grid) * 0.5)',
    dot: 'calc(var(--ui-grid) * 1.5)',
    gap: 'calc(var(--ui-grid))'
  },
  lg: {
    size: 'calc(var(--ui-unit) * 2)',
    border: 'calc(var(--ui-grid) * 0.75)',
    dot: 'calc(var(--ui-grid) * 2)',
    gap: 'calc(var(--ui-grid) * 1.5)'
  },
  xl: {
    size: 'calc(var(--ui-unit) * 3)',
    border: 'calc(var(--ui-grid))',
    dot: 'calc(var(--ui-grid) * 3)',
    gap: 'calc(var(--ui-grid) * 2)'
  }
} as const;

// Variant color mappings
export const LOADER_VARIANTS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  surface: 'var(--color-surface)',
  current: 'currentColor'
} as const; 
