import { adminConfig } from './systemadmin';
import { userConfig } from './user';

import type { NavigationItem } from '$lib/types/navigation';
import type { VistaConfig, VistaType } from '$lib/types/vista';
import type { FeatureConfig } from '$lib/types/feature';

export const realEstateConfig: VistaConfig = {
    type: 'real-estate',
    label: 'Real Estate',
    icon: 'apartment',
    description: 'Discover and explore properties',
    theme: {
        colors: {
            primary: '#2196F3',
            secondary: '#1976D2',
            accent: '#64B5F6',
            surface: '#FFFFFF'
        },
        typography: {
            fontFamily: {
                base: 'system-ui',
                heading: 'system-ui',
                mono: 'monospace'
            },
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                xxl: '1.5rem'
            },
            fontWeight: {
                light: 300,
                regular: 400,
                medium: 500,
                bold: 700
            },
            lineHeight: {
                tight: 1.25,
                normal: 1.5,
                relaxed: 1.75
            }
        },
        components: {
            node: {
                background: '#FFFFFF',
                borderColor: '#E0E0E0',
                borderWidth: '1px',
                textColor: '#000000'
            },
            edge: {
                color: '#E0E0E0',
                width: '1px',
                hoverColor: '#2196F3',
                selectedColor: '#1976D2'
            },
            anchor: {
                size: '8px',
                color: '#E0E0E0',
                hoverColor: '#2196F3',
                activeColor: '#1976D2'
            },
            tooltip: {
                background: '#FFFFFF',
                textColor: '#000000',
                borderRadius: '4px',
                padding: '8px'
            },
            controls: {
                background: '#FFFFFF',
                border: '#E0E0E0',
                text: '#000000',
                icon: '#000000',
                hoverState: {
                    background: '#F5F5F5',
                    border: '#E0E0E0'
                },
                activeState: {
                    background: '#EEEEEE'
                }
            },
            glass: {
                blur: '10px',
                opacity: 0.8,
                borderOpacity: 0.2,
                lightEffect: true,
                lightIntensity: 0.5,
                lightColor: '#FFFFFF',
                tint: '#FFFFFF',
                glowRadius: '10px'
            }
        },
        transitionConfig: {
            durationValues: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms'
            },
            easingValues: {
                standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
                accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
                decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
                sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
                linear: 'linear'
            }
        }
    },
    social: [
        {
            platform: 'facebook',
            icon: '𝕏',
            label: 'Facebook',
            url: 'https://Facebook.com/looking4realestate',
            handle: '@realestate'
        },
        {
            platform: 'youtube',
            icon: '🔗',
            label: 'Youtube',
            url: 'https://youtube.com/looking4realestate',
            handle: 'realestate'
        },
        {
            platform: 'instagram',
            icon: '📸',
            label: 'Instagram',
            url: 'https://instagram.com/looking4realestate',
            handle: '@realestate'
        }
    ],
    routes: {
        browse: {
            meta: { type: 'browse' },
            path: '/real-estate/browse',
            label: 'Browse',
            icon: 'search',
            description: 'Browse properties'
        },
        list: {
            meta: { type: 'list' },
            path: '/real-estate/list',
            label: 'List',
            icon: 'add_home',
            description: 'List your property'
        },
        explore: {
            meta: { type: 'explore' },
            path: '/real-estate/explore',
            label: 'Explore',
            icon: 'explore',
            description: 'Explore neighborhoods'
        },
        services: {
            meta: { type: 'services' },
            path: '/real-estate/services',
            label: 'Services',
            icon: 'home_repair_service',
            description: 'Property services'
        },
        connect: {
            meta: { type: 'connect' },
            path: '/real-estate/connect',
            label: 'Connect',
            icon: 'link',
            description: 'Connect with agents'
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
            id: 'map',
            name: 'Map Integration',
            enabled: true,
            provider: 'mapbox',
            capabilities: ['location-search', 'routing', 'geocoding'],
            config: {
                provider: 'mapbox'
            }
        },
        chat: {
            id: 'chat',
            name: 'Chat System',
            enabled: true,
            provider: 'telnyx',
            capabilities: ['text', 'media', 'presence'],
            config: {
                provider: 'telnyx'
            }
        },
        voice: {
            enabled: true,
            capabilities: ['call', 'voicemail', 'transcription'],
            config: {
                provider: 'speechomatic'
            }
        },
        ai: {
            enabled: true,
            capabilities: ['valuation', 'recommendations', 'market-analysis'],
            config: {
                provider: 'openai'
            }
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