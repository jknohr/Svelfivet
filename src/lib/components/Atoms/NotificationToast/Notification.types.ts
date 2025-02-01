// /src/lib/components/NotificationToast.types.ts
import type { Snippet } from 'svelte';
import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type NotificationSize = 'sm' | 'md' | 'lg';

export const NOTIFICATION_TYPES = ['info', 'success', 'warning', 'error'] as const;
export const NOTIFICATION_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
export const NOTIFICATION_SIZES = ['sm', 'md', 'lg'] as const;

export interface NotificationToastProps {
  /**
   * Type of the notification
   * @default 'info'
   */
  type?: NotificationType;

  /**
   * Message to display
   */
  message: string;

  /**
   * Duration in milliseconds before auto-dismiss
   * @default 3000
   */
  duration?: number;

  /**
   * Whether the notification is dismissible
   * @default true
   */
  dismissible?: boolean;

  /**
   * Position of the notification
   * @default 'top-right'
   */
  position?: NotificationPosition;

  /**
   * Size of the notification
   * @default 'md'
   */
  size?: NotificationSize;

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
   * Callback when the notification is dismissed
   */
  onDismiss?: () => void;
}

// Size constants
export const NOTIFICATION_SIZE_STYLES = {
  sm: {
    padding: 'var(--space-2)',
    fontSize: 'var(--font-size-sm)',
    iconSize: 'sm',
    maxWidth: '250px'
  },
  md: {
    padding: 'var(--space-3)',
    fontSize: 'var(--font-size-base)',
    iconSize: 'base',
    maxWidth: '300px'
  },
  lg: {
    padding: 'var(--space-4)',
    fontSize: 'var(--font-size-lg)',
    iconSize: 'lg',
    maxWidth: '350px'
  }
} as const;

export interface NotificationPositionStyle {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export const NOTIFICATION_POSITION_STYLES: Record<NotificationPosition, NotificationPositionStyle> = {
  'top-left': {
    top: 'var(--space-4)',
    left: 'var(--space-4)'
  },
  'top-right': {
    top: 'var(--space-4)',
    right: 'var(--space-4)'
  },
  'bottom-left': {
    bottom: 'var(--space-4)',
    left: 'var(--space-4)'
  },
  'bottom-right': {
    bottom: 'var(--space-4)',
    right: 'var(--space-4)'
  }
} as const;