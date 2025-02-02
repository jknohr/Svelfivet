import { commonUserMenu } from './common';
import type { ContextConfig } from '$lib/components/Utility/content_context/;


export const aiSearchConfig: ContextConfig = {
    type: 'aisearch',
    label: 'AI Search',
    icon: 'manage_search',
    description: 'AI-powered search across all contexts',
    theme: {
        primary: '#6200EA',
        secondary: '#00BFA5',
        accent: '#FF4081',
        background: '@variables.context.location.images.background',
        primaryfont: 'Roboto',
        secondaryfont: 'Open Sans',
        tertiaryfont: 'Lato'
    },
    routes: {
        browse: {
            type: 'browse',
            label: 'Universal Search',
            path: '/aisearch/browse',
            icon: 'search',
            description: 'AI-powered universal search',
            api: {
                endpoints: {
                    search: '/api/aisearch/universal',
                    filters: '/api/aisearch/filters',
                    suggestions: '/api/aisearch/suggestions',
                    trending: '/api/aisearch/trending',
                    nearby: '/api/shared/nearby',
                    semantic: '/api/aisearch/semantic',
                    visual: '/api/aisearch/visual',
                    voice: '/api/aisearch/voice'
                },
                cache: {
                    ttl: 300,
                    strategy: 'stale-while-revalidate'
                },
                ai: {
                    contextAnalysis: '/api/ai/context-analysis',
                    intentRecognition: '/api/ai/intent-recognition',
                    entityExtraction: '/api/ai/entity-extraction',
                    multimodalSearch: '/api/ai/multimodal-search',
                    crossContextual: '/api/ai/cross-contextual'
                }
            },
            metadata: {
                order: 1,
                category: 'search',
                features: [
                    'universal-search',
                    'semantic-search',
                    'visual-search',
                    'voice-search',
                    'multimodal-search'
                ]
            }
        },
        explore: {
            type: 'explore',
            label: 'Contextual Search',
            path: '/aisearch/explore',
            icon: 'travel_explore',
            description: 'Context-aware search exploration',
            api: {
                endpoints: {
                    contexts: '/api/aisearch/contexts',
                    topics: '/api/aisearch/topics',
                    locations: '/api/aisearch/locations',
                    insights: '/api/aisearch/insights',
                    patterns: '/api/aisearch/patterns'
                },
                ai: {
                    contextualRanking: '/api/ai/contextual-ranking',
                    topicModeling: '/api/ai/topic-modeling',
                    locationAnalysis: '/api/ai/location-analysis',
                    patternRecognition: '/api/ai/pattern-recognition'
                }
            },
            metadata: {
                order: 2,
                category: 'exploration',
                features: [
                    'context-exploration',
                    'topic-discovery',
                    'location-based',
                    'pattern-analysis'
                ]
            }
        },
        services: {
            type: 'services',
            label: 'Search Services',
            path: '/aisearch/services',
            icon: 'miscellaneous_services',
            description: 'Advanced search services',
            api: {
                endpoints: {
                    customize: '/api/aisearch/customize',
                    preferences: '/api/aisearch/preferences',
                    alerts: '/api/aisearch/alerts',
                    insights: '/api/aisearch/insights'
                },
                ai: {
                    personalization: '/api/ai/search-personalization',
                    alertGeneration: '/api/ai/alert-generation',
                    insightDiscovery: '/api/ai/insight-discovery'
                }
            },
            metadata: {
                order: 3,
                category: 'services',
                features: [
                    'custom-search',
                    'search-alerts',
                    'insights-generation',
                    'search-analytics'
                ]
            }
        }
    },
    navigation: {
        main: [
            {
                type: 'group',
                label: 'Search Contexts',
                path: '/aisearch/contexts',
                icon: 'category',
                description: 'Browse by context',
                items: [
                    { type: 'link', label: 'Global Search', path: '/aisearch/global', icon: 'public', description: 'Search across all contexts' },
                    { type: 'link', label: 'Local Search', path: '/aisearch/local', icon: 'location_on', description: 'Location-based search' },
                    { type: 'link', label: 'News Search', path: '/aisearch/news', icon: 'newspaper', description: 'News and events search' },
                    { type: 'link', label: 'Business Search', path: '/aisearch/business', icon: 'business', description: 'Business and services search' }
                ]
            }
        ],
        user: [
            ...commonUserMenu,
            {
                type: 'link',
                label: 'Search History',
                path: '/aisearch/user/history',
                icon: 'history',
                description: 'View search history',
                requiresAuth: true
            },
            {
                type: 'link',
                label: 'Search Preferences',
                path: '/aisearch/user/preferences',
                icon: 'tune',
                description: 'Customize search settings',
                requiresAuth: true
            }
        ],
        admin: [
            {
                type: 'link',
                label: 'Search Analytics',
                path: '/aisearch/admin/analytics',
                icon: 'analytics',
                description: 'Search usage analytics',
                requiresAuth: true,
                roles: ['admin', 'analyst']
            },
            {
                type: 'link',
                label: 'AI Configuration',
                path: '/aisearch/admin/ai',
                icon: 'settings_applications',
                description: 'Configure AI search settings',
                requiresAuth: true,
                roles: ['admin', 'ai-engineer']
            }
        ]
    },
    features: {
        map: {
            type: 'map',
            enabled: true,
            config: {
                provider: 'mapbox',
                apiKey: process.env.MAPBOX_API_KEY,
                defaultView: {
                    zoom: 12,
                    center: [-73.935242, 40.730610]
                }
            },
            capabilities: [
                'search-results',
                'local-context',
                'global-context',
                'topic-clusters'
            ]
        },
        chat: {
            type: 'chat',
            enabled: true,
            config: {},
            capabilities: [
                'natural-language-search',
                'search-assistance',
                'result-explanation'
            ]
        },
        voice: {
            type: 'voice',
            enabled: true,
            config: {},
            capabilities: [
                'voice-commands',
                'voice-search',
                'voice-results'
            ]
        },
        ai: {
            type: 'ai',
            enabled: true,
            config: {
                models: [
                    'semantic-search',
                    'contextual-analysis',
                    'multimodal-processing',
                    'natural-language-understanding'
                ]
            },
            capabilities: [
                'intent-recognition',
                'entity-extraction',
                'sentiment-analysis',
                'topic-modeling',
                'cross-contextual-search'
            ]
        }
    },
    metadata: {
        version: '1.0.0',
        category: 'search',
        tags: ['ai', 'search', 'global', 'local', 'contextual', 'multimodal'],
        permissions: ['basic', 'search-management'],
        analytics: {
            trackingId: 'UA-AISEARCH-1',
            features: [
                'search-queries',
                'result-clicks',
                'context-switches',
                'ai-interactions'
            ]
        },
        cache: {
            ttl: 300,
            strategy: 'stale-while-revalidate'
        }
    }
};
