<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';

    let pageTitle = $state('Automation')
    
    // Main content snippet
    const mainContent: Snippet = () => {
        return (
            <div class="automation-content">
                <h1>{pageTitle}</h1>
                <div class="content-area">
                    <section class="workflows-section">
                        <h2>Workflows</h2>
                        <!-- Workflow management -->
                    </section>
                    
                    <section class="rules-section">
                        <h2>Rules Engine</h2>
                        <!-- Rules configuration -->
                    </section>
                    
                    <section class="schedules-section">
                        <h2>Scheduled Tasks</h2>
                        <!-- Task scheduling -->
                    </section>
                </div>
            </div>
        )
    }

    // Automation navigation
    const leftPanel: Snippet = () => {
        return (
            <div class="left-panel">
                <h3>Automation Tools</h3>
                <nav>
                    <ul>
                        <li>Workflows</li>
                        <li>Rules</li>
                        <li>Triggers</li>
                        <li>Actions</li>
                        <li>Schedules</li>
                    </ul>
                </nav>
            </div>
        )
    }

    // Automation status
    const rightPanel: Snippet = () => {
        return (
            <div class="right-panel">
                <h3>Active Automations</h3>
                <div class="status-info">
                    <!-- Automation status -->
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
    .automation-content {
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
