// /src/lib/components/InputField.types.ts
import type { Snippet } from 'svelte';

/**
 * Types for the Input component
 */

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'outlined' | 'filled';
export type InputState = 'default' | 'success' | 'error';

export interface InputProps {
  /**
   * Label text for the input field
   */
  label?: string;

  /**
   * Current value of the input
   * @default ''
   */
  value?: string;

  /**
   * Type of the input field
   * @default 'text'
   */
  type?: string;

  /**
   * Placeholder text
   * @default ''
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * The size variant of the input
   * @default 'md'
   */
  size?: InputSize;

  /**
   * The visual style variant of the input
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * The current state of the input
   * @default 'default'
   */
  state?: InputState;

  /**
   * Whether the input has glass effect
   * @default true
   */
  glass?: boolean;

  /**
   * Whether the input is elevated
   * @default false
   */
  elevated?: boolean;

  /**
   * Whether the input is required
   * @default false
   */
  required?: boolean;

  /**
   * ARIA label for accessibility
   * If not provided, uses the label text
   */
  ariaLabel?: string;

  /**
   * Callback when input value changes
   */
  onInput?: (value: string) => void;

  /**
   * Callback when input is focused
   */
  onFocus?: () => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: () => void;
}

// Size constants with spatial scaling
export const INPUT_SIZES = {
  sm: {
    height: 'calc(var(--ui-unit) * 2)',
    padding: 'calc(var(--ui-grid) * 2)',
    fontSize: 'sm',
    radius: 'var(--radius-sm)'
  },
  md: {
    height: 'calc(var(--ui-unit) * 2.5)',
    padding: 'calc(var(--ui-grid) * 3)',
    fontSize: 'base',
    radius: 'var(--radius-md)'
  },
  lg: {
    height: 'calc(var(--ui-unit) * 3)',
    padding: 'calc(var(--ui-grid) * 4)',
    fontSize: 'lg',
    radius: 'var(--radius-lg)'
  }
} as const;

// State styles mapping
export const INPUT_STATES = {
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
export const INPUT_VARIANTS = {
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