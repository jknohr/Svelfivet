import { realEstateConfig } from './real-estate';
import { restaurantsConfig } from './resturants';
import { educationConfig } from './education';
import { nightlifeConfig } from './nightlife';
import { socialConfig } from './social';
import { servicesConfig } from './services';
import { transitConfig } from './transit';
import { cultureConfig } from './culture';
import { jobsConfig } from './jobs';
import { healthConfig } from './health';
import { tourismConfig } from './tourism';
import { newsConfig } from './news';
import { hotelsConfig } from './hotels';
import { datingConfig } from './dating';
import { transportConfig } from './transport';
import { shopsConfig } from './shops';
import { classifiedConfig } from './classified';
import { consumerGoodsConfig } from './consumer-goods';
import { financialServicesConfig } from './financial-services';
import { entertainmentConfig } from './entertainment';
import { aiSearchConfig } from './aisearch';
import { aiInferenceConfig } from './aiinference';
import { aiPediaConfig } from './aipedia';
import { adminConfig } from './systemadmin';
import { commonUserMenu } from './common';

import type { ContextConfig, NavigationItem } from '$lib/types/navigation';
import type { ContextType } from '$lib/components/Templates/Canvas/types/context';

// Export all configurations
export const contextConfigs: Record<ContextType | 'system', ContextConfig> = {
    'real-estate': realEstateConfig,
    restaurants: restaurantsConfig,
    education: educationConfig,
    nightlife: nightlifeConfig,
    social: socialConfig,
    services: servicesConfig,
    transit: transitConfig,
    culture: cultureConfig,
    jobs: jobsConfig,
    health: healthConfig,
    tourism: tourismConfig,
    news: newsConfig,
    hotels: hotelsConfig,
    dating: datingConfig,
    transport: transportConfig,
    shops: shopsConfig,
    classified: classifiedConfig,
    'consumer-goods': consumerGoodsConfig,
    'financial-services': financialServicesConfig,
    entertainment: entertainmentConfig,
    aisearch: aiSearchConfig,
    aiinference: aiInferenceConfig,
    aipedia: aiPediaConfig,
    system: adminConfig
};

// Core layout configuration
export const layoutConfig = {
    sidebar: {
        defaultWidth: '2.5%',
        collapsedWidth: '2.5%',
        expandedWidth: '25%'
    },
    header: { height: '5%' },
    footer: { height: '5%' },
    content: {
        defaultWidth: '50%',
        maxWidth: '95%'
    },
    buffer: { width: '22.5%' }
};

// Re-export common menu items
export { commonUserMenu };

// System admin menu items
export const systemAdminMenu: NavigationItem[] = [
    {
        label: 'Dashboard',
        path: '/admin/system/dashboard',
        icon: 'dashboard',
        description: 'System overview dashboard',
        requiresAuth: true,
        roles: ['admin'],
        metadata: {
            order: 1,
            category: 'admin',
            features: ['admin-dashboard']
        }
    },
    {
        label: 'Users',
        path: '/admin/system/users',
        icon: 'group',
        description: 'Manage system users',
        requiresAuth: true,
        roles: ['admin'],
        metadata: {
            order: 2,
            category: 'admin',
            features: ['user-management']
        }
    },
    {
        label: 'Content',
        path: '/admin/system/content',
        icon: 'article',
        description: 'Manage system content',
        requiresAuth: true,
        roles: ['admin'],
        metadata: {
            order: 3,
            category: 'admin',
            features: ['content-management']
        }
    },
    {
        label: 'Analytics',
        path: '/admin/system/analytics',
        icon: 'analytics',
        description: 'System analytics and reporting',
        requiresAuth: true,
        roles: ['admin'],
        metadata: {
            order: 4,
            category: 'admin',
            features: ['analytics']
        }
    }
];

// Role-based access configuration
export const navigationAccess = {
    roles: {
        user: ['main', 'user'],
        admin: ['main', 'user', 'admin'],
        superadmin: ['main', 'user', 'admin', 'system']
    },
    requiresAuth: {
        user: true,
        admin: true,
        system: true
    }
};

// Core application configuration
export const appConfig = {
    name: 'AI-Powered Context-Aware Platform',
    version: '1.0.0',
    api: {
        baseUrl: '/api',
        version: 'v1',
        timeout: 30000
    },
    auth: {
        tokenKey: 'auth_token',
        refreshTokenKey: 'refresh_token',
        expiryKey: 'token_expiry'
    }
};

// Dynamic context loading helper
export const loadContext = async (ContextType: ContextType): Promise<ContextConfig | null> => {
    try {
        return contextConfigs[ContextType] || null;
    } catch (error) {
        console.error(`Failed to load context: ${ContextType}`, error);
        return null;
    }
};