/**
 * Spatial design system constants
 * Defines base units and measurements for consistent spacing and layout
 */

import { ENVIRONMENT_GRID_CONSTRAINTS } from './configs/gridConstraints';

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

export const VIRTUALIZATION = {
  desktop: {
    CHUNK_SIZE: 20,
    BUFFER_SCREENS: 1.5,
    UPDATE_THROTTLE: 16,
    MIN_ITEM_HEIGHT: 50,
    MEASURE_TIMEOUT: 100
  },
  tablet: {
    CHUNK_SIZE: 18,
    BUFFER_SCREENS: 1.25,
    UPDATE_THROTTLE: 24,
    MIN_ITEM_HEIGHT: 60,
    MEASURE_TIMEOUT: 120
  },
  vr: {
    CHUNK_SIZE: 12,        // Smaller chunks for better VR performance
    BUFFER_SCREENS: 2,     // Larger buffer for smooth VR movement
    UPDATE_THROTTLE: 8,    // Faster updates for VR (120fps)
    MIN_ITEM_HEIGHT: 100,  // Larger items in VR
    MEASURE_TIMEOUT: 50    // Faster measurement for responsiveness
  },
  ar: {
    CHUNK_SIZE: 8,         // Smallest chunks for AR performance
    BUFFER_SCREENS: 2.5,   // Largest buffer for AR freedom of movement
    UPDATE_THROTTLE: 8,    // Fast updates for AR
    MIN_ITEM_HEIGHT: 75,   // Medium items for AR
    MEASURE_TIMEOUT: 50    // Fast measurement for AR
  },
  mobile: {
    CHUNK_SIZE: 15,        // Medium chunks for mobile
    BUFFER_SCREENS: 1,     // Smaller buffer for mobile memory
    UPDATE_THROTTLE: 32,   // Slower updates for mobile battery
    MIN_ITEM_HEIGHT: 40,   // Smaller items for mobile
    MEASURE_TIMEOUT: 150   // Longer timeout for mobile performance
  }
} as const;

// Re-export grid constraints
export { ENVIRONMENT_GRID_CONSTRAINTS };