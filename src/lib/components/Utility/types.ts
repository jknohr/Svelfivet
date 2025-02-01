// Basic geometry types
export interface Dimensions {
    width: number;
    height: number;
    aspectRatio?: number;
}

export interface Position {
    x: number;
    y: number;
    z?: number;
}

export interface Rect extends Dimensions, Position {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}

// Event handling types
export type EventHandler<T = void> = (event: CustomEvent<T>) => void;

export interface EventOptions {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    capture?: boolean;
}

// Theme integration types
export interface ThemeAware {
    theme?: any; // Will be properly typed when integrated with main theme
    variant?: string;
    density?: 'compact' | 'comfortable' | 'spacious';
}

// Spatial awareness types
export interface SpatialConfig {
    depth?: number;
    perspective?: number;
    rotation?: {
        x: number;
        y: number;
        z: number;
    };
    scale?: number;
}

// Base component props
export interface BaseComponentProps extends ThemeAware {
    class?: string;
    style?: string;
    id?: string;
    'data-testid'?: string;
    spatial?: SpatialConfig;
} 