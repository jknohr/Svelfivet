// lib/services/neuralid/IDSnippets.ts
export { 
    type SEOConfig,
    type SnippetConfig,
    SnippetTypes,
    createSnippetConfig 
} from './types'; {
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

export function IDSnippet({
    config,
    className = '',
    children
}: {
    config: SnippetConfig;
    className?: string;
    children?: () => any;
}) {
    const idContext = useIDContext();
    
    let elementId = $derived(generateElementID({
        ...idContext,
        elementType: config.type
    }));
    
    let isValid = $derived(!config.allowedTypes || config.allowedTypes.includes(config.type));

    // Define styles as constants to avoid type comparison issues
    const snippetStyle = 'position: relative; min-height: 1rem;';
    const errorStyle = 'color: #ff6b6b; padding: 0.5rem; border: 1px solid #ff6b6b; background: #fff3f3;';

    if (!isValid) {
        return `<div style="${errorStyle}">
            Invalid snippet type: ${config.type}
        </div>`;
    }

    // Setup automatic mapping
    $effect(() => {
        const mapper = IDMapper.getInstance();
        mapper.forceUpdateElement(elementId);
    });

    // Build SEO attributes
    const seoAttrs = config.seo ? {
        'data-seo': JSON.stringify(config.seo.metadata || {}),
        'data-seo-type': config.seo.type || config.type,
        'data-seo-importance': config.seo.importance?.toString() || '1',
        'data-seo-title': config.seo.title,
        'data-seo-description': config.seo.description,
        'data-seo-keywords': config.seo.keywords?.join(','),
    } : {};

    return `<div
        id="${elementId}"
        class="neural-id-snippet ${className}"
        data-snippet-type="${config.type}"
        style="${snippetStyle}"
        ${Object.entries(seoAttrs)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')}
    >
        ${children ? children() : config.defaultContent}
    </div>`;
}

// Helper function to create snippet configurations
export function createSnippetConfig(config: Partial<SnippetConfig>): SnippetConfig {
    return {
        type: config.type || 'default',
        allowedTypes: config.allowedTypes,
        defaultContent: config.defaultContent,
        metadata: config.metadata || {}
    };
}

// Predefined snippet types
export const SnippetTypes = {
    CONTAINER: 'container',
    SECTION: 'section',
    CONTENT: 'content',
    WIDGET: 'widget',
    CUSTOM: 'custom'
} as const;

// Usage example:
/*
    const config = createSnippetConfig({
        type: SnippetTypes.CONTAINER,
        allowedTypes: [SnippetTypes.CONTENT, SnippetTypes.WIDGET],
        metadata: {
            description: 'Main content area'
        }
    });

    <IDSnippet config={config} className="my-snippet">
        {render()}
    </IDSnippet>
*/
