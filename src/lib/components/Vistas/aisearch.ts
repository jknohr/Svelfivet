import { adminConfig } from './systemadmin';
import { userConfig } from './user';

import type { NavigationItem } from '$lib/types/navigation';
import type { VistaConfig, VistaType } from '$lib/types/vista';
import type { FeatureConfig } from '$lib/types/feature';
import type { ThemeConfig } from '$lib/components/Theme/Theme.types';
import Typography from '$lib/components/Theme/Typography.svelte';

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
            background: '#FFFFFF',
            surface: '#FFFFFF',
            text: '#000000',
            textLight: '#FFFFFF',
            textDark: '#000000',
            border: '#E0E0E0',
            shadow: 'rgba(0, 0, 0, 0.1)',
            glass: {
                tint: 'rgba(98, 0, 234, 0.1)',
                blur: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.7)',
                backdrop: 'blur(16px)'
            },
            states: {
                hover: 'rgba(98, 0, 234, 0.1)',
                active: 'rgba(98, 0, 234, 0.2)',
                focus: 'rgba(98, 0, 234, 0.3)',
                selected: 'rgba(98, 0, 234, 0.4)'
            }
        },
        components: {
            button: {
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px'
            },
            input: {
                borderRadius: '8px',
                padding: '12px',
                fontSize: '16px'
            },
            card: {
                borderRadius: '12px',
                padding: '16px',
                shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            },
            node: {
                background: '#FFFFFF',
                borderColor: '#B0BEC5',
                borderWidth: '1px',
                textColor: '#000000'
            },
            edge: {
                color: '#B0BEC5',
                width: '2px',
                hoverColor: '#6200EA',
                selectedColor: '#4527A0'
            },
            anchor: {
                size: '8px',
                color: '#B0BEC5',
                hoverColor: '#6200EA',
                activeColor: '#4527A0'
            },
            tooltip: {
                background: '#263238',
                textColor: '#FFFFFF',
                borderRadius: '4px',
                padding: '8px'
            },
            glass: {
                blur: '10px',
                opacity: 0.7,
                borderOpacity: 0.3,
                lightEffect: true,
                lightIntensity: 0.2
            }
        },
        typography: {
            fontFamily: {
                base: 'Inter, system-ui, sans-serif',
                heading: 'Inter, system-ui, sans-serif',
                mono: 'JetBrains Mono, monospace'
            },
            fontSize: {
                xs: '12px',
                sm: '14px',
                base: '16px',
                lg: '18px',
                xl: '24px',
                xxl: '32px'
            },
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700'
            }
        },
        transitions: {
            duration: {
                fast: '150ms',
                normal: '250ms',
                slow: '350ms'
            },
            timing: {
                default: 'cubic-bezier(0.4, 0, 0.2, 1)',
                linear: 'linear',
                ease: 'ease',
                easeIn: 'ease-in',
                easeOut: 'ease-out'
            }
        },
        spatial: {
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px'
            },
            layout: {
                maxWidth: '1200px',
                gutter: '24px'
            }
        },
        effects: {
            glass: {
                blur: '16px',
                opacity: 0.7,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.7)',
                shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            },
            lighting: {
                ambient: 'rgba(255, 255, 255, 0.1)',
                key: 'rgba(255, 255, 255, 0.2)',
                fill: 'rgba(255, 255, 255, 0.05)',
                intensity: 0.5,
                angle: 45
            }
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
            meta: {
                title: 'Search',
                description: 'AI-powered search',
                requiresAuth: true
            }
        },
        history: {
            path: '/aisearch/history',
            meta: {
                title: 'History',
                description: 'Search history',
                requiresAuth: true,
                roles: ['user']
            }
        },
        saved: {
            path: '/aisearch/saved',
            meta: {
                title: 'Saved',
                description: 'Saved searches',
                requiresAuth: true,
                roles: ['user']
            }
        },
        insights: {
            path: '/aisearch/insights',
            meta: {
                title: 'Insights',
                description: 'Search insights and analytics',
                requiresAuth: true,
                roles: ['admin']
            }
        },
        management: {
            path: '/admin/aisearch/management',
            meta: {
                title: 'Search Management',
                description: 'Manage search settings and indices',
                requiresAuth: true,
                roles: ['admin']
            }
        }
    },
    navigation: {
        items: [
            {
                id: 'search',
                label: 'Search',
                icon: 'search',
                path: '/aisearch/search',
                description: 'AI-powered search',
                requiresAuth: true
            },
            {
                id: 'history',
                label: 'History',
                icon: 'history',
                path: '/aisearch/history',
                description: 'Search history',
                requiresAuth: true,
                roles: ['user']
            },
            {
                id: 'saved',
                label: 'Saved',
                icon: 'bookmark',
                path: '/aisearch/saved',
                description: 'Saved searches',
                requiresAuth: true,
                roles: ['user']
            },
            {
                id: 'insights',
                label: 'Insights',
                icon: 'insights',
                path: '/aisearch/insights',
                description: 'Search insights and analytics',
                requiresAuth: true,
                roles: ['admin']
            },
            {
                id: 'management',
                label: 'Search Management',
                icon: 'settings_applications',
                path: '/admin/aisearch/management',
                description: 'Manage search settings and indices',
                requiresAuth: true,
                roles: ['admin']
            }
        ]
    },
    features: {
        ai: {
            id: 'ai',
            name: 'AI Search Engine',
            enabled: true,
            provider: 'openai',
            capabilities: ['semantic-search', 'natural-language-processing', 'context-awareness'],
            config: {
                provider: 'openai'
            }
        },
        analytics: {
            id: 'analytics',
            name: 'Search Analytics',
            enabled: true,
            provider: 'elastic',
            capabilities: ['usage-tracking', 'performance-metrics', 'trend-analysis'],
            config: {
                provider: 'elastic'
            }
        },
        recommendations: {
            enabled: true,
            capabilities: ['personalized-results', 'related-searches', 'trending-topics'],
            config: {
                provider: 'recommender'
            }
        }
    },
    metadata: {
        version: '2.0.0',
        category: 'search',
        tags: ['ai', 'search', 'analytics'],
        permissions: ['basic', 'search-management']
    }
};

export default aiSearchConfig;
