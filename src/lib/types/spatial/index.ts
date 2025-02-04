/**
 * Spatial System Types
 * Contains type definitions for spatial environments, anchors, and related configurations.
 */

// Spatial Environment Type
export type SpatialEnvironment = 'default' | 'desktop' | 'mobile' | 'tablet' | 'vr' | 'ar';

// Density Type
export type Density = 'compact' | 'comfortable' | 'spacious';

// Scale Context
export interface ScaleContext {
  density: Density;
  factor: number;
  setDensity: (density: Density) => void;
  setScale: (scale: number) => void;
}

// Spatial Anchor Position
export interface SpatialAnchorPosition {
  x: number;
  y: number;
  z: number;
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
}

// Spatial Bounds
export interface SpatialBounds {
  width: number;
  height: number;
  depth: number;
}

// Environment Constraints
export interface EnvironmentConstraints {
  minScale: number;
  maxScale: number;
  minDistance: number;
  maxDistance: number;
  viewingAngle: number;
}

// Spatial Anchor Configuration
export interface SpatialAnchorConfig {
  enabled: boolean;
  position?: SpatialAnchorPosition;
  bounds?: SpatialBounds;
  constraints?: EnvironmentConstraints;
  adaptiveScaling?: boolean;
  followUser?: boolean;
  collisionDetection?: boolean;
}

// Spatial Constraints
export interface SpatialConstraints {
  minScale: number;
  maxScale: number;
  minDistance?: number;
  maxDistance?: number;
  viewingAngle?: number;
}

// Spatial Ratios
export interface SpatialRatios {
  phi: number;
  minor: number;
  major: number;
}

// Spatial Configuration
export interface SpatialConfig {
  base: {
    unit: number;
    scale: number;
  };
  ratios: SpatialRatios;
  constraints: Record<SpatialEnvironment, SpatialConstraints>;
}
