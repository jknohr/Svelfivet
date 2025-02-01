import type { Theme, ThemeColors, ThemeLayout, ThemeTransitions } from './types';

// Base color palette
export const baseColors = {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#ffffff',
    surface: '#f3f4f6',
    text: '#1f2937',
    border: '#e5e7eb',
} as const;

// Base layout values
export const baseLayout = {
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
    },
    borderRadius: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
    },
    borderWidth: {
        thin: '1px',
        medium: '2px',
        thick: '4px',
    },
    fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
    },
    opacity: {
        light: '0.5',
        medium: '0.75',
        full: '1',
    },
    scale: {
        xs: '0.75',
        sm: '0.875',
        md: '1',
        lg: '1.125',
        xl: '1.25',
    },
} as const;

// Base transitions
export const baseTransitions: ThemeTransitions = {
    duration: {
        fast: 150,
        normal: 300,
        slow: 500,
    },
    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    properties: [
        'color',
        'background-color',
        'border-color',
        'box-shadow',
        'opacity',
        'transform'
    ],
} as const;

// Theme presets
export const lightTheme: Theme = {
    colors: {
        ...baseColors,
        background: '#ffffff',
        surface: '#f3f4f6',
        text: '#1f2937',
        border: '#e5e7eb',
    },
    layout: baseLayout,
    transitions: baseTransitions,
};

export const darkTheme: Theme = {
    colors: {
        ...baseColors,
        background: '#1f2937',
        surface: '#374151',
        text: '#f3f4f6',
        border: '#4b5563',
        primary: '#60a5fa',
    },
    layout: baseLayout,
    transitions: baseTransitions,
};

export const contrastTheme: Theme = {
    colors: {
        ...baseColors,
        background: '#000000',
        surface: '#1a1a1a',
        text: '#ffffff',
        border: '#333333',
        primary: '#ffffff',
    },
    layout: {
        ...baseLayout,
        borderWidth: {
            thin: '2px',
            medium: '3px',
            thick: '5px',
        },
    },
    transitions: baseTransitions,
};

// Canvas-specific theme presets
export const canvasLightTheme: Theme = {
    colors: {
        ...lightTheme.colors,
        grid: '#e5e7eb',
        node: '#ffffff',
        nodeSelected: '#e5e7eb',
        edge: '#9ca3af',
        edgeSelected: '#3b82f6',
        handle: '#6b7280',
        handleHover: '#3b82f6',
        selection: 'rgba(59, 130, 246, 0.1)',
    },
    layout: {
        ...lightTheme.layout,
        gridSize: '20px',
        nodeSpacing: '50px',
        edgeWidth: '2px',
        handleSize: '8px',
    },
    transitions: baseTransitions,
};

export const canvasDarkTheme: Theme = {
    colors: {
        ...darkTheme.colors,
        grid: '#374151',
        node: '#1f2937',
        nodeSelected: '#374151',
        edge: '#6b7280',
        edgeSelected: '#60a5fa',
        handle: '#9ca3af',
        handleHover: '#60a5fa',
        selection: 'rgba(96, 165, 250, 0.1)',
    },
    layout: canvasLightTheme.layout,
    transitions: baseTransitions,
};

// Theme customization helpers
export function createCustomTheme(
    baseTheme: Theme,
    overrides: Partial<Theme>
): Theme {
    return {
        colors: {
            ...baseTheme.colors,
            ...overrides.colors,
        },
        layout: {
            ...baseTheme.layout,
            ...overrides.layout,
        },
        transitions: {
            ...baseTheme.transitions,
            ...overrides.transitions,
        },
    };
}

export function createColorVariant(
    color: string,
    options: {
        lighten?: number;
        darken?: number;
        alpha?: number;
    } = {}
): string {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Apply modifications
    const { lighten = 0, darken = 0, alpha = 1 } = options;
    const l = Math.min(1, Math.max(0, lighten));
    const d = Math.min(1, Math.max(0, darken));
    
    const modifiedR = Math.round(r * (1 + l - d));
    const modifiedG = Math.round(g * (1 + l - d));
    const modifiedB = Math.round(b * (1 + l - d));

    // Return RGB or RGBA
    return alpha === 1
        ? `rgb(${modifiedR}, ${modifiedG}, ${modifiedB})`
        : `rgba(${modifiedR}, ${modifiedG}, ${modifiedB}, ${alpha})`;
}

export function generateThemeVariants(
    theme: Theme,
    options: {
        hover?: boolean;
        active?: boolean;
        disabled?: boolean;
    } = {}
): Theme {
    const variants: Theme = {
        colors: { ...theme.colors },
        layout: theme.layout,
        transitions: theme.transitions,
    };
    const { hover, active, disabled } = options;

    Object.entries(theme.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
            if (hover) {
                variants.colors[`${key}Hover`] = createColorVariant(value, { lighten: 0.1 });
            }
            
            if (active) {
                variants.colors[`${key}Active`] = createColorVariant(value, { darken: 0.1 });
            }
            
            if (disabled) {
                variants.colors[`${key}Disabled`] = createColorVariant(value, { alpha: 0.5 });
            }
        }
    });

    return variants;
} 