/**
 * Types for the Button component
 */

import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';
import type { ElementType } from '$lib/components/Theme/ThemeElements';
import type { CSSColorString } from '$lib/components/Templates/Canvas/types/general';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
export type ButtonShape = 'round' | 'square' | 'pill' | 'default';
export type ButtonVariant = GlassEffect;
export type ButtonState = 'default' | 'hover' | 'active' | 'loading' | 'success' | 'error' | 'disabled';
export type ButtonType = 'button' | 'submit' | 'reset';
export type AttentionState = 'none' | 'pulse' | 'shake' | 'bounce' | 'flash';

export interface ButtonDimensions {
  width?: string;
  height?: string;
  radius?: string;
  padding?: string;
}

export interface ButtonConfig {
  /**
   * The button's label text or content
   */
  label: string;

  /**
   * The type of button
   * @default 'button'
   */
  type?: ButtonType;

  /**
   * The size variant of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * The shape variant of the button
   * @default 'default'
   */
  shape?: ButtonShape;

  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * The current state of the button
   * @default 'default'
   */
  state?: ButtonState;

  /**
   * Whether to show a loading spinner
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the button has a glass effect
   * @default true
   */
  glowOnHover?: boolean;

  /**
   * Whether the button is elevated
   * @default false
   */
  elevated?: boolean;

  /**
   * ARIA label for accessibility
   * If not provided, uses the label text
   */
  ariaLabel?: string;

  /**
   * Component type for theme system
   * @default 'button'
   */
  componentType?: ElementType;

  /**
   * Icon component to display
   * @optional
   */
  icon?: any;

  /**
   * Position of the icon
   * @default 'left'
   */
  iconPosition?: 'left' | 'right' | 'center';

  /**
   * Custom color tint
   * @optional
   */
  tint?: CSSColorString;

  /**
   * Whether to show dissolve animation on click
   * @default false
   */
  dissolveOnClick?: boolean;

  /**
   * Attention state for the button
   * @default 'none'
   */
  attention?: AttentionState;

  /**
   * Dimensions for the button
   * @optional
   */
  dimensions?: ButtonDimensions;
}

interface ButtonStateStyle {
  opacity: string;
  cursor: string;
  transform: string;
  glow: number;
}

interface ButtonSizeStyle {
  height: string;
  padding: string;
  fontSize: string;
  radius: string;
  depth: string;
  glow: string;
}

interface ButtonShapeStyle {
  radius: string;
  padding: string;
  aspectRatio?: string;
}

export const BUTTON_STATES: Record<ButtonState, ButtonStateStyle> = {
  default: {
    opacity: '1',
    cursor: 'pointer',
    transform: 'scale(1)',
    glow: 0
  },
  hover: {
    opacity: '1',
    cursor: 'pointer',
    transform: 'scale(1.02)',
    glow: 1
  },
  active: {
    opacity: '0.9',
    cursor: 'pointer',
    transform: 'scale(0.98)',
    glow: 0.5
  },
  loading: {
    opacity: '0.8',
    cursor: 'wait',
    transform: 'scale(1)',
    glow: 0
  },
  success: {
    opacity: '1',
    cursor: 'default',
    transform: 'scale(1)',
    glow: 0.8
  },
  error: {
    opacity: '1',
    cursor: 'not-allowed',
    transform: 'scale(1)',
    glow: 0.8
  },
  disabled: {
    opacity: '0.5',
    cursor: 'not-allowed',
    transform: 'scale(1)',
    glow: 0
  }
} as const;

export const BUTTON_SIZES: Record<ButtonSize, ButtonSizeStyle> = {
  xs: {
    height: 'calc(var(--ui-unit) * 1.5)',
    padding: '0 calc(var(--ui-grid) * 2)',
    fontSize: 'xs',
    radius: 'var(--radius-sm)',
    depth: 'var(--depth-button-xs)',
    glow: '0 0 calc(var(--ui-unit) * 0.5)'
  },
  sm: {
    height: 'calc(var(--ui-unit) * 2)',
    padding: '0 calc(var(--ui-grid) * 3)',
    fontSize: 'sm',
    radius: 'var(--radius-sm)',
    depth: 'var(--depth-button-sm)',
    glow: '0 0 calc(var(--ui-unit) * 0.75)'
  },
  md: {
    height: 'calc(var(--ui-unit) * 2.5)',
    padding: '0 calc(var(--ui-grid) * 4)',
    fontSize: 'base',
    radius: 'var(--radius-md)',
    depth: 'var(--depth-button-md)',
    glow: '0 0 var(--ui-unit)'
  },
  lg: {
    height: 'calc(var(--ui-unit) * 3)',
    padding: '0 calc(var(--ui-grid) * 5)',
    fontSize: 'lg',
    radius: 'var(--radius-md)',
    depth: 'var(--depth-button-lg)',
    glow: '0 0 calc(var(--ui-unit) * 1.25)'
  },
  xl: {
    height: 'calc(var(--ui-unit) * 3.5)',
    padding: '0 calc(var(--ui-grid) * 6)',
    fontSize: 'xl',
    radius: 'var(--radius-lg)',
    depth: 'var(--depth-button-xl)',
    glow: '0 0 calc(var(--ui-unit) * 1.5)'
  },
  custom: {
    height: 'auto',
    padding: '0',
    fontSize: 'inherit',
    radius: 'inherit',
    depth: 'var(--depth-button)',
    glow: '0 0 var(--ui-unit)'
  }
} as const;

export const BUTTON_SHAPES: Record<ButtonShape, ButtonShapeStyle> = {
  round: {
    aspectRatio: '1/1',
    radius: '50%',
    padding: '0'
  },
  square: {
    aspectRatio: '1/1',
    radius: 'var(--radius-sm)',
    padding: '0'
  },
  pill: {
    radius: '9999px',
    padding: '0 calc(var(--ui-grid) * 4)'
  },
  default: {
    radius: 'var(--radius-md)',
    padding: '0 calc(var(--ui-grid) * 4)'
  }
} as const;

// Attention state animations
export const ATTENTION_ANIMATIONS = {
  none: '',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
  bounce: 'bounce 1s infinite',
  flash: 'flash 1s infinite'
} as const;

// Spatial constants
export const BUTTON_SPATIAL = {
  ar: {
    transform: 'translateZ(var(--depth-button))',
    hover: 'translateZ(calc(var(--depth-button) * 1.2))',
    active: 'translateZ(calc(var(--depth-button) * 0.8))'
  },
  vr: {
    transform: 'translateZ(var(--depth-ui))',
    hover: 'translateZ(calc(var(--depth-ui) * 1.2))',
    active: 'translateZ(calc(var(--depth-ui) * 0.8))'
  }
} as const;
