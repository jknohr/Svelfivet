import type { NavigationConfig } from './navigation';

// Vista types
export type ContextType = 'real-estate' | 'aisearch' | 'systemadmin' | 'user';

// Navigation item types
export interface NavigationItem {
    label: string;
    path: string;
    icon?: string;
    description?: string;
    requiresAuth?: boolean;
    roles?: string[];
    subItems?: NavigationItem[];
    onClick?: () => void;
}

// Navigation configuration
export interface NavigationConfig {
    main: NavigationItem[];
    user?: NavigationItem[];
    admin?: NavigationItem[];
}

// Theme configuration
export interface ThemeConfig {
    primary: string;
    secondary: string;
    accent: string;
    background?: string;
    primaryfont?: string;
    secondaryfont?: string;
    tertiaryfont?: string;
}

// Route configuration
export interface RouteConfig {
    type: string;
    label: string;
    path: string;
    icon: string;
    description: string;
    requiresAuth?: boolean;
    roles?: string[];
    metadata?: {
        order?: number;
        category?: string;
        features?: string[];
    };
    api?: {
        endpoints?: Record<string, string>;
        cache?: {
            ttl: number;
            strategy: string;
        };
        ai?: Record<string, string>;
    };
}

// Feature configuration
export interface FeatureConfig {
    enabled: boolean;
    provider?: string;
    capabilities?: string[];
    config?: Record<string, any>;
}

// Context configuration
export interface ContextConfig {
    type: ContextType;
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
    };
}

export interface ContextConfigs {
  [key: string]: NavigationConfig;
}

export interface ContextState {
  current: ContextType | null;
  switchContext: (context: ContextType) => Promise<void>;
} 