/**
 * Checkbox component types
 */

import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';

export interface CheckboxProps {
  /**
   * Current checked state
   * @default false
   */
  checked?: boolean;

  /**
   * Label text for the checkbox
   */
  label?: string;

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the checkbox is required
   * @default false
   */
  required?: boolean;

  /**
   * Name attribute for the checkbox input
   */
  name?: string;

  /**
   * Value attribute for the checkbox input
   */
  value?: string;

  /**
   * Glass effect variant
   * @default 'light'
   */
  variant?: GlassEffect;

  /**
   * Glass state for visual feedback
   * @default 'default'
   */
  state?: GlassState;

  /**
   * Whether to show a glow effect on hover
   * @default true
   */
  glowOnHover?: boolean;

  /**
   * ARIA label for the checkbox
   */
  ariaLabel?: string;

  /**
   * Callback when checkbox state changes
   */
  onCheckedChange?: (checked: boolean) => void;
} 