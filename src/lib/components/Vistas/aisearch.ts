import type { VistaConfig } from '$lib/types/vista';

export const aiSearchConfig: VistaConfig = {
    type: 'aisearch',
    label: 'AI Search',
    icon: 'manage_search',
    description: 'AI-powered search across all contexts',
    theme: {
        colors: {
            primary: '#6200EA',
            secondary: '#00BFA5',
            accent: '#651FFF',
            background: '#FFFFFF'
        }
    },
    social: [
        {
            platform: 'twitter',
            icon: 'flutter_dash',
            label: 'Twitter',
            url: 'https://twitter.com/aisearch',
            handle: '@aisearch'
        },
        {
            platform: 'github',
            icon: 'code',
            label: 'GitHub',
            url: 'https://github.com/aisearch',
            handle: 'aisearch'
        },
        {
            platform: 'discord',
            icon: 'forum',
            label: 'Discord',
            url: 'https://discord.gg/aisearch',
            handle: 'aisearch'
        }
    ],
    routes: {
        search: {
            path: '/aisearch/search',
            component: 'pages/SearchPage.svelte',
            meta: {
                title: 'Search',
                description: 'AI-powered search interface',
                requiresAuth: true,
                roles: ['user']
            }
        },
        history: {
            path: '/aisearch/history',
            component: 'pages/HistoryPage.svelte',
            meta: {
                title: 'Search History',
                description: 'View past searches and results',
                requiresAuth: true,
                roles: ['user']
            }
        },
        insights: {
            path: '/aisearch/insights',
            component: 'pages/InsightsPage.svelte',
            meta: {
                title: 'Search Insights',
                description: 'Analytics and insights from searches',
                requiresAuth: true,
                roles: ['admin']
            }
        },
        settings: {
            path: '/aisearch/settings',
            component: 'pages/SettingsPage.svelte',
            meta: {
                title: 'Search Settings',
                description: 'Configure search preferences',
                requiresAuth: true,
                roles: ['user']
            }
        },
        help: {
            path: '/aisearch/help',
            component: 'pages/HelpPage.svelte',
            meta: {
                title: 'Search Help',
                description: 'Search usage guide and tips',
                requiresAuth: true,
                roles: ['user']
            }
        }
    },
    navigation: {
        items: [
            {
                id: 'aisearch-main',
                label: 'AI Search',
                path: '/aisearch/search',
                icon: 'manage_search',
                description: 'AI-powered search interface',
                requiresAuth: true,
                roles: ['user'],
                subItems: [
                    { id: 'search', label: 'Search', path: '/aisearch/search', icon: 'search', description: 'AI-powered search' },
                    { id: 'history', label: 'History', path: '/aisearch/history', icon: 'history', description: 'View search history' },
                    { id: 'insights', label: 'Insights', path: '/aisearch/insights', icon: 'analytics', description: 'Search analytics', roles: ['admin'] },
                    { id: 'settings', label: 'Settings', path: '/aisearch/settings', icon: 'settings', description: 'Search preferences' },
                    { id: 'help', label: 'Help', path: '/aisearch/help', icon: 'help', description: 'Search help and tips' }
                ]
            }
        ]
    },
    features: {
        search: {
            enabled: true,
            id: 'search',
            name: 'AI Search',
            capabilities: ['semantic-search', 'natural-language-queries', 'context-aware-results'],
            config: {
                provider: 'openai',
                model: 'gpt-4'
            }
        },
        history: {
            enabled: true,
            id: 'history',
            name: 'Search History',
            capabilities: ['view', 'export', 'delete'],
            config: {
                retention: 30 // days
            }
        },
        insights: {
            enabled: true,
            id: 'insights',
            name: 'Search Analytics',
            capabilities: ['usage-tracking', 'performance-metrics', 'user-behavior'],
            config: {
                provider: 'mixpanel'
            }
        },
        settings: { enabled: true },
        help: { enabled: true },
        export: { enabled: true },
        filters: { enabled: true },
        suggestions: { enabled: true }
    },
    metadata: {
        version: '1.0.0',
        category: 'search',
        tags: ['ai', 'search', 'nlp', 'analytics'],
        permissions: ['search:use', 'history:view', 'insights:view'],
        analytics: {
            trackingId: 'analytics',
            features: ['usage-tracking', 'performance-metrics', 'trend-analysis']
        },
        cache: {
            ttl: 3600,
            strategy: 'stale-while-revalidate'
        },
        recommendations: {
            enabled: true,
            capabilities: ['personalized-results', 'related-searches', 'trending-topics'],
            config: {
                provider: 'recommender'
            }
        },
    },
}
export default aiSearchConfig;
