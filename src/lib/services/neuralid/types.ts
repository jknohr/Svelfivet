// types.ts
export interface SEOConfig {
    title?: string;
    description?: string;
    keywords?: string[];
    type?: string;
    importance?: number;
    metadata?: Record<string, any>;
}

export interface SnippetConfig {
    type: string;
    allowedTypes?: string[];
    defaultContent?: string;
    metadata?: Record<string, any>;
    seo?: SEOConfig;
}

// Predefined snippet types
export const SnippetTypes = {
    CONTAINER: 'container',
    SECTION: 'section',
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    LINK: 'link',
    BUTTON: 'button',
    FORM: 'form',
    INPUT: 'input',
    LIST: 'list',
    TABLE: 'table',
    CUSTOM: 'custom'
} as const;

// Helper function to create snippet configurations
export function createSnippetConfig(config: Partial<SnippetConfig>): SnippetConfig {
    return {
        type: config.type || SnippetTypes.CUSTOM,
        allowedTypes: config.allowedTypes,
        defaultContent: config.defaultContent,
        metadata: config.metadata,
        seo: config.seo
    };
}
