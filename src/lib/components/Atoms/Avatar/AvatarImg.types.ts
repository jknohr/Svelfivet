/**
 * Types for the AvatarImg component
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'rounded' | 'circular';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarImgProps {
  /**
   * The source URL of the avatar image
   */
  src?: string;

  /**
   * Alternative text for the avatar image
   */
  alt?: string;

  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Visual style variant of the avatar
   * @default 'rounded'
   */
  variant?: AvatarVariant;

  /**
   * Initials to display when image is not available
   * If not provided, will be generated from alt text
   */
  initials?: string;

  /**
   * Online status indicator
   */
  status?: AvatarStatus;

  /**
   * Whether to show a border around the avatar
   * @default false
   */
  border?: boolean;

  /**
   * Whether to show a shadow effect
   * @default false
   */
  shadow?: boolean;
}

// Size constants
export const AVATAR_SIZES = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '64px'
} as const;

// Font size mappings
export const AVATAR_FONT_SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'base',
  lg: 'lg',
  xl: 'xl'
} as const;

// Status colors
export const AVATAR_STATUS_COLORS = {
  online: 'rgb(34, 197, 94)',  // green
  offline: 'rgb(156, 163, 175)', // gray
  away: 'rgb(234, 179, 8)',    // yellow
  busy: 'rgb(239, 68, 68)'     // red
} as const;
