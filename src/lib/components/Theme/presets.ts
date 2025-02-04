import type { Theme, ThemeConfig, ColorConfig, TypographyConfig, ComponentConfig, TransitionConfig, GlassEffectConfig } from './Theme.types';
import type { ScalingConstraints, SpatialEnvironment } from '../../types/spatial';

// Base color palette
export const baseColors: ColorConfig = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#1f2937',
    textLight: '#4b5563',
    textDark: '#111827',
    border: '#e5e7eb',
    shadow: 'rgba(0, 0, 0, 0.1)',
    glass: {
        tint: 'rgba(255, 255, 255, 0.15)',
        border: 'rgba(255, 255, 255, 0.25)',
        glow: 'rgba(255, 255, 255, 0.1)',
        shadow: 'rgba(0, 0, 0, 0.05)',
        highlight: 'rgba(255, 255, 255, 0.3)',
        backdrop: 'rgba(255, 255, 255, 0.9)'
    },
    states: {
        focus: '#3b82f6',
        attention: '#f59e0b',
        error: '#ef4444',
        success: '#10b981'
    }
} as const;

// Base typography configuration
export const baseTypography: TypographyConfig = {
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
};
// Base component configuration
export const baseComponents: ComponentConfig = {
    node: {
        background: 'rgba(255, 255, 255, 0.1)',
        borderColor: '#718096',
        borderWidth: '1px',
        textColor: '#E2E8F0'
    },
    edge: {
        color: '#718096',
        width: '2px',
        hoverColor: '#A0AEC0',
        selectedColor: '#4299E1'
    },
    anchor: {
        size: '8px',
        color: '#718096',
        hoverColor: '#A0AEC0',
        activeColor: '#4299E1'
    },
    tooltip: {
        background: 'rgba(0, 0, 0, 0.8)',
        textColor: '#FFFFFF',
        borderRadius: '4px',
        padding: '8px'
    },
    controls: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'rgba(255, 255, 255, 0.2)',
        text: '#E2E8F0',
        icon: '#A0AEC0',
        hoverState: {
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'rgba(255, 255, 255, 0.3)'
        },
        activeState: {
            background: 'rgba(255, 255, 255, 0.3)'
        }
    },
    glass: {
        blur: '8px',
        opacity: 0.8,
        borderOpacity: 0.2,
        lightEffect: true,
        lightIntensity: 0.5,
        lightColor: '#ffffff',
        tint: 'rgba(255, 255, 255, 0.1)',
        glowRadius: '10px'
    }
};
// Base transitions configuration
export const baseTransitions: TransitionConfig = {
    durationValues: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms'
    },
    easingValues: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
        decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        linear: 'linear'
    }
} as const;

// Base glass effect configuration
export const baseGlassEffect: GlassEffectConfig = {
    base: {
        blur: '10px',
        opacity: 0.85,
        borderOpacity: 0.25,
        lightEffect: true,
        lightIntensity: 0.6,
        lightColor: '#ffffff',
        tint: 'rgba(255, 255, 255, 0.15)',
        glowRadius: '12px'
    },
    states: {
        default: {
            opacity: 0.85,          // Matched with base
            borderOpacity: 0.25     // Matched with base
        },
        focus: {
            opacity: 0.9,           // Increased for better focus state
            borderOpacity: 0.35,    // Increased border visibility
            lightIntensity: 0.7     // More pronounced light effect
        },
        attention: {
            opacity: 0.95,          // Most visible state
            borderOpacity: 0.4,     // Most visible border
            lightIntensity: 0.8     // Strongest light effect
        },
        error: {
            opacity: 0.9,
            borderOpacity: 0.35,
            lightColor: '#ff0000',
            lightIntensity: 0.7     // More pronounced error state
        },
        success: {
            opacity: 0.9,
            borderOpacity: 0.35,
            lightColor: '#00ff00',
            lightIntensity: 0.7     // More pronounced success state
        }
    },
    variants: {
        light: {
            opacity: 0.75,          // Increased from 0.7
            borderOpacity: 0.2,     // Increased from 0.15
            blur: '6px'             // Increased from 4px
        },
        medium: {
            opacity: 0.85,          // Increased from 0.8
            borderOpacity: 0.3,     // Increased from 0.2
            blur: '10px'            // Increased from 8px
        },
        heavy: {
            opacity: 0.95,          // Increased from 0.9
            borderOpacity: 0.35,    // Increased from 0.25
            blur: '14px'            // Increased from 12px
        }
    }
};

// Base lighting configuration
export const baseLightingConfig = {
    ambient: '#ffffff',
    key: '#ffffff',
    fill: '#ffffff',
    intensity: 0.5,
    angle: 45
};

// Base spatial constraints configuration
export const baseSpatialConstraints: Record<SpatialEnvironment, ScalingConstraints> = {
    default: {
        minScale: 0.5,
        maxScale: 2,
        minDistance: 100,
        maxDistance: 1000,
        viewingAngle: 45
    },
    desktop: {
        minScale: 0.75,
        maxScale: 1.5,
        minDistance: 200,
        maxDistance: 800,
        viewingAngle: 30
    },
    mobile: {
        minScale: 0.5,
        maxScale: 2,
        minDistance: 50,
        maxDistance: 500,
        viewingAngle: 60
    },
    tablet: {
        minScale: 0.6,
        maxScale: 1.8,
        minDistance: 100,
        maxDistance: 600,
        viewingAngle: 45
    },
    vr: {
        minScale: 0.1,
        maxScale: 10,
        minDistance: 0.1,
        maxDistance: 100,
        viewingAngle: 90
    },
    ar: {
        minScale: 0.1,
        maxScale: 10,
        minDistance: 0.1,
        maxDistance: 50,
        viewingAngle: 120
    }
} as const;

// Base layout configuration
export const baseLayout = {
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
    },
    container: {
        maxWidth: '1280px',
        padding: '1rem'
    },
    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050,
        tooltip: 1060
    }
};

// Theme presets
export const lightTheme: Theme = {
    name: 'light',
    colors: baseColors,
    typography: baseTypography,
    components: baseComponents,
    transitionConfig: baseTransitions,
    effects: {
        glass: baseGlassEffect,
        lightingConfig: baseLightingConfig
    },
    spatial: {
        constraints: baseSpatialConstraints
    },
    colorScheme: 'light',
    isDark: false,
    custom: {
        primary: baseColors.primary,
        [baseColors.primary]: baseColors.primary
    },
    utils: {
        getCSSVariable: (name: string) => `var(--${name})`,
        setCSSVariable: (name: string, value: string) => {
            document.documentElement.style.setProperty(`--${name}`, value);
        },
        getComputedTheme: () => ({ ...lightTheme }),
        getDerivedValues: () => ({})
    }
};

// Dark theme configuration
export const darkTheme: Theme = {
    name: 'dark',
    colorScheme: 'dark',
    isDark: true,
    colors: {
        ...baseColors,
        primary: '#60a5fa',
        secondary: '#9ca3af',
        accent: '#60a5fa',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textLight: '#d1d5db',
        textDark: '#f3f4f6',
        border: '#374151',
        shadow: 'rgba(0, 0, 0, 0.25)',
        glass: {
            tint: 'rgba(255, 255, 255, 0.1)',
            border: 'rgba(255, 255, 255, 0.2)',
            glow: 'rgba(255, 255, 255, 0.1)',
            shadow: 'rgba(0, 0, 0, 0.2)',
            highlight: 'rgba(255, 255, 255, 0.15)',
            backdrop: 'rgba(255, 255, 255, 0.05)'
        },
        states: {
            focus: 'rgba(96, 165, 250, 0.2)',
            attention: 'rgba(245, 158, 11, 0.2)',
            error: 'rgba(239, 68, 68, 0.2)',
            success: 'rgba(16, 185, 129, 0.2)'
        }
    },
    typography: baseTypography,
    components: baseComponents,
    transitionConfig: baseTransitions,
    effects: {
        glass: baseGlassEffect,
        lightingConfig: {
            ambient: '#1f2937',
            key: '#3b82f6',
            fill: '#60a5fa',
            intensity: 0.5,
            angle: 45
        }
    },
    custom: {
        primary: '#60a5fa'
    },
    utils: {
        getCSSVariable: (name: string) => `var(--theme-${name})`,
        setCSSVariable: (name: string, value: string) => {
            document.documentElement.style.setProperty(`--theme-${name}`, value);
        },
        getComputedTheme: () => darkTheme,
        getDerivedValues: () => ({})
    }
};

// High contrast theme configuration
export const contrastTheme: Theme = {
    name: 'contrast',
    colorScheme: 'high-contrast',
    isDark: false,
    colors: {
        ...baseColors,
        primary: '#000000',
        secondary: '#404040',
        accent: '#000000',
        background: '#ffffff',
        surface: '#f8f8f8',
        text: '#000000',
        textLight: '#202020',
        textDark: '#000000',
        border: '#404040',
        shadow: 'rgba(0, 0, 0, 0.25)',
        glass: {
            tint: 'rgba(0, 0, 0, 0.1)',
            border: 'rgba(0, 0, 0, 0.2)',
            glow: 'rgba(0, 0, 0, 0.1)',
            shadow: 'rgba(0, 0, 0, 0.2)',
            highlight: 'rgba(0, 0, 0, 0.15)',
            backdrop: 'rgba(0, 0, 0, 0.05)'
        },
        states: {
            focus: 'rgba(0, 0, 0, 0.2)',
            attention: 'rgba(0, 0, 0, 0.2)',
            error: 'rgba(0, 0, 0, 0.2)',
            success: 'rgba(0, 0, 0, 0.2)'
        }
    },
    typography: baseTypography,
    components: {
        ...baseComponents,
        node: {
            ...baseComponents.node,
            background: 'rgba(0, 0, 0, 0.1)',
            borderColor: '#000000',
            textColor: '#000000'
        },
        edge: {
            ...baseComponents.edge,
            color: '#000000',
            hoverColor: '#404040',
            selectedColor: '#000000'
        },
        anchor: {
            ...baseComponents.anchor,
            color: '#000000',
            hoverColor: '#404040',
            activeColor: '#000000'
        },
        tooltip: {
            ...baseComponents.tooltip,
            background: 'rgba(0, 0, 0, 0.9)',
            textColor: '#ffffff'
        },
        controls: {
            ...baseComponents.controls,
            background: 'rgba(0, 0, 0, 0.1)',
            border: 'rgba(0, 0, 0, 0.2)',
            text: '#000000',
            icon: '#404040',
            hoverState: {
                background: 'rgba(0, 0, 0, 0.2)',
                border: 'rgba(0, 0, 0, 0.3)'
            },
            activeState: {
                background: 'rgba(0, 0, 0, 0.3)'
            }
        }
    },
    transitionConfig: baseTransitions,
    effects: {
        glass: baseGlassEffect,
        lightingConfig: {
            ambient: '#ffffff',
            key: '#000000',
            fill: '#ffffff',
            intensity: 0.8,
            angle: 45
        }
    },
    custom: {
        primary: '#000000'
    },
    utils: {
        getCSSVariable: (name: string) => `var(--theme-${name})`,
        setCSSVariable: (name: string, value: string) => {
            document.documentElement.style.setProperty(`--theme-${name}`, value);
        },
        getComputedTheme: () => contrastTheme,
        getDerivedValues: () => ({})
    }
};

// Theme customization helpers
export function createCustomTheme(baseTheme: Theme, overrides: Partial<Theme>): Theme {
    return {
        ...baseTheme,
        ...overrides,
        colors: {
            ...baseTheme.colors,
            ...overrides.colors
        },
        typography: {
            ...baseTheme.typography,
            ...overrides.typography
        },
        components: {
            ...baseTheme.components,
            ...overrides.components
        },
        transitionConfig: {
            ...baseTheme.transitionConfig,
            ...overrides.transitionConfig
        },
        effects: {
            ...baseTheme.effects,
            ...overrides.effects
        },
        spatial: {
            ...baseTheme.spatial,
            ...overrides.spatial
        }
    };
}

export function createColorVariant(color: string, options: { lighten?: number; darken?: number; alpha?: number; } = {}): string {
    const { lighten = 0, darken = 0, alpha = 1 } = options;

    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Apply lighten/darken
    const adjust = (value: number) => {
        if (lighten > 0) {
            return value + (255 - value) * lighten;
        }
        if (darken > 0) {
            return value * (1 - darken);
        }
        return value;
    };

    const newR = Math.round(adjust(r));
    const newG = Math.round(adjust(g));
    const newB = Math.round(adjust(b));

    // Return as rgba if alpha < 1, otherwise as hex
    if (alpha < 1) {
        return `rgba(${newR}, ${newG}, ${newB}, ${alpha})`;
    }

    const toHex = (n: number) => {
        const hex = Math.max(0, Math.min(255, n)).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

export function generateThemeVariants(theme: Theme, options: { hover?: boolean; active?: boolean; disabled?: boolean; } = {}): Theme {
    const { hover = true, active = true, disabled = true } = options;

    const variants: Theme = { ...theme };

    if (hover) {
        variants.colors = {
            ...variants.colors,
            primary: createColorVariant(variants.colors.primary, { lighten: 0.1 }),
            secondary: createColorVariant(variants.colors.secondary, { lighten: 0.1 }),
            accent: createColorVariant(variants.colors.accent, { lighten: 0.1 })
        };
    }

    if (active) {
        variants.colors = {
            ...variants.colors,
            primary: createColorVariant(variants.colors.primary, { darken: 0.1 }),
            secondary: createColorVariant(variants.colors.secondary, { darken: 0.1 }),
            accent: createColorVariant(variants.colors.accent, { darken: 0.1 })
        };
    }

    if (disabled) {
        variants.colors = {
            ...variants.colors,
            primary: createColorVariant(variants.colors.primary, { alpha: 0.5 }),
            secondary: createColorVariant(variants.colors.secondary, { alpha: 0.5 }),
            accent: createColorVariant(variants.colors.accent, { alpha: 0.5 })
        };
    }

    return variants;
}