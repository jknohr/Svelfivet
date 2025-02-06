// /src/lib/components/Image.types.ts
import type { Snippet } from 'svelte';

export interface ImageProps {
  /**
   * Source URL of the image
   */
  src?: string;

  /**
   * Alternative text for the image
   */
  alt?: string;

  ariaLabel?: string;

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

export interface ExpandedTags {
  file?: {
    'FileType'?: 'TIFF' | 'JPEG' | 'PNG' | 'HEIC' | 'AVIF' | 'WebP' | 'GIF';
    'Bits Per Sample'?: { description: string; value: number };
    'Image Height'?: { description: string; value: number };
    'Image Width'?: { description: string; value: number };
    'Color Components'?: { description: string; value: number };
    'Subsampling'?: { description: string; value: number[] };
  };
  exif?: {
    'ImageDescription'?: { id: number; description: string; value: string[] };
    'Make'?: { id: number; description: string; value: string[] };
    'Model'?: { id: number; description: string; value: string[] };
    'Software'?: { id: number; description: string; value: string[] };
    'ModifyDate'?: { id: number; description: string; value: string[] };
    'AltTextAccessibility'?: { scene?: string; value?: string };
    'Scene'?: { scene?: string; value?: string };
    [key: string]: { id?: number; description: string; value: any } | undefined;
  };
  xmp?: {
    _raw: string;
    [key: string]: any;
  };
  iptc?: {
    [key: string]: { id: number; description: string; value: any };
  };
  icc?: {
    [key: string]: { description: string; value: string };
  };
}