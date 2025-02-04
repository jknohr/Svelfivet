// Pixel Value Type
export type PixelValue = number | `${number}px`;

// Color Types
export type CSSColorString = string;
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'default' | 'blue' | 'green' | 'red' | 'purple' | 'custom';

// Background Types
export type BackgroundStyles = 'dots' | 'lines';

// Component Theme Interfaces
export interface GroupTheme {
    border: CSSColorString;
    background: CSSColorString;
    text: CSSColorString;
    anchor: CSSColorString;
    label: CSSColorString;
    hover: {
        border: CSSColorString;
        background: CSSColorString;
    };
    selected?: {
        border: CSSColorString;
        background: CSSColorString;
    };
}

export interface NodeTheme {
    background: CSSColorString;
    border: CSSColorString;
    text: CSSColorString;
    anchor: CSSColorString;
    selected: CSSColorString;
    hover: {
        border: CSSColorString;
        background: CSSColorString;
    };
    disabled?: {
        background: CSSColorString;
        border: CSSColorString;
        text: CSSColorString;
    };
}

export interface EdgeTheme {
    color: CSSColorString;
    width: number;
    selected: CSSColorString;
    hover: CSSColorString;
    animated: boolean;
    style?: 'solid' | 'dashed' | 'dotted';
    arrow?: {
        color: CSSColorString;
        size: number;
        offset: number;
    };
    label?: {
        background: CSSColorString;
        text: CSSColorString;
        font: string;
    };
}

export interface ViewportTheme {
    background: CSSColorString;
    grid: {
        color: CSSColorString;
        size: number;
        subdivisions: number;
        enabled: boolean;
        style?: 'lines' | 'dots';
    };
    selection?: {
        color: CSSColorString;
        opacity: number;
    };
}

export interface ControlsTheme {
    background: CSSColorString;
    border: CSSColorString;
    text: CSSColorString;
    icon: CSSColorString;
    hover: {
        background: CSSColorString;
        border: CSSColorString;
    };
    active: {
        background: CSSColorString;
        border: CSSColorString;
    };
}

export interface TooltipTheme {
    background: CSSColorString;
    text: CSSColorString;
    border: CSSColorString;
    arrow: CSSColorString;
    delay: number;
}

// Unified Theme Context
export interface UnifiedThemeContext {
    mode: ThemeMode;
    colorScheme: ColorScheme;
    node: NodeTheme;
    edge: EdgeTheme;
    group: GroupTheme;
    viewport: ViewportTheme;
    controls: ControlsTheme;
    tooltip: TooltipTheme;
    isDark: boolean;
    custom?: {
        primary: CSSColorString;
        secondary: CSSColorString;
        accent: CSSColorString;
        neutral: CSSColorString;
    };
}

// Theme Variants
export const lightTheme: UnifiedThemeContext = {
    mode: 'light',
    colorScheme: 'default',
    node: {
        background: '#ffffff',
        border: '#4299e1',
        text: '#2c5282',
        anchor: '#3182ce',
        selected: '#ebf8ff',
        hover: {
            border: '#3182ce',
            background: '#bee3f8'
        }
    },
    edge: {
        color: '#4299e1',
        width: 2,
        selected: '#3182ce',
        hover: '#2b6cb0',
        animated: false,
        arrow: {
            color: '#4299e1',
            size: 6,
            offset: 1
        }
    },
    group: {
        border: '#4299e1',
        background: '#ebf8ff',
        text: '#2c5282',
        anchor: '#3182ce',
        label: '#2d3748',
        hover: {
            border: '#3182ce',
            background: '#bee3f8'
        }
    },
    viewport: {
        background: '#f7fafc',
        grid: {
            color: '#e2e8f0',
            size: 40,
            subdivisions: 5,
            enabled: true,
            style: 'lines'
        },
        selection: {
            color: '#4299e1',
            opacity: 0.2
        }
    },
    controls: {
        background: '#ffffff',
        border: '#e2e8f0',
        text: '#2d3748',
        icon: '#4a5568',
        hover: {
            background: '#f7fafc',
            border: '#cbd5e0'
        },
        active: {
            background: '#ebf8ff',
            border: '#4299e1'
        }
    },
    tooltip: {
        background: '#2d3748',
        text: '#ffffff',
        border: '#4a5568',
        arrow: '#2d3748',
        delay: 300
    },
    isDark: false
};

export const darkTheme: UnifiedThemeContext = {
    mode: 'dark',
    colorScheme: 'default',
    node: {
        background: '#2d3748',
        border: '#4299e1',
        text: '#e2e8f0',
        anchor: '#63b3ed',
        selected: '#2a4365',
        hover: {
            border: '#63b3ed',
            background: '#2a4365'
        }
    },
    edge: {
        color: '#4299e1',
        width: 2,
        selected: '#63b3ed',
        hover: '#90cdf4',
        animated: false,
        arrow: {
            color: '#4299e1',
            size: 6,
            offset: 1
        }
    },
    group: {
        border: '#4299e1',
        background: '#2a4365',
        text: '#e2e8f0',
        anchor: '#63b3ed',
        label: '#e2e8f0',
        hover: {
            border: '#63b3ed',
            background: '#2c5282'
        }
    },
    viewport: {
        background: '#1a202c',
        grid: {
            color: '#2d3748',
            size: 40,
            subdivisions: 5,
            enabled: true,
            style: 'lines'
        },
        selection: {
            color: '#4299e1',
            opacity: 0.3
        }
    },
    controls: {
        background: '#2d3748',
        border: '#4a5568',
        text: '#e2e8f0',
        icon: '#a0aec0',
        hover: {
            background: '#4a5568',
            border: '#718096'
        },
        active: {
            background: '#2a4365',
            border: '#4299e1'
        }
    },
    tooltip: {
        background: '#4a5568',
        text: '#ffffff',
        border: '#718096',
        arrow: '#4a5568',
        delay: 300
    },
    isDark: true
}; 