import type { GlassEffectConfig } from '../Theme.types';

/**
 * Default glass effect configuration
 * Provides a consistent base for glass effects across the application
 */
export const defaultGlassConfig: GlassEffectConfig = {
  base: {
    blur: '10px',
    opacity: 0.2,
    borderOpacity: 0.2,
    lightEffect: true,
    lightIntensity: 0.5,
    lightColor: '#FFFFFF',
    tint: 'rgba(255, 255, 255, 0.1)',
    glowRadius: '5px'
  },
  states: {
    default: {},
    focus: {
      opacity: 0.25,
      borderOpacity: 0.3
    },
    attention: {
      opacity: 0.3,
      borderOpacity: 0.35
    },
    error: {
      opacity: 0.25,
      borderOpacity: 0.3,
      tint: 'rgba(244, 67, 54, 0.1)',
      lightColor: '#FFE5E5'
    },
    success: {
      opacity: 0.25,
      borderOpacity: 0.3,
      tint: 'rgba(76, 175, 80, 0.1)',
      lightColor: '#E8F5E9'
    }
  },
  variants: {
    light: {
      opacity: 0.15,
      blur: '5px',
      borderOpacity: 0.15,
      lightIntensity: 0.3
    },
    medium: {
      opacity: 0.2,
      blur: '10px',
      borderOpacity: 0.2,
      lightIntensity: 0.5
    },
    heavy: {
      opacity: 0.25,
      blur: '15px',
      borderOpacity: 0.25,
      lightIntensity: 0.7
    }
  }
};
