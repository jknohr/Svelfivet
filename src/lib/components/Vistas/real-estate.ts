import { adminConfig } from './systemadmin';
import { userConfig } from './user';

import type { NavigationItem, VistaConfig, VistaType } from '$lib/types/vista';
import type { FeatureConfig } from '$lib/types/feature';

export const realEstateConfig: VistaConfig = {
    type: 'real-estate',
    label: 'Real Estate',
    icon: 'apartment',
    description: 'Discover and explore properties',
    theme: {
        colors: {
            primary: '#2563eb',
            secondary: '#4f46e5',
            accent: '#06b6d4',
            background: '#ffffff'
        }
    },
 
 routes: {
        browse: {
            path: '/admin/browse',
            component: 'pages/BrowsePage.svelte',
            meta: {
                title: 'Browse Systems',
                description: 'Browse system components',
                requiresAuth: true,
                roles: ['admin']
            }
        },
        list: {
            path: '/admin/list',
            component: 'pages/ListPage.svelte',
            meta: {
                title: 'Add Component',
                description: 'Add new system component',
                requiresAuth: true,
                roles: ['admin']
            }
        },
        explore: {
            path: '/admin/explore',
            component: 'pages/ExplorePage.svelte',
            meta: {
                title: 'System Health',
                description: 'Monitor system health',
                requiresAuth: true,
                roles: ['admin']
            }
        },
        services: {
            path: '/admin/services',
            component: 'pages/ServicesPage.svelte',
            meta: {
                title: 'System Services',
                description: 'Manage system services',
                requiresAuth: true,
                roles: ['admin']
            }
        },
        connect: {
            path: '/admin/connect',
            component: 'pages/ConnectPage.svelte',
            meta: {
                title: 'Support',
                description: 'System support and help',
                requiresAuth: true,
                roles: ['admin']
            }
        }
    },
    navigation: {
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                path: '/real-estate/dashboard',
                icon: 'dashboard',
                description: 'Real estate overview'
            },
            {
                id: 'search',
                label: 'Search',
                path: '/real-estate/search',
                icon: 'search',
                description: 'Find properties'
            },
            {
                id: 'market',
                label: 'Market',
                path: '/real-estate/market',
                icon: 'trending_up',
                description: 'Market analysis'
            },
            // User specific items with requiresAuth
            {
                id: 'my-properties',
                label: 'My Properties',
                path: '/real-estate/user/properties',
                icon: 'home',
                description: 'Manage your properties',
                requiresAuth: true
            },
            {
                id: 'favorites',
                label: 'Favorites',
                path: '/real-estate/user/favorites',
                icon: 'favorite',
                description: 'View your favorite properties',
                requiresAuth: true
            },
            {
                id: 'searches',
                label: 'Saved Searches',
                path: '/real-estate/user/searches',
                icon: 'search',
                description: 'View your saved property searches',
                requiresAuth: true
            },
            {
                id: 'calendar',
                label: 'Calendar',
                path: '/real-estate/user/calendar',
                icon: 'calendar_today',
                description: 'View your property appointments',
                requiresAuth: true
            },
            {
                id: 'property-management',
                label: 'Property Management',
                path: '/admin/real-estate/properties',
                icon: 'apartment',
                description: 'Manage properties',
                roles: ['admin']
            },
            {
                id: 'client-management',
                label: 'Client Management',
                path: '/admin/real-estate/clients',
                icon: 'groups',
                description: 'Manage real estate clients',
                roles: ['admin']
            },
            {
                id: 'ai-agent-management',
                label: 'Agent Management',
                path: '/admin/real-estate/agents',
                icon: 'groups',
                description: 'Manage ai real estate agents',
                roles: ['admin']
            },
            {
                id: 'map-management',
                label: 'Map Management',
                path: '/admin/real-estate/maps',
                icon: 'map',
                description: 'Manage maps',
                roles: ['admin']
            }
        ]
    },


    
    features: {
        map: {
            enabled: true,
            id: 'map',
            name: 'Map Integration',
            provider: 'mapbox',
            capabilities: ['location-search', 'routing', 'geocoding'],
            config: {
                provider: 'mapbox'
            }
        },
        chat: {
            enabled: true,
            id: 'chat',
            name: 'Chat System',
            provider: 'telnyx',
            capabilities: ['text', 'media', 'presence'],
            config: {
                provider: 'telnyx'
            }
        },
        voice: {
            enabled: true,
            id: 'voice',
            name: 'Voice System',
            capabilities: ['call', 'voicemail', 'transcription'],
            config: {
                provider: 'speechomatic'
            }
        },
        ai: {
            enabled: true,
            id: 'ai',
            name: 'AI Features',
            capabilities: ['valuation', 'recommendations', 'market-analysis'],
            config: {
                provider: 'openai'
            }
        },
        monitoring: { enabled: true },
        analytics: { enabled: true },
        search: { enabled: true },
        notifications: { enabled: true },
        help: { enabled: true }
    },
    metadata: {
        version: '1.0.0',
        category: 'Real Estate',
        tags: ['property', 'real-estate', 'agents'],
        permissions: ['view_properties', 'manage_properties'],
        analytics: {
            trackingId: 'RE-001',
            features: ['property_views', 'agent_contact']
        },
        cache: {
            ttl: 3600,
            strategy: 'stale-while-revalidate'
        }
    },
    social: [
        {
            platform: 'facebook',
            icon: 'facebook',
            label: 'Facebook',
            url: 'https://facebook.com/looking4realestate',
            handle: '@realestate'
        },
        {
            platform: 'youtube',
            icon: 'youtube',
            label: 'Youtube',
            url: 'https://youtube.com/looking4realestate',
            handle: '@realestate'
        },
        {
            platform: 'instagram',
            icon: 'instagram',
            label: 'Instagram',
            url: 'https://instagram.com/looking4realestate',
            handle: '@realestate'
        }
    ]

};

export default realEstateConfig;