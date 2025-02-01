// Base theme types
export interface ThemeColors {
    // Base colors
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    border: string;

    // State variants and additional colors
    [key: string]: string | undefined;

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
        fast: number;
        normal: number;
        slow: number;
    };
    easing: {
        default: string;
        in: string;
        out: string;
        inOut: string;
    };
    properties: string[];
}

export interface Theme {
    colors: ThemeColors;
    layout: ThemeLayout;
    transitions: ThemeTransitions;
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