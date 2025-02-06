import type { 
  SpatialAnchorConfig, 
  SpatialAnchorPosition, 
  SpatialBounds, 
  EnvironmentConstraints,
  SpatialConstraints
} from '$lib/types/spatial';

/**
 * OpenXR Spatial Understanding Types
 */
export interface SpatialMesh {
  vertices: Float32Array;
  indices: Uint32Array;
  normals?: Float32Array;
  confidence: number;
  timestamp: number;
  id: string;
}

export interface RoomBoundary {
  center: SpatialAnchorPosition;
  dimensions: SpatialBounds;
  orientation: { x: number; y: number; z: number; w: number };
  confidence: number;
  timestamp: number;
}

export interface SpatialUnderstandingConfig {
  enabled: boolean;
  meshTracking: boolean;
  boundaryTracking: boolean;
  semanticLabeling: boolean;
  minConfidence: number;
  updateInterval: number; // ms
  maxMeshes: number;
  meshSimplification: number; // 0-1
  occlusionEnabled: boolean;
}

export interface RoomBoundaryConfig {
  enabled: boolean;
  visible: boolean;
  mode: 'static' | 'dynamic' | 'hybrid';
  updateInterval: number; // ms
  minConfidence: number;
  boundaryMargin: number; // meters
  warningDistance: number; // meters
  safetyMargin: number; // meters
}


/**
 * Default configurations for OpenXR spatial understanding
 */
export const defaultSpatialUnderstandingConfig: SpatialUnderstandingConfig = {
  enabled: true,
  meshTracking: true,
  boundaryTracking: true,
  semanticLabeling: true,
  minConfidence: 0.7,
  updateInterval: 500,
  maxMeshes: 1000,
  meshSimplification: 0.5,
  occlusionEnabled: true
};

/**
 * Default configurations for room boundary system
 */
export const defaultRoomBoundaryConfig: RoomBoundaryConfig = {
  enabled: true,
  visible: true,
  mode: 'hybrid',
  updateInterval: 200,
  minConfidence: 0.8,
  boundaryMargin: 0.5,
  warningDistance: 1.0,
  safetyMargin: 0.3
};

/**
 * Default spatial constraints configuration
 */
export const defaultSpatialConstraints: SpatialConstraints = {
  minScale: 0.5,
  maxScale: 2.0,
  minDistance: 0.3,
  maxDistance: 5.0,
  viewingAngle: 45
};

/**
 * Default spatial anchor configuration
 * Provides sensible defaults for spatial anchoring in different environments
 */
export const defaultSpatialAnchorConfig = {
  enabled: true,
  position: {
    x: 0,
    y: 0,
    z: 0,
    rotation: {
      x: 0,
      y: 0,
      z: 0
    }
  },
  bounds: {
    width: 100,
    height: 100,
    depth: 100
  },
  constraints: defaultSpatialConstraints,
  adaptiveScaling: true,
  followUser: false,
  collisionDetection: true
};

/**
 * Creates a spatial anchor configuration with custom overrides
 * @param overrides - Partial configuration to override defaults
 * @returns Complete spatial anchor configuration
 */
export function createSpatialAnchorConfig(overrides?: Partial<SpatialAnchorConfig>): SpatialAnchorConfig {
  const defaultPosition = defaultSpatialAnchorConfig.position ?? { x: 0, y: 0, z: 0, rotation: { x: 0, y: 0, z: 0 } };
  
  return {
    enabled: overrides?.enabled ?? defaultSpatialAnchorConfig.enabled,
    position: {
      x: overrides?.position?.x ?? defaultPosition.x,
      y: overrides?.position?.y ?? defaultPosition.y,
      z: overrides?.position?.z ?? defaultPosition.z,
      rotation: {
        x: overrides?.position?.rotation?.x ?? defaultPosition.rotation?.x ?? 0,
        y: overrides?.position?.rotation?.y ?? defaultPosition.rotation?.y ?? 0,
        z: overrides?.position?.rotation?.z ?? defaultPosition.rotation?.z ?? 0
      }
    },
    bounds: {
      width: overrides?.bounds?.width ?? defaultSpatialAnchorConfig.bounds?.width ?? 100,
      height: overrides?.bounds?.height ?? defaultSpatialAnchorConfig.bounds?.height ?? 100,
      depth: overrides?.bounds?.depth ?? defaultSpatialAnchorConfig.bounds?.depth ?? 100
    },
    constraints: {
      minScale: overrides?.constraints?.minScale ?? defaultSpatialAnchorConfig.constraints?.minScale ?? 0.5,
      maxScale: overrides?.constraints?.maxScale ?? defaultSpatialAnchorConfig.constraints?.maxScale ?? 2.0,
      minDistance: overrides?.constraints?.minDistance ?? defaultSpatialAnchorConfig.constraints?.minDistance ?? 0.3,
      maxDistance: overrides?.constraints?.maxDistance ?? defaultSpatialAnchorConfig.constraints?.maxDistance ?? 5.0,
      viewingAngle: overrides?.constraints?.viewingAngle ?? defaultSpatialAnchorConfig.constraints?.viewingAngle ?? 45
    },
    adaptiveScaling: overrides?.adaptiveScaling ?? defaultSpatialAnchorConfig.adaptiveScaling ?? true,
    followUser: overrides?.followUser ?? defaultSpatialAnchorConfig.followUser ?? false,
    collisionDetection: overrides?.collisionDetection ?? defaultSpatialAnchorConfig.collisionDetection ?? true
  };
}

/**
 * Environment-specific spatial anchor configurations
 */
export interface EnvironmentSpatialConfig {
  anchor: SpatialAnchorConfig;
  understanding: SpatialUnderstandingConfig;
  boundary: RoomBoundaryConfig;
  constraints: SpatialConstraints;
}

export const environmentConfigs: Record<'desktop' | 'mobile' | 'tablet' | 'vr' | 'ar', EnvironmentSpatialConfig> = {
  desktop: {
    anchor: createSpatialAnchorConfig({
    bounds: {
      width: 200,
      height: 150,
      depth: 50
    },
    constraints: {
      minScale: 0.8,
      maxScale: 1.5,
      minDistance: 20,
      maxDistance: 800,
      viewingAngle: 30
    }
    }),
    understanding: {
      ...defaultSpatialUnderstandingConfig,
      enabled: false
    },
    boundary: {
      ...defaultRoomBoundaryConfig,
      enabled: false
    },
    constraints: {
      ...defaultSpatialConstraints,
      minDistance: 0.5,
      maxDistance: 3.0
    }
  },
  
  mobile: {
    anchor: createSpatialAnchorConfig({
    bounds: {
      width: 100,
      height: 80,
      depth: 30
    },
    constraints: {
      minScale: 0.6,
      maxScale: 1.2,
      minDistance: 10,
      maxDistance: 500,
      viewingAngle: 60
    },
    adaptiveScaling: true,
    followUser: true
    }),
    understanding: {
      ...defaultSpatialUnderstandingConfig,
      enabled: false,
      meshTracking: false
    },
    boundary: {
      ...defaultRoomBoundaryConfig,
      enabled: false
    },
    constraints: {
      ...defaultSpatialConstraints,
      minDistance: 0.3,
      maxDistance: 2.0
    }
  },
  
  tablet: {
    anchor: createSpatialAnchorConfig({
    bounds: {
      width: 150,
      height: 120,
      depth: 40
    },
    constraints: {
      minScale: 0.7,
      maxScale: 1.3,
      minDistance: 15,
      maxDistance: 600,
      viewingAngle: 45
    },
    adaptiveScaling: true
    }),
    understanding: {
      ...defaultSpatialUnderstandingConfig,
      enabled: false,
      meshTracking: false
    },
    boundary: {
      ...defaultRoomBoundaryConfig,
      enabled: false
    },
    constraints: {
      ...defaultSpatialConstraints,
      minDistance: 0.4,
      maxDistance: 2.5
    }
  },
  
  vr: {
    anchor: createSpatialAnchorConfig({
    bounds: {
      width: 300,
      height: 200,
      depth: 200
    },
    constraints: {
      minScale: 0.3,
      maxScale: 3,
      minDistance: 50,
      maxDistance: 2000,
      viewingAngle: 90
    },
    adaptiveScaling: true,
    followUser: true,
    collisionDetection: true
    }),
    understanding: {
      ...defaultSpatialUnderstandingConfig,
      meshTracking: true,
      semanticLabeling: true,
      updateInterval: 100,
      maxMeshes: 2000
    },
    boundary: {
      ...defaultRoomBoundaryConfig,
      mode: 'dynamic',
      updateInterval: 100,
      warningDistance: 0.8
    },
    constraints: {
      ...defaultSpatialConstraints,
      minDistance: 0.1,
      maxDistance: 10.0,
      viewingAngle: 90
    }
  },
  
  ar: {
    anchor: createSpatialAnchorConfig({
    bounds: {
      width: 200,
      height: 150,
      depth: 100
    },
    constraints: {
      minScale: 0.4,
      maxScale: 2.5,
      minDistance: 30,
      maxDistance: 1500,
      viewingAngle: 75
    },
    adaptiveScaling: true,
    followUser: true,
    collisionDetection: true
    }),
    understanding: {
      ...defaultSpatialUnderstandingConfig,
      meshTracking: true,
      semanticLabeling: true,
      updateInterval: 100,
      maxMeshes: 1500
    },
    boundary: {
      ...defaultRoomBoundaryConfig,
      mode: 'dynamic',
      updateInterval: 100,
      warningDistance: 0.8
    },
    constraints: {
      ...defaultSpatialConstraints,
      minDistance: 0.1,
      maxDistance: 8.0,
      viewingAngle: 75
    }
  }
};

/**
 * Helper function to get environment-specific spatial configuration
 */
export function getEnvironmentSpatialConfig(environment: keyof typeof environmentConfigs): EnvironmentSpatialConfig {
  return environmentConfigs[environment] || environmentConfigs.desktop;
}
