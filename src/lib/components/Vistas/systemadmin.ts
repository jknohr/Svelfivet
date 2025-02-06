import type { VistaConfig } from '$lib/types/vista';

export const adminConfig: VistaConfig = {
    type: 'systemadmin',
    label: 'Admin',
    icon: 'admin_panel_settings',
    description: 'System administration and management',
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
                id: '/admin/system',
                label: 'System',
                path: '/admin/system',
                icon: 'admin_panel_settings',
                description: 'System administration',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { id: '/admin/system/dashboard', label: 'Dashboard', path: '/admin/system/dashboard', icon: 'dashboard', description: 'System overview' },
                    { id: '/admin/system/users', label: 'Users', path: '/admin/system/users', icon: 'group', description: 'User management' },
                    { id: '/admin/system/roles', label: 'Roles', path: '/admin/system/roles', icon: 'admin_panel_settings', description: 'Role management' },
                    { id: '/admin/system/permissions', label: 'Permissions', path: '/admin/system/permissions', icon: 'security', description: 'Permission management' },
                    { id: '/admin/system/settings', label: 'Settings', path: '/admin/system/settings', icon: 'settings', description: 'System settings' },
                    {
                        id: '/admin/system/resources',
                        label: 'Resource Management',
                        path: '/admin/system/resources',
                        icon: 'memory',
                        description: 'System resource management',
                        subItems: [
                            { id: '/admin/system/resources/performance', label: 'CPU & Memory', path: '/admin/system/resources/performance', icon: 'speed' },
                            { id: '/admin/system/resources/storage', label: 'Storage', path: '/admin/system/resources/storage', icon: 'storage' },
                            { id: '/admin/system/resources/network', label: 'Network', path: '/admin/system/resources/network', icon: 'network_check' }
                        ]
                    }
                ]
            },
            {
                id: '/admin/monitoring',
                label: 'Monitoring',
                path: '/admin/monitoring',
                icon: 'monitoring',
                description: 'System monitoring',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { id: '/admin/monitoring/performance', label: 'Performance', path: '/admin/monitoring/performance', icon: 'speed', description: 'Performance monitoring' },
                    { id: '/admin/monitoring/logs', label: 'Logs', path: '/admin/monitoring/logs', icon: 'receipt_long', description: 'System logs' },
                    { id: '/admin/monitoring/alerts', label: 'Alerts', path: '/admin/monitoring/alerts', icon: 'notification_important', description: 'System alerts' },
                    { id: '/admin/monitoring/analytics', label: 'Analytics', path: '/admin/monitoring/analytics', icon: 'analytics', description: 'System analytics' },
                    { id: '/admin/monitoring/reports', label: 'Reports', path: '/admin/monitoring/reports', icon: 'summarize', description: 'System reports' },
                    { id: '/admin/monitoring/settings', label: 'Section Settings', path: '/admin/monitoring/settings', icon: 'settings', description: 'Configure monitoring preferences' }
                ]
            },
            {
                id: '/admin/content',
                label: 'Content',
                path: '/admin/content',
                icon: 'article',
                description: 'Content management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { id: '/admin/content/pages', label: 'Pages', path: '/admin/content/pages', icon: 'web', description: 'Page management' },
                    { id: '/admin/content/media', label: 'Media', path: '/admin/content/media', icon: 'perm_media', description: 'Media management' },
                    { id: '/admin/content/templates', label: 'Templates', path: '/admin/content/templates', icon: 'dashboard_customize', description: 'Template management' },
                    { id: '/admin/content/categories', label: 'Categories', path: '/admin/content/categories', icon: 'category', description: 'Category management' },
                    { id: '/admin/content/tags', label: 'Tags', path: '/admin/content/tags', icon: 'local_offer', description: 'Tag management' },
                    { id: '/admin/content/settings', label: 'Section Settings', path: '/admin/content/settings', icon: 'settings', description: 'Configure content management preferences' }
                ]
            },
            {
                id: '/admin/ai',
                label: 'AI Services',
                path: '/admin/ai',
                icon: 'smart_toy',
                description: 'AI services management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { id: '/admin/ai/llm', label: 'LLM Integration', path: '/admin/ai/llm', icon: 'psychology' },
                    {
                        id: '/admin/ai/models',
                        label: 'Model Management',
                        path: '/admin/ai/models',
                        icon: 'model_training',
                        subItems: [
                            { id: '/admin/ai/models/training', label: 'Training', path: '/admin/ai/models/training', icon: 'school' },
                            { id: '/admin/ai/models/deployment', label: 'Deployment', path: '/admin/ai/models/deployment', icon: 'rocket_launch' },
                            { id: '/admin/ai/models/monitoring', label: 'Monitoring', path: '/admin/ai/models/monitoring', icon: 'monitoring' }
                        ]
                    },
                    { id: '/admin/ai/voice', label: 'Voice Services', path: '/admin/ai/voice', icon: 'record_voice_over', description: 'Manage Speechomatic integration' },
                    { id: '/admin/ai/agents', label: 'Agent Builder', path: '/admin/ai/agents', icon: 'engineering', description: 'Build and manage AI agents' },
                    { id: '/admin/ai/prompts', label: 'Prompts', path: '/admin/ai/prompts', icon: 'chat', description: 'Prompt management' },
                    { id: '/admin/ai/settings', label: 'Section Settings', path: '/admin/ai/settings', icon: 'settings', description: 'Configure AI service preferences' }
                ]
            },
            {
                id: '/admin/automation',
                label: 'Automation',
                path: '/admin/automation',
                icon: 'auto_fix_high',
                description: 'Automation management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { id: '/admin/automation/workflows', label: 'Workflows', path: '/admin/automation/workflows', icon: 'account_tree', description: 'Manage automation workflows' },
                    { id: '/admin/automation/rules', label: 'Rules', path: '/admin/automation/rules', icon: 'rule', description: 'Automation rules' },
                    { id: '/admin/automation/triggers', label: 'Triggers', path: '/admin/automation/triggers', icon: 'bolt', description: 'Automation triggers' },
                    { id: '/admin/automation/actions', label: 'Actions', path: '/admin/automation/actions', icon: 'play_circle', description: 'Automation actions' },
                    { id: '/admin/automation/schedules', label: 'Schedules', path: '/admin/automation/schedules', icon: 'schedule', description: 'Scheduled automations' },
                    { id: '/admin/automation/settings', label: 'Section Settings', path: '/admin/automation/settings', icon: 'settings', description: 'Configure automation preferences' }
                ]
            },
            {
                id: '/admin/integration',
                label: 'Integration',
                path: '/admin/integration',
                icon: 'integration_instructions',
                description: 'Integration management',
                requiresAuth: true,
                roles: ['admin'],
                subItems: [
                    { id: '/admin/integration/api-keys', label: 'API Keys', path: '/admin/integration/api-keys', icon: 'key', description: 'Manage API keys' },
                    { id: '/admin/integration/webhooks', label: 'Webhooks', path: '/admin/integration/webhooks', icon: 'webhook', description: 'Manage webhooks' },
                    { id: '/admin/integration/services', label: 'Services', path: '/admin/integration/services', icon: 'cloud', description: 'External services' },
                    { id: '/admin/integration/events', label: 'Events', path: '/admin/integration/events', icon: 'event_note', description: 'Event management' },
                    { id: '/admin/integration/logs', label: 'Logs', path: '/admin/integration/logs', icon: 'receipt_long', description: 'Integration logs' },
                    { id: '/admin/integration/settings', label: 'Section Settings', path: '/admin/integration/settings', icon: 'settings', description: 'Configure integration preferences' }
                ]
            },
            {
                id: '/admin/tools',
                label: 'Admin Tools',
                path: '/admin/tools',
                icon: 'build',
                description: 'Administrative tools',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'tools'
                }
            },
            {
                id: '/admin/config',
                label: 'System Config',
                path: '/admin/config',
                icon: 'settings_applications',
                description: 'System configuration',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'config'
                },
                subItems: [
                    { id: '/admin/config/general', label: 'General', path: '/admin/config/general', icon: 'settings' },
                    { id: '/admin/config/security', label: 'Security', path: '/admin/config/security', icon: 'security' },
                    { id: '/admin/config/performance', label: 'Performance', path: '/admin/config/performance', icon: 'speed' }
                ]
            },
            {
                id: '/admin/security',
                label: 'Security',
                path: '/admin/security',
                icon: 'security',
                description: 'Security management',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'security'
                }
            },
            {
                id: '/admin/backup',
                label: 'Backup',
                path: '/admin/backup',
                icon: 'backup',
                description: 'System backup',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'backup'
                }
            },
            {
                id: '/admin/ai/config',
                label: 'AI Config',
                path: '/admin/ai/config',
                icon: 'settings_applications',
                description: 'AI services configuration',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'ai',
                    tags: ['ai-config'],
                    version: '1.0.0'

                }
            },
            {
                id: '/admin/automation/config',
                label: 'Automation Config',
                path: '/admin/automation/config',
                icon: 'tune',
                description: 'Automation configuration',
                requiresAuth: true,
                roles: ['admin'],
                metadata: {
                    category: 'automation',  
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
        analytics: true,
        search: true,
        notifications: true,
        help: true
    },
    metadata: {
        version: '1.0.0',
        category: 'systemadmin',
        tags: ['system-administration'],
        permissions: [],
        analytics: {
            trackingId: '',
            features: []
        },
        cache: {
            ttl: 0,
            strategy: ''
        }
    }
};  