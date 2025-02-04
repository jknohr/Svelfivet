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
  Advisory?: string | null;
  Author?: string | null;
  BaseURL?: string | null;
  CreateDate?: Date | null;
  CreatorTool?: string | null;
  Description?: string | null;
  Format?: string | null;
  Identifier?: string | null;
  Keywords?: string | null;
  Label?: string | null;
  MetadataDate?: Date | null;
  ModifyDate?: Date | null;
  Nickname?: string | null;
  Rating?: number | null;
  RatingPercent?: number | null;
  Thumbnails?: {
    Format?: string | null;
    Height?: number | null;
    URL?: string | null;
    Width?: number | null;
  } | null;
  
    Title?: string | null;
    CreatorCity?: string | null;
    CreatorCountry?: string | null;
    CreatorAddress?: string | null;
    CreatorPostalCode?: string | null;
    CreatorRegion?: string | null;
    CreatorWorkEmail?: string | null;
    CreatorWorkTelephone?: string | null;
    CreatorWorkURL?: string | null;
    Location?: string | null;
    Scene?: string | null;
    SubjectCode?: string | null;
    XMP?: {
        Rating?: number | null;
        Label?: string | null;
        Title?: string | null;
        Description?: string | null;
        CreatorTool?: string | null;
        MetadataDate?: Date | null;
        ModifyDate?: Date | null;
    } | null;
}