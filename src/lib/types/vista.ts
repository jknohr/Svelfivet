import type { FeatureConfig } from './feature';

// Theme configuration for vistas
export interface ThemeConfig {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
    };
}

// Navigation item types
export interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
    description?: string;
    requiresAuth?: boolean;
    roles?: string[];
    permissions?: string[];
    subItems?: NavigationItem[];
    onClick?: () => void;
    metadata?: {
        order?: number;
        category?: string;
        features?: string[];
        tags?: string[];
        version?: string;
        type?: string;
    };
}

// Navigation configuration
export interface NavigationConfig {
    items: NavigationItem[];
    layout?: {
        type: 'horizontal' | 'vertical';
        alignment?: 'start' | 'center' | 'end';
        spacing?: 'compact' | 'normal' | 'loose';
    };
    features?: {
        search?: boolean;
        breadcrumbs?: boolean;
        notifications?: boolean;
    };
}

// Route configuration
export interface RouteConfig {
    path: string;
    component?: string;
    layout?: string;
    meta?: {
        title?: string;
        description?: string;
        requiresAuth?: boolean;
        roles?: string[];
        permissions?: string[];
    };
    metadata?: {
        order?: number;
        category?: string;
        features?: string[];
        tags?: string[];
        version?: string;
        permissions?: string[];
    };
    children?: Record<string, RouteConfig>;
}

// Social media platform configuration
export interface SocialMediaConfig {
    platform: string;
    icon: string;
    label: string;
    url: string;
    handle?: string;
}

// Vista types
export type VistaType = 'real-estate' | 'aisearch' | 'systemadmin' | 'user';

// Vista configuration
export interface VistaConfig {
    type: VistaType;
    label: string;
    icon: string;
    description: string;
    theme: ThemeConfig;
    routes: Record<string, RouteConfig>;
    navigation: NavigationConfig;
    features: Record<string, FeatureConfig | boolean>;
    metadata: {
        version: string;
        category: string;
        tags: string[];
        permissions: string[];
        analytics?: {
            trackingId?: string;
            features?: string[];
        };
        cache?: {
            ttl: number;
            strategy: string;
        };
        recommendations?: {
            enabled: boolean;
            capabilities?: string[];
            config?: {
                provider: string;
                [key: string]: unknown;
            };
        };
    };
    social?: SocialMediaConfig[];
}

export interface VistaConfigs {
    [key: string]: VistaConfig;
}

export interface VistaState {
    current: VistaType | null;
    switchVista: (vista: VistaType) => Promise<void>;
}
