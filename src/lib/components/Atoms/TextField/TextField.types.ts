// /src/lib/components/TextField.types.ts
import type { Snippet } from 'svelte';

/**
 * Types for the TextField component
 */

export type TextFieldSize = 'sm' | 'md' | 'lg';
export type TextFieldVariant = 'default' | 'outlined' | 'filled';
export type TextFieldState = 'default' | 'success' | 'error';

export interface TextFieldProps {
  /**
   * Label text for the textarea
   */
  label?: string;

  /**
   * Current value of the textarea
   * @default ''
   */
  value?: string;

  /**
   * Placeholder text
   * @default ''
   */
  placeholder?: string;

  /**
   * Icon to display inside the textarea
   */
  icon?: string;

  /**
   * Whether the textarea is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the textarea is readonly
   * @default false
   */
  readonly?: boolean;

  /**
   * Whether the textarea is required
   * @default false
   */
  required?: boolean;

  /**
   * The size variant of the textarea
   * @default 'md'
   */
  size?: TextFieldSize;

  /**
   * The visual style variant of the textarea
   * @default 'default'
   */
  variant?: TextFieldVariant;

  /**
   * The current state of the textarea
   * @default 'default'
   */
  state?: TextFieldState;

  /**
   * Whether the textarea has glass effect
   * @default true
   */
  glass?: boolean;

  /**
   * Whether the textarea is elevated
   * @default false
   */
  elevated?: boolean;

  /**
   * ARIA label for accessibility
   * If not provided, uses the label text
   */
  ariaLabel?: string;

  /**
   * Callback when textarea value changes
   */
  onInput?: (value: string) => void;

  /**
   * Callback when textarea is focused
   */
  onFocus?: () => void;

  /**
   * Callback when textarea loses focus
   */
  onBlur?: () => void;
}

// Size constants with spatial scaling
export const TEXTFIELD_SIZES = {
  sm: {
    height: 'calc(var(--ui-unit) * 4)',
    padding: 'calc(var(--ui-grid) * 2)',
    fontSize: 'sm',
    radius: 'var(--radius-sm)'
  },
  md: {
    height: 'calc(var(--ui-unit) * 6)',
    padding: 'calc(var(--ui-grid) * 3)',
    fontSize: 'base',
    radius: 'var(--radius-md)'
  },
  lg: {
    height: 'calc(var(--ui-unit) * 8)',
    padding: 'calc(var(--ui-grid) * 4)',
    fontSize: 'lg',
    radius: 'var(--radius-lg)'
  }
} as const;

// State styles mapping
export const TEXTFIELD_STATES = {
  default: {
    opacity: '1',
    borderColor: 'var(--color-border)'
  },
  success: {
    opacity: '1',
    borderColor: 'var(--color-success)'
  },
  error: {
    opacity: '1',
    borderColor: 'var(--color-error)'
  }
} as const;

// Variant theme mappings
export const TEXTFIELD_VARIANTS = {
  default: {
    background: 'transparent',
    borderColor: 'var(--color-border)',
    hover: 'var(--color-surface-hover)',
    focus: 'var(--color-surface-focus)'
  },
  outlined: {
    background: 'transparent',
    borderColor: 'var(--color-border)',
    hover: 'var(--color-surface-hover)',
    focus: 'var(--color-surface-focus)'
  },
  filled: {
    background: 'var(--color-surface-variant)',
    borderColor: 'transparent',
    hover: 'var(--color-surface-hover)',
    focus: 'var(--color-surface-focus)'
  }
} as const;