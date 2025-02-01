// /src/lib/components/Image.types.ts
import type { Snippet } from 'svelte';

export interface ImageProps {
  /**
   * Source URL of the image
   */
  src: string;

  /**
   * Alternative text for the image
   */
  alt: string;

  /**
   * Width of the image
   * @default '100%'
   */
  width?: string;

  /**
   * Height of the image
   * @default 'auto'
   */
  height?: string;

  /**
   * Object fit property for the image
   * @default 'cover'
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

  /**
   * Placeholder image URL
   */
  placeholder?: string;

  /**
   * Whether to enable lazy loading
   * @default true
   */
  lazy?: boolean;
}