import type { ContextConfig } from '$lib/components/Templates/Canvas/types/context';
import { commonUserMenu } from './common';

export const realEstateConfig: ContextConfig = {
    type: 'real-estate',
    label: 'Real Estate',
    icon: 'apartment',
    description: 'Discover and explore properties',
    theme: {
        primary: '#2196F3',
        secondary: '#1976D2',
        accent: '#64B5F6',
        background: '#FFFFFF'
    },
    routes: {
        browse: {
            type: 'browse',
            path: '/real-estate/browse',
            label: 'Browse',
            icon: 'search',
            description: 'Browse properties'
        },
        list: {
            type: 'list',
            path: '/real-estate/list',
            label: 'List',
            icon: 'add_home',
            description: 'List your property'
        },
        explore: {
            type: 'explore',
            path: '/real-estate/explore',
            label: 'Explore',
            icon: 'explore',
            description: 'Explore neighborhoods'
        },
        services: {
            type: 'services',
            path: '/real-estate/services',
            label: 'Services',
            icon: 'home_repair_service',
            description: 'Property services'
        },
        connect: {
            type: 'connect',
            path: '/real-estate/connect',
            label: 'Connect',
            icon: 'link',
            description: 'Connect with agents'
        }
    },
    navigation: {
        main: [
            {
                type: 'link',
                label: 'Browse',
                path: '/real-estate/browse',
                icon: 'search',
                description: 'Find properties'
            },
            {
                type: 'link',
                label: 'Market',
                path: '/real-estate/market',
                icon: 'trending_up',
                description: 'Market analysis'
            }
        ],
        user: [
            ...commonUserMenu,
            {
                type: 'link',
                label: 'My Properties',
                path: '/real-estate/user/properties',
                icon: 'home',
                description: 'Manage your properties'
            }
        ],
        admin: [
            {
                type: 'link',
                label: 'Property Management',
                path: '/admin/real-estate/properties',
                icon: 'admin_panel_settings',
                description: 'Manage properties'
            },
            {
                type: 'link',
                label: 'Agent Management',
                path: '/admin/real-estate/agents',
                icon: 'people',
                description: 'Manage agents'
            }
        ]
    },
    features: {
        map: {
            enabled: true,
            provider: 'mapbox',
            capabilities: ['location-search', 'routing', 'geocoding']
        },
        chat: {
            enabled: true,
            provider: 'telnyx',
            capabilities: ['text', 'media', 'presence']
        },
        voice: {
            enabled: true,
            provider: 'speechomatic',
            capabilities: ['call', 'voicemail', 'transcription']
        },
        ai: {
            enabled: true,
            provider: 'openai',
            capabilities: ['valuation', 'recommendations', 'market-analysis']
        }
    },
    metadata: {
        version: '2.0.0',
        category: 'real-estate',
        tags: ['properties', 'homes', 'real-estate'],
        permissions: ['basic', 'property-management']
    }
};

export default realEstateConfig;