import type { ContextConfig } from '$lib/types/navigation';
import { commonUserMenu } from './common';

export const adminConfig: ContextConfig = {
    id: 'admin',
    label: 'Admin',
    icon: 'admin_panel_settings',
    description: 'System administration and management',
    theme: {
        primary: '#263238',
        secondary: '#37474F',
        accent: '#FF5722'
    },
    routes: {
        browse: {
            id: 'browse',
            label: 'Browse Systems',
            path: '/admin/browse',
            icon: 'dashboard',
            description: 'Browse system components',
            requiresAuth: true,
            roles: ['admin'],
            metadata: {
                order: 1,
                category: 'system',
                features: ['system-browse']
            }
        },
        list: {
            id: 'list',
            label: 'Add Component',
            path: '/admin/list',
            icon: 'add_circle',
            description: 'Add new system component',
            requiresAuth: true,
            roles: ['admin'],
            metadata: {
                order: 2,
                category: 'system',
                features: ['component-creation']
            }
        },
        explore: {
            id: 'explore',
            label: 'System Health',
            path: '/admin/explore',
            icon: 'health_and_safety',
            description: 'Monitor system health',
            requiresAuth: true,
            roles: ['admin'],
            metadata: {
                order: 3,
                category: 'monitoring',
                features: ['health-monitoring']
            }
        },
        services: {
            id: 'services',
            label: 'System Services',
            path: '/admin/services',
            icon: 'miscellaneous_services',
            description: 'Manage system services',
            requiresAuth: true,
            roles: ['admin'],
            metadata: {
                order: 4,
                category: 'services',
                features: ['service-management']
            }
        },
        connect: {
            id: 'connect',
            label: 'Support',
            path: '/admin/connect',
            icon: 'support',
            description: 'System support and help',
            requiresAuth: true,
            roles: ['admin'],
            metadata: {
                order: 5,
                category: 'support',
                features: ['admin-support']
            }
        }
    },
    navigation: {
        main: [
            {
                label: 'System',
                path: '/admin/system',
                icon: 'admin_panel_settings',
                description: 'System administration',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { label: 'Dashboard', path: '/admin/system/dashboard', icon: 'dashboard', description: 'System overview' },
                    { label: 'Users', path: '/admin/system/users', icon: 'group', description: 'User management' },
                    { label: 'Roles', path: '/admin/system/roles', icon: 'admin_panel_settings', description: 'Role management' },
                    { label: 'Permissions', path: '/admin/system/permissions', icon: 'security', description: 'Permission management' },
                    { label: 'Settings', path: '/admin/system/settings', icon: 'settings', description: 'System settings' },
                    {
                        label: 'Resource Management',
                        path: '/admin/system/resources',
                        icon: 'memory',
                        description: 'System resource management',
                        subItems: [
                            { label: 'CPU & Memory', path: '/admin/system/resources/performance', icon: 'speed' },
                            { label: 'Storage', path: '/admin/system/resources/storage', icon: 'storage' },
                            { label: 'Network', path: '/admin/system/resources/network', icon: 'network_check' }
                        ]
                    }
                ]
            },
            {
                label: 'Monitoring',
                path: '/admin/monitoring',
                icon: 'monitoring',
                description: 'System monitoring',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { label: 'Performance', path: '/admin/monitoring/performance', icon: 'speed', description: 'Performance monitoring' },
                    { label: 'Logs', path: '/admin/monitoring/logs', icon: 'receipt_long', description: 'System logs' },
                    { label: 'Alerts', path: '/admin/monitoring/alerts', icon: 'notification_important', description: 'System alerts' },
                    { label: 'Analytics', path: '/admin/monitoring/analytics', icon: 'analytics', description: 'System analytics' },
                    { label: 'Reports', path: '/admin/monitoring/reports', icon: 'summarize', description: 'System reports' }
                ]
            },
            {
                label: 'Content',
                path: '/admin/content',
                icon: 'article',
                description: 'Content management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { label: 'Pages', path: '/admin/content/pages', icon: 'web', description: 'Page management' },
                    { label: 'Media', path: '/admin/content/media', icon: 'perm_media', description: 'Media management' },
                    { label: 'Templates', path: '/admin/content/templates', icon: 'dashboard_customize', description: 'Template management' },
                    { label: 'Categories', path: '/admin/content/categories', icon: 'category', description: 'Category management' },
                    { label: 'Tags', path: '/admin/content/tags', icon: 'local_offer', description: 'Tag management' }
                ]
            },
            {
                label: 'AI Services',
                path: '/admin/ai',
                icon: 'smart_toy',
                description: 'AI services management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { label: 'LLM Integration', path: '/admin/ai/llm', icon: 'psychology' },
                    {
                        label: 'Model Management',
                        path: '/admin/ai/models',
                        icon: 'model_training',
                        subItems: [
                            { label: 'Training', path: '/admin/ai/models/training', icon: 'school' },
                            { label: 'Deployment', path: '/admin/ai/models/deployment', icon: 'rocket_launch' },
                            { label: 'Monitoring', path: '/admin/ai/models/monitoring', icon: 'monitoring' }
                        ]
                    },
                    { label: 'Voice Services', path: '/admin/ai/voice', icon: 'record_voice_over', description: 'Manage Speechomatic integration' },
                    { label: 'Agent Builder', path: '/admin/ai/agents', icon: 'engineering', description: 'Build and manage AI agents' },
                    { label: 'Prompts', path: '/admin/ai/prompts', icon: 'chat', description: 'Prompt management' }
                ]
            },
            {
                label: 'Automation',
                path: '/admin/automation',
                icon: 'auto_fix_high',
                description: 'Automation management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { label: 'Workflows', path: '/admin/automation/workflows', icon: 'account_tree', description: 'Manage automation workflows' },
                    { label: 'Rules', path: '/admin/automation/rules', icon: 'rule', description: 'Automation rules' },
                    { label: 'Triggers', path: '/admin/automation/triggers', icon: 'bolt', description: 'Automation triggers' },
                    { label: 'Actions', path: '/admin/automation/actions', icon: 'play_circle', description: 'Automation actions' },
                    { label: 'Schedules', path: '/admin/automation/schedules', icon: 'schedule', description: 'Scheduled automations' }
                ]
            },
            {
                label: 'Integration',
                path: '/admin/integration',
                icon: 'integration_instructions',
                description: 'Integration management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { label: 'API Keys', path: '/admin/integration/api-keys', icon: 'key', description: 'Manage API keys' },
                    { label: 'Webhooks', path: '/admin/integration/webhooks', icon: 'webhook', description: 'Manage webhooks' },
                    { label: 'Services', path: '/admin/integration/services', icon: 'cloud', description: 'External services' },
                    { label: 'Events', path: '/admin/integration/events', icon: 'event_note', description: 'Event management' },
                    { label: 'Logs', path: '/admin/integration/logs', icon: 'receipt_long', description: 'Integration logs' }
                ]
            }
        ],
        user: [
            ...commonUserMenu,
            {
                label: 'Admin Tools',
                path: '/admin/tools',
                icon: 'build',
                description: 'Administrative tools',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'tools',
                    features: ['admin-tools']
                }
            }
        ],
        admin: [
            {
                label: 'System Config',
                path: '/admin/config',
                icon: 'settings_applications',
                description: 'System configuration',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'config',
                    features: ['system-config']
                },
                subItems: [
                    { label: 'General', path: '/admin/config/general', icon: 'settings' },
                    { label: 'Security', path: '/admin/config/security', icon: 'security' },
                    { label: 'Performance', path: '/admin/config/performance', icon: 'speed' }
                ]
            },
            {
                label: 'Security',
                path: '/admin/security',
                icon: 'security',
                description: 'Security management',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'security',
                    features: ['security-management']
                }
            },
            {
                label: 'Backup',
                path: '/admin/backup',
                icon: 'backup',
                description: 'System backup',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'backup',
                    features: ['system-backup']
                }
            },
            {
                label: 'AI Config',
                path: '/admin/ai/config',
                icon: 'settings_applications',
                description: 'AI services configuration',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'ai',
                    features: ['ai-config']
                }
            },
            {
                label: 'Automation Config',
                path: '/admin/automation/config',
                icon: 'tune',
                description: 'Automation configuration',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'automation',
                    features: ['automation-config']
                }
            }
        ]
    },
    features: {
        map: false,
        chat: true,
        voice: true,
        ai: true,
        monitoring: true,
        analytics: true
    },
    metadata: {
        version: '2.0.0',
        category: 'system',
        tags: ['admin', 'system', 'management'],
        permissions: ['admin', 'system-management'],
        features: [
            'advanced-monitoring',
            'ai-integration',
            'resource-management',
            'security-controls'
        ]
    }
};