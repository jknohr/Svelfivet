import type { NavigationConfig } from './navigation';
import type { ThemeConfig } from '$lib/components/Theme/Theme.types';
import type { RouteConfig } from './route';
import type { FeatureConfig } from './feature';

// Vista types
export type VistaType = 'real-estate' | 'aisearch' | 'systemadmin' | 'user';

// Social media platform configuration
export interface SocialMediaConfig {
  platform: string;
  icon: string;
  label: string;
  url: string;
  handle?: string;
}

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
