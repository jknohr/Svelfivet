import type { VistaConfig } from '$lib/types/vista';
import type { FeatureConfig } from '$lib/types/feature';

export const userConfig: VistaConfig = {
    type: 'user',
    label: 'User',
    icon: 'person',
    description: 'User account management and preferences',
    theme: {
        primary: '#455A64',
        secondary: '#607D8B',
        accent: '#00BCD4'
    },
    routes: {
        browse: {
            id: 'browse',
            label: 'My Activity',
            path: '/user/browse',
            icon: 'history',
            description: 'Browse your activity',
            requiresAuth: true,
            metadata: {
                category: 'user',
                tags: ['activity', 'history'],
                permissions: ['read:activity']
            }
        },
        profile: {
            id: 'profile',
            label: 'Profile',
            path: '/user/profile',
            icon: 'person',
            description: 'View and edit your profile',
            requiresAuth: true,
            metadata: {
                category: 'user',
                tags: ['profile', 'settings'],
                permissions: ['read:profile', 'write:profile']
            }
        }
    },
    navigation: {
        items: [
            {
                id: 'profile',
                label: 'Profile',
                path: '/user/profile',
                icon: 'person',
                description: 'View and edit your profile'
            },
            {
                id: 'activity',
                label: 'My Activity',
                path: '/user/browse',
                icon: 'history',
                description: 'Browse your activity'
            }
        ]
    },
    features: {
        'profile-edit': true,
        'activity-tracking': true,
        'notifications': {
            id: 'notifications',
            name: 'Notifications',
            description: 'User notification preferences and settings',
            enabled: true,
            capabilities: ['email', 'push'],
            config: {
                email: true,
                push: true
            }
        }
    },
    metadata: {
        version: '1.0.0',
        category: 'user',
        tags: ['profile', 'settings', 'activity'],
        permissions: ['read:profile', 'write:profile', 'read:activity'],
        analytics: {
            trackingId: 'UA-USER-1',
            features: ['profile-views', 'activity-tracking']
        },
        cache: {
            ttl: 300,
            strategy: 'network-first'
        }
    }
};