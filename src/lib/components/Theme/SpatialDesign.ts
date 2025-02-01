/**
 * Spatial design system constants
 * Defines base units and measurements for consistent spacing and layout
 */

export const BASE = {
  UNIT: 16, // Base unit in pixels
  XXS: 4,   // 0.25x
  XS: 8,    // 0.5x
  S: 12,    // 0.75x
  M: 16,    // 1x
  L: 24,    // 1.5x
  XL: 32,   // 2x
  XXL: 48   // 3x
} as const;

export const SPACE_3D = {
  LAYER_GAP: 8,      // Gap between layers in 3D space
  PERSPECTIVE: '1000px',
  ROTATION: {
    SUBTLE: 2,       // Subtle rotation in degrees
    MEDIUM: 5,       // Medium rotation in degrees
    STRONG: 10       // Strong rotation in degrees
  },
  ELEVATION: {
    PRESSED: -2,     // Pressed state (negative elevation)
    DEFAULT: 0,      // Default state (no elevation)
    RAISED: 2,       // Raised state (slight elevation)
    FLOATING: 8      // Floating state (high elevation)
  }
} as const; 