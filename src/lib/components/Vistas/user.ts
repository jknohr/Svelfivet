import type { ContextConfig } from '$lib/types/navigation';

export const userConfig: ContextConfig = {
    id: 'user',
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
                order: 1,
                category: 'activity',
                features: ['activity-history']
            }
        },
        list: {
            id: 'list',
            label: 'My Content',
            path: '/user/list',
            icon: 'post_add',
            description: 'Manage your content',
            requiresAuth: true,
            metadata: {
                order: 2,
                category: 'content',
                features: ['content-management']
            }
        },
        explore: {
            id: 'explore',
            label: 'Preferences',
            path: '/user/explore',
            icon: 'tune',
            description: 'Explore and set preferences',
            requiresAuth: true,
            metadata: {
                order: 3,
                category: 'preferences',
                features: ['user-preferences']
            }
        },
        services: {
            id: 'services',
            label: 'Account Services',
            path: '/user/services',
            icon: 'manage_accounts',
            description: 'Account-related services',
            requiresAuth: true,
            metadata: {
                order: 4,
                category: 'services',
                features: ['account-services']
            }
        },
        connect: {
            id: 'connect',
            label: 'Help & Support',
            path: '/user/connect',
            icon: 'help',
            description: 'Get help and support',
            requiresAuth: true,
            metadata: {
                order: 5,
                category: 'support',
                features: ['user-support']
            }
        }
    },
    navigation: {
        main: [
            {
                label: 'Profile',
                path: '/user/profile',
                icon: 'person',
                description: 'Profile management',
                requiresAuth: true,
                subItems: [
                    { label: 'Edit Profile', path: '/user/profile/edit', icon: 'edit', description: 'Edit your profile' },
                    { label: 'Privacy', path: '/user/profile/privacy', icon: 'privacy_tip', description: 'Privacy settings' },
                    { label: 'Notifications', path: '/user/profile/notifications', icon: 'notifications', description: 'Notification settings' },
                    { label: 'Security', path: '/user/profile/security', icon: 'security', description: 'Security settings' },
                    { label: 'Preferences', path: '/user/profile/preferences', icon: 'tune', description: 'User preferences' }
                ]
            },
            {
                label: 'Content',
                path: '/user/content',
                icon: 'article',
                description: 'Content management',
                requiresAuth: true,
                subItems: [
                    { label: 'My Posts', path: '/user/content/posts', icon: 'post_add', description: 'Manage posts' },
                    { label: 'My Media', path: '/user/content/media', icon: 'perm_media', description: 'Manage media' },
                    { label: 'Favorites', path: '/user/content/favorites', icon: 'favorite', description: 'View favorites' },
                    { label: 'Saved', path: '/user/content/saved', icon: 'bookmark', description: 'View saved items' },
                    { label: 'History', path: '/user/content/history', icon: 'history', description: 'View history' }
                ]
            },
            {
                label: 'Communication',
                path: '/user/communication',
                icon: 'chat',
                description: 'Communication center',
                requiresAuth: true,
                subItems: [
                    { label: 'Messages', path: '/user/communication/messages', icon: 'message', description: 'View messages' },
                    { label: 'Notifications', path: '/user/communication/notifications', icon: 'notifications', description: 'View notifications' },
                    { label: 'Contacts', path: '/user/communication/contacts', icon: 'contacts', description: 'Manage contacts' },
                    { label: 'Blocked', path: '/user/communication/blocked', icon: 'block', description: 'Blocked users' },
                    { label: 'Email Settings', path: '/user/communication/email', icon: 'email', description: 'Email preferences' }
                ]
            }
        ],
        user: [
            {
                label: 'Account',
                path: '/user/account',
                icon: 'manage_accounts',
                description: 'Account management',
                requiresAuth: true,
                metadata: {
                    category: 'account',
                    features: ['account-management']
                }
            },
            {
                label: 'Billing',
                path: '/user/billing',
                icon: 'payment',
                description: 'Billing management',
                requiresAuth: true,
                metadata: {
                    category: 'billing',
                    features: ['billing-management']
                }
            },
            {
                label: 'Data',
                path: '/user/data',
                icon: 'storage',
                description: 'Data management',
                requiresAuth: true,
                metadata: {
                    category: 'data',
                    features: ['data-management']
                }
            }
        ],
        admin: []
    },
    features: {
        map: false,
        chat: true,
        voice: true,
        ai: true
    },
    metadata: {
        version: '1.0.0',
        category: 'user',
        tags: ['user', 'account', 'profile'],
        permissions: ['basic', 'user-management']
    }
}; 