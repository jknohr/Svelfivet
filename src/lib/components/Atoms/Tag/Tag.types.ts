// /src/lib/components/Tag.types.ts
import type { Snippet } from 'svelte';

export interface TagProps {
  /**
   * Label for the tag
   */
  label: string;

  /**
   * Color of the tag
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';

  /**
   * Whether the tag is removable
   * @default false
   */
  removable?: boolean;

  /**
   * Callback when the tag is removed
   */
  onRemove?: () => void;
}