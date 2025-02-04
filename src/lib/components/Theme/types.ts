import type { ColorConfig, ComponentConfig, TransitionConfig, ThemeConfig, UnifiedThemeContext } from './Theme.types';
import type { TypographyConfig, TextSize, TextWeight, TextAlign, TextTransform, TextDecoration, TextOverflow, TextWrap } from './Typography.types';

// Re-export types
export type {
    ColorConfig,
    ComponentConfig,
    TransitionConfig,
    ThemeConfig,
    UnifiedThemeContext,
    TypographyConfig,
    TextSize,
    TextWeight,
    TextAlign,
    TextTransform,
    TextDecoration,
    TextOverflow,
    TextWrap
};

// Base theme types
export interface ThemeColors extends ColorConfig {
    // Canvas-specific colors
    grid?: string;
    node?: string;
    nodeSelected?: string;
    edge?: string;
    edgeSelected?: string;
    handle?: string;
    handleHover?: string;
    selection?: string;
}

export interface ThemeLayout {
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    borderRadius: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        full: string;
    };
    borderWidth: {
        thin: string;
        medium: string;
        thick: string;
    };
    fontSize: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    opacity: {
        light: string;
        medium: string;
        full: string;
    };
    scale?: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    density?: 'compact' | 'comfortable' | 'spacious';

    // Canvas-specific layout
    gridSize?: string;
    nodeSpacing?: string;
    edgeWidth?: string;
    handleSize?: string;
}

export interface ThemeTransitions {
    duration: {
        fast: string;
        normal: string;
        slow: string;
    };
    easing: {
        default: string;
        in: string;
        out: string;
        inOut: string;
    };
    properties: string[];
}

// Spatial configuration types
export interface SpatialConfig {
    defaultConstraints: {
        [key: string]: {
            maxWidth?: number;
            maxHeight?: number;
            minWidth?: number;
            minHeight?: number;
        };
    };
}

export interface Theme {
    colors: ThemeColors;
    layout: ThemeLayout;
    transitions: ThemeTransitions;
    edges: {
        default: {
            stroke: string;
            width: number;
        };
        hover: {
            stroke: string;
            width: number;
        };
    };
    group?: {
        border: string;
        background: string;
        text: string;
        anchor: string;
        label: string;
        hover: {
            border: string;
            background: string;
        };
    };
    spatial?: SpatialConfig;
}

// Theme-aware component props
export interface ThemeAware {
    theme?: Theme;
    variant?: 'primary' | 'secondary' | 'accent' | 'surface';
    density?: ThemeLayout['density'];
}

// Theme context types
export interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

// Canvas-specific theme types
export interface CanvasThemeColors extends ThemeColors {
    grid: string;
    node: string;
    nodeSelected: string;
    edge: string;
    edgeSelected: string;
    handle: string;
    handleHover: string;
    selection: string;
}

export interface CanvasThemeLayout extends ThemeLayout {
    gridSize: string;
    nodeSpacing: string;
    edgeWidth: string;
    handleSize: string;
}

export interface CanvasTheme extends Theme {
    colors: CanvasThemeColors;
    layout: CanvasThemeLayout;
} 