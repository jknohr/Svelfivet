import { BASE } from '../SpatialDesign';

/**
 * Grid-specific constraints for different environments and densities
 */
export const ENVIRONMENT_GRID_CONSTRAINTS = {
  desktop: {
    comfortable: {
      minScale: 0.8,
      maxScale: 1.5,
      minDistance: BASE.UNIT * 2,
      maxDistance: BASE.UNIT * 16,
      viewingAngle: 0
    },
    compact: {
      minScale: 0.25,
      maxScale: 1.5,
      minDistance: BASE.UNIT,
      maxDistance: BASE.UNIT * 12,
      viewingAngle: 0
    },
    spacious: {
      minScale: 0.75,
      maxScale: 2.5,
      minDistance: BASE.UNIT * 3,
      maxDistance: BASE.UNIT * 24,
      viewingAngle: 0
    }
  },
  mobile: {
    comfortable: {
      minScale: 0.6,
      maxScale: 1.2,
      minDistance: BASE.UNIT,
      maxDistance: BASE.UNIT * 8,
      viewingAngle: 0
    },
    compact: {
      minScale: 0.5,
      maxScale: 1.25,
      minDistance: BASE.UNIT * 0.5,
      maxDistance: BASE.UNIT * 6,
      viewingAngle: 0
    },
    spacious: {
      minScale: 1,
      maxScale: 2,
      minDistance: BASE.UNIT * 1.5,
      maxDistance: BASE.UNIT * 12,
      viewingAngle: 0
    }
  },
  vr: {
    comfortable: {
      minScale: 1,
      maxScale: 4,
      minDistance: BASE.UNIT * 4,
      maxDistance: BASE.UNIT * 32,
      viewingAngle: 90
    },
    compact: {
      minScale: 0.75,
      maxScale: 3,
      minDistance: BASE.UNIT * 2,
      maxDistance: BASE.UNIT * 24,
      viewingAngle: 90
    },
    spacious: {
      minScale: 1.5,
      maxScale: 5,
      minDistance: BASE.UNIT * 6,
      maxDistance: BASE.UNIT * 48,
      viewingAngle: 90
    }
  },
  tablet: {
    comfortable: {
      minScale: 0.7,
      maxScale: 1.3,
      minDistance: BASE.UNIT * 1.5,
      maxDistance: BASE.UNIT * 12,
      viewingAngle: 0
    },
    compact: {
      minScale: 0.4,
      maxScale: 1.5,
      minDistance: BASE.UNIT,
      maxDistance: BASE.UNIT * 8,
      viewingAngle: 0
    },
    spacious: {
      minScale: 0.8,
      maxScale: 2.5,
      minDistance: BASE.UNIT * 2,
      maxDistance: BASE.UNIT * 16,
      viewingAngle: 0
    }
  },
  ar: {
    comfortable: {
      minScale: 0.5,
      maxScale: 2,
      minDistance: BASE.UNIT * 2,
      maxDistance: BASE.UNIT * 16,
      viewingAngle: 75
    },
    compact: {
      minScale: 0.25,
      maxScale: 1.5,
      minDistance: BASE.UNIT,
      maxDistance: BASE.UNIT * 12,
      viewingAngle: 75
    },
    spacious: {
      minScale: 0.75,
      maxScale: 3,
      minDistance: BASE.UNIT * 3,
      maxDistance: BASE.UNIT * 24,
      viewingAngle: 75
    }
  }
} as const;
