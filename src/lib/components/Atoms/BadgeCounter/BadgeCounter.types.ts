/**
 * Types for the BadgeCounter component
 */

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BadgeCounterProps {
  /**
   * The numeric value to display
   */
  count: number;

  /**
   * Maximum value to display before showing a + suffix
   * @default 99
   */
  max?: number;

  /**
   * Size of the badge
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Visual style variant of the badge
   * @default 'primary'
   */
  variant?: BadgeVariant;

  /**
   * Position of the badge when used as an overlay
   * @default 'top-right'
   */
  position?: BadgePosition;

  /**
   * Whether to pulse when the value changes
   * @default true
   */
  pulse?: boolean;

  /**
   * Whether to show zero values
   * @default false
   */
  showZero?: boolean;
}

// Size constants
export const BADGE_SIZES = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '28px',
  xl: '32px'
} as const;

// Font size mappings
export const BADGE_FONT_SIZES = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
  xl: 'base'
} as const;

// Position offsets
export const BADGE_POSITIONS = {
  'top-right': { top: '-25%', right: '-25%' },
  'top-left': { top: '-25%', left: '-25%' },
  'bottom-right': { bottom: '-25%', right: '-25%' },
  'bottom-left': { bottom: '-25%', left: '-25%' }
} as const;

// Variant colors (using theme variables)
export const BADGE_VARIANTS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  success: 'var(--color-states-success)',
  warning: 'var(--color-states-attention)',
  error: 'var(--color-states-error)',
  info: 'var(--color-accent)'
} as const;
