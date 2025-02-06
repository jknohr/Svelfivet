import type { SpatialAnchorPosition, SpatialConstraints, SpatialEnvironment } from '$lib/types/spatial';

interface SpatialUnitConfig {
  constraints: SpatialConstraints;
  environment: SpatialEnvironment;
  spatialAnchor?: {
    enabled?: boolean;
    position?: SpatialAnchorPosition;
  };
  // Lens specific parameters
  lensDistortion?: {
    k1?: number;  // Radial distortion coefficient 1
    k2?: number;  // Radial distortion coefficient 2
    centerOffset?: { x: number; y: number };  // Optical center offset
  };
  displayParams?: {
    pixelDensity?: number;  // Pixels per unit at center
    panelResolution?: { width: number; height: number };
    physicalDimensions?: { width: number; height: number };
  };
}

/**
 * Calculates the radial distortion factor at a given normalized radius from the optical center
 * Uses the Brown-Conrady distortion model
 */
function calculateRadialDistortion(
  r: number,
  k1: number = 0.1,  // Default mild barrel distortion
  k2: number = 0.05  // Default secondary distortion term
): number {
  // r is the distance from the optical center in normalized coordinates
  return 1 + k1 * r * r + k2 * r * r * r * r;
}

/**
 * Calculates the pixel density at a specific point in the lens view
 * Accounts for both radial distortion and panel characteristics
 */
function calculateLocalPixelDensity(
  normalizedX: number,
  normalizedY: number,
  config: SpatialUnitConfig
): number {
  const { lensDistortion = {}, displayParams = {} } = config;
  const { k1 = 0.1, k2 = 0.05, centerOffset = { x: 0, y: 0 } } = lensDistortion;
  const { pixelDensity = 1 } = displayParams;

  // Calculate distance from optical center (accounting for offset)
  const dx = normalizedX - centerOffset.x;
  const dy = normalizedY - centerOffset.y;
  const r = Math.sqrt(dx * dx + dy * dy);

  // Get the distortion factor at this radius
  const distortionFactor = calculateRadialDistortion(r, k1, k2);

  // Pixel density varies inversely with the distortion factor
  return pixelDensity / distortionFactor;
}

/**
 * Calculate spatial units based on environment and device characteristics,
 * accounting for non-linear lens distortion
 */
export function calculateSpatialUnit(baseValue: number, config: SpatialUnitConfig): number {
  const { environment, constraints, spatialAnchor } = config;
  const isImmersive = environment === 'vr' || environment === 'ar';
  
  if (!isImmersive) return baseValue;

  const {
    viewingAngle = 60,
    minDistance,
    maxDistance
  } = constraints;

  // Get viewer position
  const viewerDistance = spatialAnchor?.position?.z ?? minDistance;
  const viewerX = spatialAnchor?.position?.x ?? 0;
  const viewerY = spatialAnchor?.position?.y ?? 0;

  // Normalize viewer position to [-1, 1] range
  const normalizedX = viewerX / (maxDistance - minDistance);
  const normalizedY = viewerY / (maxDistance - minDistance);

  // Get local pixel density at this point in the view
  const localPixelDensity = calculateLocalPixelDensity(normalizedX, normalizedY, config);

  // Calculate base apparent size
  const fovRadians = (viewingAngle * Math.PI) / 180;
  const apparentSize = 2 * viewerDistance * Math.tan(fovRadians / 2);

  // Apply distance-based scaling
  const distanceScale = Math.min(maxDistance, Math.max(minDistance, viewerDistance)) / minDistance;

  // Final calculation incorporating local pixel density
  return baseValue * apparentSize * distanceScale * localPixelDensity;
}

/**
 * Calculate spatial transform for grid positioning
 * @param gridId Grid identifier
 * @param spatialAnchor Spatial anchor configuration
 * @returns CSS transform string
 */
export function calculateSpatialTransform(
  gridId: string,
  spatialAnchor?: { enabled?: boolean; position?: SpatialAnchorPosition }
): string {
  if (!spatialAnchor?.enabled) return '';

  const { position } = spatialAnchor;
  if (!position) return '';

  const { x = 0, y = 0, z = 0, rotation } = position;
  const rotateX = rotation?.x ?? 0;
  const rotateY = rotation?.y ?? 0;
  const rotateZ = rotation?.z ?? 0;

  const transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
  
  // Update CSS variable for the specific grid
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty(`--spatial-transform-${gridId}`, transform);
  }

  return transform;
}
