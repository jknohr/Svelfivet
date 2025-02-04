import type { ThemeConfig } from '$lib/components/Theme/Theme.types';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  path: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: string[];
  subItems?: NavigationItem[];
  onClick?: () => void;
  metadata?: {
    order?: number;
    category?: string;
    features?: string[];
  };
}

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

export interface VistaConfig {
  label: string;
  icon: string;
  description: string;
  theme: ThemeConfig;
  navigation: NavigationConfig;
  metadata?: {
    version: string;
    category: string;
    tags: string[];
    features?: string[];
    permissions?: string[];
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