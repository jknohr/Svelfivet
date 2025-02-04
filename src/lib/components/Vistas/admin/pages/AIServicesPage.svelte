<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';

    let pageTitle = $state('AI Services')
    
    // Main content snippet
    const mainContent: Snippet = () => {
        return (
            <div class="ai-services-content">
                <h1>{pageTitle}</h1>
                <div class="content-area">
                    <section class="llm-section">
                        <h2>LLM Integration</h2>
                        <!-- LLM settings and status -->
                    </section>
                    
                    <section class="models-section">
                        <h2>Model Management</h2>
                        <!-- Model management interface -->
                    </section>
                    
                    <section class="agents-section">
                        <h2>Agent Builder</h2>
                        <!-- Agent configuration -->
                    </section>
                </div>
            </div>
        )
    }

    // AI services navigation
    const leftPanel: Snippet = () => {
        return (
            <div class="left-panel">
                <h3>Services</h3>
                <nav>
                    <ul>
                        <li>LLM Integration</li>
                        <li>Model Management</li>
                        <li>Voice Services</li>
                        <li>Agent Builder</li>
                        <li>Prompts</li>
                    </ul>
                </nav>
            </div>
        )
    }

    // Service status
    const rightPanel: Snippet = () => {
        return (
            <div class="right-panel">
                <h3>Service Status</h3>
                <div class="status-info">
                    <!-- AI service status -->
                </div>
            </div>
        )
    }
</script>

<BaseContentLayout
    spatialConfig={BASE}
    {mainContent}
    leftComponent={leftPanel}
    rightComponent={rightPanel}
    dimensions={{
        leftSidebarWidth: '250px',
        rightSidebarWidth: '250px',
        mainContentWidth: 'auto'
    }}
/>

<style>
    .ai-services-content {
        height: 100%;
    }

    .content-area {
        margin-top: var(--spacing-md);
    }

    section {
        margin-bottom: var(--spacing-lg);
        padding: var(--spacing-md);
        background: var(--surface-background);
        border-radius: var(--radius-md);
    }

    :global(.left-panel), :global(.right-panel) {
        padding: var(--spacing-sm);
    }

    :global(.left-panel) nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    :global(.left-panel) nav ul li {
        padding: var(--spacing-sm);
        cursor: pointer;
    }

    :global(.left-panel) nav ul li:hover {
        background: var(--surface-hover);
        border-radius: var(--radius-sm);
    }
</style>
