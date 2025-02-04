import { realEstateConfig } from './real-estate';
import { aiSearchConfig } from './aisearch';
import { adminConfig } from './systemadmin';
import { userConfig } from './user';

import type { VistaConfig, NavigationItem } from '$lib/types/navigation';
import type { VistaType } from '$lib/types/vista';

// Export all configurations
export const vistaConfigs: Record<VistaType, VistaConfig> = {
    'real-estate': realEstateConfig,
    'aisearch': aiSearchConfig,
    'systemadmin': adminConfig,
    'user': userConfig
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


// System admin menu items
export const systemAdminMenu: NavigationItem[] = [
    {
        id: 'admin-dashboard',
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
    }
];

// Navigation access control
export const navigationAccess = {
    roles: {
        admin: ['admin', 'system', 'user'],
        user: ['user'],
        guest: ['public']
    }
};

// Dynamic vista loading helper
export async function loadVista(vistaId: string): Promise<VistaConfig | null> {
    try {
        const module = await import(`./${vistaId}`);
        return module.default as VistaConfig;
    } catch (error) {
        console.error(`Failed to load vista: ${vistaId}`, error);
        return null;
    }
}