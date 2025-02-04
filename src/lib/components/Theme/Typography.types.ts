/**
 * Typography Types
 */

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
export type TextWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type TextDecoration = 'none' | 'underline' | 'line-through';
export type TextOverflow = 'clip' | 'ellipsis' | 'fade';
export type TextWrap = 'normal' | 'nowrap' | 'balance' | 'pretty';

export interface TypographyConfig {
  /**
   * Text size
   * @default 'base'
   */
  size?: TextSize;

  /**
   * Font weight
   * @default 'normal'
   */
  weight?: TextWeight;

  /**
   * Text color
   * @default 'inherit'
   */
  color?: string;

  /**
   * Text alignment
   * @default 'left'
   */
  align?: TextAlign;

  /**
   * Text transformation
   * @default 'none'
   */
  transform?: TextTransform;

  /**
   * Text decoration
   * @default 'none'
   */
  decoration?: TextDecoration;

  /**
   * Font family configuration
   */
  fontFamily?: {
    /**
     * Primary font family
     * @default 'system-ui'
     */
    primary?: string;
    /**
     * Secondary font family
     * @default 'system-ui'
     */
    secondary?: string;
    /**
     * Monospace font family
     * @default 'monospace'
     */
    mono?: string;
  };

  /**
   * Text overflow handling
   * @default 'clip'
   */
  overflow?: TextOverflow;

  /**
   * Text wrapping
   * @default 'normal'
   */
  wrap?: TextWrap;

  /**
   * Maximum number of lines before truncating
   * @optional
   */
  maxLines?: number;

  /**
   * Whether to enable ligatures
   * @default false
   */
  ligatures?: boolean;

  /**
   * Whether to enable kerning
   * @default true
   */
  kerning?: boolean;

  /**
   * Font feature settings
   * @optional
   */
  features?: string;

  /**
   * Font variation settings
   * @optional
   */
  variations?: string;
} 