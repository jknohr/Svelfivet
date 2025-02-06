<script lang="ts">
    
    export const ssr = false;
    export const NeuralID = 'NeuralID';
    import IDSnippet from './IDSnippet.svelte';
    import { createSnippetConfig, SnippetTypes } from './types';
    import { IDElement } from './IDElement';
    import type { IDNode } from './id-relations';

    let props = $props<{
        type?: (typeof SnippetTypes)[keyof typeof SnippetTypes];
        allowedTypes?: string[];
        metadata?: Record<string, any>;
        class?: string;
        onChildrenChange?: (children: IDNode[]) => void;
    }>();

    let { 
        type = SnippetTypes.CONTAINER,
        allowedTypes,
        metadata = {},
        class: className = '',
        onChildrenChange
    } = props;

    // Initialize element with state management
    const element = new IDElement(type, metadata);
    let children = $state<IDNode[]>([]);
    let isHovered = $state(false);

    // Live subscription to children updates
    $effect(() => {
        const unsubscribe = element.onChildrenChange((data) => {
            children = data;
            if (onChildrenChange) onChildrenChange(data);
        });
        
        return () => unsubscribe();
    });

    // Create snippet configuration
    let snippetConfig = $derived(createSnippetConfig({
        type,
        allowedTypes,
        metadata: {
            ...metadata,
            elementId: element.elementId,
            isHovered
        }
    }));

    // Event handlers
    function handleMouseEnter() {
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
    }

    // Child snippet rendering
    function renderChild(child: IDNode) {
        const childConfig = createSnippetConfig({
            type: child.type,
            metadata: {
                ...child.metadata,
                parentId: element.elementId
            }
        });

        return {
            config: childConfig,
            child
        };
    }

</script>

<div 
    class="neural-snippet-wrapper {className}"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    role="group"
    aria-label="Interactive snippet container"
>
    <IDSnippet config={snippetConfig} />
    <div class="neural-snippet-container">
        <!-- Render children snippets -->
        {#if children.length > 0}
            <div class="neural-snippet-children">
                {#each children as child (child.id)}
                    <div 
                        class="neural-snippet-child"
                        data-child-id={child.id}
                        data-child-type={child.type}
                    >
                        <IDSnippet config={renderChild(child).config} />
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .neural-snippet-wrapper {
        position: relative;
    }

    .neural-snippet-wrapper:hover::before {
        content: '';
        position: absolute;
        inset: 0;
        border: 2px dashed #4299e1;
        pointer-events: none;
        opacity: 0.5;
        border-radius: 4px;
    }

    .neural-snippet-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 2rem;
    }

    .neural-snippet-children {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .neural-snippet-child {
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        background: white;
        transition: all 0.2s ease;
    }

    .neural-snippet-child:hover {
        border-color: #4299e1;
        box-shadow: 0 2px 4px rgba(66, 153, 225, 0.1);
    }
</style>
