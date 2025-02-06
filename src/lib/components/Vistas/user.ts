import type { VistaConfig } from '$lib/types/vista';
import { defaultGlassConfig } from '$lib/components/Theme/configs/glassConfig';
import type { FeatureConfig } from '$lib/types/feature';

export const userConfig: VistaConfig = {
    type: 'user',
    label: 'User',
    icon: 'person',
    description: 'User account management and preferences',
    theme: {
        colors: {
            primary: '#2563eb',
            secondary: '#4f46e5',
            accent: '#06b6d4',
            background: '#ffffff'
        }
    },
    routes: {
        profile: {
            path: '/user/profile',
            component: 'pages/ProfilePage.svelte',
            meta: {
                title: 'Profile',
                description: 'View and edit your profile',
                requiresAuth: true,
                roles: ['user']
            }
        },
        activity: {
            path: '/user/activity',
            component: 'pages/ActivityPage.svelte',
            meta: {
                title: 'Activity',
                description: 'View your activity history',
                requiresAuth: true,
                roles: ['user']
            }
        },
        settings: {
            path: '/user/settings',
            component: 'pages/SettingsPage.svelte',
            meta: {
                title: 'Settings',
                description: 'Manage your account settings',
                requiresAuth: true,
                roles: ['user']
            }
        },
        notifications: {
            path: '/user/notifications',
            component: 'pages/NotificationsPage.svelte',
            meta: {
                title: 'Notifications',
                description: 'View and manage notifications',
                requiresAuth: true,
                roles: ['user']
            }
        },
        security: {
            path: '/user/security',
            component: 'pages/SecurityPage.svelte',
            meta: {
                title: 'Security',
                description: 'Manage account security',
                requiresAuth: true,
                roles: ['user']
            }
        }
    },
    navigation: {
        items: [
            {
                id: 'user-account',
                label: 'Account',
                path: '/user/profile',
                icon: 'person',
                description: 'User account management',
                requiresAuth: true,
                roles: ['user'],
                subItems: [
                    { id: 'profile', label: 'Profile', path: '/user/profile', icon: 'person', description: 'View and edit profile' },
                    { id: 'activity', label: 'Activity', path: '/user/activity', icon: 'history', description: 'View activity history' },
                    { id: 'settings', label: 'Settings', path: '/user/settings', icon: 'settings', description: 'Account settings' },
                    { id: 'notifications', label: 'Notifications', path: '/user/notifications', icon: 'notifications', description: 'Manage notifications' },
                    { id: 'security', label: 'Security', path: '/user/security', icon: 'security', description: 'Account security' }
                ]
            }
        ]
    },
    features: {
        profile: {
            enabled: true,
            id: 'profile',
            name: 'User Profile',
            capabilities: ['edit', 'view', 'delete'],
            config: {
                provider: 'internal'
            }
        },
        activity: {
            enabled: true,
            id: 'activity',
            name: 'Activity Tracking',
            capabilities: ['history', 'export'],
            config: {
                retention: 30 // days
            }
        },
        notifications: {
            enabled: true,
            id: 'notifications',
            name: 'Notifications',
            capabilities: ['email', 'push', 'in-app'],
            config: {
                provider: 'internal'
            }
        },
        security: {
            enabled: true,
            id: 'security',
            name: 'Security Features',
            capabilities: ['2fa', 'password-reset', 'session-management'],
            config: {
                provider: 'internal'
            }
        },
        settings: { enabled: true },
        preferences: { enabled: true },
        themes: { enabled: true },
        help: { enabled: true },
        feedback: { enabled: true }
    },
    metadata: {
        version: '1.0.0',
        category: 'user',
        tags: ['profile', 'settings', 'activity', 'security'],
        permissions: ['read:profile', 'write:profile', 'read:activity', 'manage:security'],
        analytics: {
            trackingId: 'UA-USER-1',
            features: ['profile-views', 'activity-tracking', 'security-events']
        },
        cache: {
            ttl: 300,
            strategy: 'network-first'
        }
    },
    social: [
        {
            platform: 'github',
            icon: 'code',
            label: 'GitHub',
            url: 'https://github.com/user',
            handle: '@user'
        },
        {
            platform: 'twitter',
            icon: 'flutter_dash',
            label: 'Twitter',
            url: 'https://twitter.com/user',
            handle: '@user'
        },
        {
            platform: 'linkedin',
            icon: 'work',
            label: 'LinkedIn',
            url: 'https://linkedin.com/in/user',
            handle: 'user'
        }
    ]
};