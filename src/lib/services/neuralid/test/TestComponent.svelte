# lib/services/neuralid/test/TestComponent.svelte
<script lang="ts">
    import { IDSnippetContainer } from '../IDSnippetContainer.svelte';
    import { IDSnippet, createSnippetConfig } from '../IDSnippets';
    import { IDElement } from '../IDElement';
    import { SEOMapper } from '../seo-mapper';

    // Create a main container element
    const mainElement = new IDElement('main-content', {
        metadata: { purpose: 'test-component' }
    });

    // Create snippet configurations
    const headerConfig = createSnippetConfig({
        type: 'header',
        seo: {
            title: 'Test Component Header',
            description: 'A header section for testing the Neural ID system',
            keywords: ['test', 'header', 'neural'],
            importance: 2,
            metadata: {
                position: 'top',
                role: 'banner'
            }
        }
    });

    const contentConfig = createSnippetConfig({
        type: 'article',
        seo: {
            title: 'Main Content Section',
            description: 'Primary content area demonstrating Neural ID features',
            keywords: ['content', 'demo', 'features'],
            importance: 1,
            metadata: {
                category: 'documentation',
                section: 'main'
            }
        }
    });

    const sidebarConfig = createSnippetConfig({
        type: 'sidebar',
        seo: {
            title: 'Related Content',
            description: 'Navigation and related content links',
            keywords: ['navigation', 'links', 'related'],
            importance: 3,
            metadata: {
                position: 'right',
                role: 'complementary'
            }
        }
    });

    // Track related content
    let relatedContent = $state([]);

    // Update related content when available
    $effect(async () => {
        const seoMapper = SEOMapper.getInstance();
        const mainContext = await seoMapper.getSEOContext(mainElement.elementId);
        if (mainContext) {
            const related = await seoMapper.getRelatedContent(mainElement.elementId);
            relatedContent = related;
        }
    });
</script>

<div class="test-component">
    <IDSnippetContainer type="main">
        <!-- Header Section -->
        <IDSnippet config={headerConfig}>
            <div class="header">
                <h1>Neural ID System Demo</h1>
                <p>Testing automatic relationship mapping and SEO features</p>
            </div>
        </IDSnippet>

        <!-- Main Content -->
        <div class="content-wrapper">
            <IDSnippet config={contentConfig}>
                <article class="main-content">
                    <h2>Feature Demonstration</h2>
                    <p>This component demonstrates:</p>
                    <ul>
                        <li><strong>Automatic Relationship Mapping</strong></li>
                        <li><strong>SEO Context Building</strong></li>
                        <li><strong>Content Navigation</strong></li>
                    </ul>
                </article>
            </IDSnippet>

            <!-- Sidebar -->
            <IDSnippet config={sidebarConfig}>
                <aside class="sidebar">
                    <h3>Related Content</h3>
                    {#if relatedContent.length > 0}
                        <ul>
                            {#each relatedContent as item}
                                <li>
                                    <strong>{item.context.title}</strong>
                                    <p>{item.context.description}</p>
                                    <small>Relevance: {(item.relevance * 100).toFixed(1)}%</small>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <p>No related content found</p>
                    {/if}
                </aside>
            </IDSnippet>
        </div>
    </IDSnippetContainer>
</div>

<style>
    .test-component {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .header {
        padding: 2rem;
        background: #f5f5f5;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    .content-wrapper {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;
    }

    .main-content {
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .sidebar {
        padding: 1.5rem;
        background: #f9f9f9;
        border-radius: 8px;
        border: 1px solid #eee;
    }

    h1 {
        margin: 0 0 1rem;
        color: #333;
    }

    h2, h3 {
        color: #444;
    }

    ul {
        padding-left: 1.5rem;
    }

    li {
        margin-bottom: 0.5rem;
    }

    .sidebar ul {
        list-style: none;
        padding: 0;
    }

    .sidebar li {
        padding: 1rem;
        background: white;
        border-radius: 4px;
        margin-bottom: 1rem;
        border: 1px solid #eee;
    }

    .sidebar small {
        color: #666;
        font-size: 0.875rem;
    }
</style>
