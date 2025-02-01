// /src/lib/components/Icon.types.ts
import type { Snippet } from 'svelte';

export interface IconProps {
  /**
   * Name of the icon (e.g., 'add', 'delete')
   */
  name: string;

  /**
   * Size of the icon (e.g., '24px', '2rem')
   * @default '24px'
   */
  size?: string;

  /**
   * Weight of the icon ('light', 'regular', 'medium', 'bold')
   * @default 'regular'
   */
  weight?: 'light' | 'regular' | 'medium' | 'bold';

  /**
   * Fill value for the icon (0-1)
   * @default 'currentColor'
   */
  fill?: number | string;

  /**
   * Grade value for the icon (e.g., 0, 200)
   * @default 0
   */
  grade?: number;

  /**
   * Opacity of the icon (0-1)
   * @default 1
   */
  opacity?: number;

  /**
   * Additional style properties for the icon
   * @default {}
   */
  style?: Record<string, string | number>;
}