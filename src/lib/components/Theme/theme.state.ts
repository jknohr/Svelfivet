import type { Theme } from './types';
import type { UnifiedThemeContext } from '$lib/components/Templates/Canvas/types/theme';
import { baseLayout, baseTransitions } from './presets';

// Global theme state
let currentTheme = $state<Theme>({
    colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        border: 'var(--color-border)'
    },
    layout: baseLayout,
    transitions: baseTransitions
});

// Canvas-specific theme state
let canvasTheme = $state<UnifiedThemeContext>({
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
    components: {
        node: {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            textColor: 'inherit'
        }
    }
});

// Theme state management
export function useTheme() {
    return {
        // Reactive getters
        get theme() { return currentTheme; },
        get colors() { return currentTheme.colors; },
        get layout() { return currentTheme.layout; },
        get transitions() { return currentTheme.transitions; },
        get canvas() { return canvasTheme; },

        // Setters
        setTheme(newTheme: Partial<Theme>) {
            currentTheme = { ...currentTheme, ...newTheme };
        },

        setCanvasTheme(newTheme: Partial<UnifiedThemeContext>) {
            canvasTheme = { ...canvasTheme, ...newTheme };
        },

        setColor(key: keyof Theme['colors'], value: string) {
            currentTheme.colors[key] = value;
        },

        setScale(scale: { xs?: string; sm?: string; md?: string; lg?: string; xl?: string; }) {
            if (!currentTheme.layout.scale) {
                currentTheme.layout.scale = { xs: '0.75', sm: '0.875', md: '1', lg: '1.125', xl: '1.25' };
            }
            currentTheme.layout.scale = { ...currentTheme.layout.scale, ...scale };
        }
    };
} 