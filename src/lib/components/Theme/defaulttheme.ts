/**
 * Default theme configuration with spatial design system
 */
import type { ThemeConfig } from './Theme.types';

// Golden ratio constant
const PHI = 1.618033988749895;

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textLight: '#64748b',
    textDark: '#0f172a',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    glass: {
      tint: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      glow: 'rgba(255, 255, 255, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      highlight: 'rgba(255, 255, 255, 0.15)',
      backdrop: 'rgba(255, 255, 255, 0.05)'
    },
    states: {
      focus: 'rgba(68, 255, 147, 0.15)',      // Neon green
      attention: 'rgba(255, 237, 68, 0.15)',   // Yellow
      error: 'rgba(255, 68, 68, 0.15)',        // Red
      success: 'rgba(68, 255, 147, 0.15)'      // Green
    }
  },
  typography: {
    fontFamily: {
      base: 'system-ui, -apple-system, sans-serif',
      heading: 'system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem'
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  components: {
    node: {
      background: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: '1px',
      textColor: '#1e293b'
    },
    edge: {
      color: '#94a3b8',
      width: '2px',
      hoverColor: '#64748b',
      selectedColor: '#3b82f6'
    },
    anchor: {
      size: '8px',
      color: '#94a3b8',
      hoverColor: '#64748b',
      activeColor: '#3b82f6'
    },
    tooltip: {
      background: '#1e293b',
      textColor: '#ffffff',
      borderRadius: '4px',
      padding: '8px'
    },
    glass: {
      blur: '10px',
      opacity: 0.2,
      borderOpacity: 0.2,
      lightEffect: true,
      lightIntensity: 0.5
    }
  },
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '450ms'
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
      decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      linear: 'linear'
    }
  },
  spatial: {
    base: {
      unit: 8,
      xxs: Math.round(8 * 0.25),    // 2px
      xs: Math.round(8 * 0.382),    // 3px - Golden ratio reciprocal
      s: Math.round(8 * 0.618),     // 5px - Golden ratio reciprocal
      m: 8,                         // 8px - Base unit
      l: Math.round(8 * 1.618),     // 13px - Golden ratio
      xl: Math.round(8 * 2.618),    // 21px - Golden ratio squared
      xxl: Math.round(8 * 4.236)    // 34px - Golden ratio cubed
    },
    depth: {
      base: 0,
      surface: 1,
      floating: 10,
      popup: 100,
      modal: 1000,
      overlay: 10000
    },
    space3d: {
      layerGap: 8,
      perspective: '1000px',
      rotation: {
        subtle: 2,
        medium: 5,
        strong: 10
      },
      elevation: {
        pressed: -2,
        default: 0,
        raised: 2,
        floating: 8
      }
    },
    // AR/VR spatial configuration
    spatial: {
      environment: 'desktop',
      defaultConstraints: {
        ar: {
          minScale: 0.1,
          maxScale: 2.0,
          minDistance: 0.3,  // 30cm
          maxDistance: 5.0,  // 5m
          viewingAngle: 120  // degrees
        },
        vr: {
          minScale: 0.2,
          maxScale: 5.0,
          minDistance: 0.5,  // 50cm
          maxDistance: 10.0, // 10m
          viewingAngle: 180  // degrees
        },
        mixed: {
          minScale: 0.15,
          maxScale: 3.0,
          minDistance: 0.4,  // 40cm
          maxDistance: 7.0,  // 7m
          viewingAngle: 150  // degrees
        }
      },
      anchor: {
        enabled: false,
        adaptiveScaling: true,
        followUser: false,
        collisionDetection: true,
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
          width: 1,
          height: 1,
          depth: 0.5
        }
      }
    }
  },
  effects: {
    glass: {
      base: {
        blur: '10px',
        opacity: 0.2,
        borderOpacity: 0.2,
        lightEffect: true,
        lightIntensity: 0.5,
        lightColor: 'rgba(255, 255, 255, 0.5)',
        tint: 'rgba(255, 255, 255, 0.1)',
        glowRadius: '32px'
      },
      states: {
        default: {},
        focus: {
          tint: 'rgba(68, 255, 147, 0.15)',
          lightColor: 'rgba(68, 255, 147, 0.5)',
          lightIntensity: 0.7,
          glowRadius: '48px'
        },
        attention: {
          tint: 'rgba(255, 237, 68, 0.15)',
          lightColor: 'rgba(255, 237, 68, 0.5)',
          lightIntensity: 0.7,
          glowRadius: '48px'
        },
        error: {
          tint: 'rgba(255, 68, 68, 0.15)',
          lightColor: 'rgba(255, 68, 68, 0.5)',
          lightIntensity: 0.7,
          glowRadius: '48px'
        },
        success: {
          tint: 'rgba(68, 255, 147, 0.15)',
          lightColor: 'rgba(68, 255, 147, 0.5)',
          lightIntensity: 0.7,
          glowRadius: '48px'
        }
      },
      variants: {
        light: {
          blur: '5px',
          opacity: 0.15,
          borderOpacity: 0.1,
          lightIntensity: 0.3
        },
        medium: {
          blur: '10px',
          opacity: 0.2,
          borderOpacity: 0.2,
          lightIntensity: 0.5
        },
        heavy: {
          blur: '20px',
          opacity: 0.25,
          borderOpacity: 0.3,
          lightIntensity: 0.7
        }
      }
    },
    lighting: {
      ambient: 'rgba(255, 255, 255, 0.1)',
      key: 'rgba(255, 255, 255, 0.8)',
      fill: 'rgba(255, 255, 255, 0.3)',
      intensity: 1,
      angle: 45
    }
  }
};