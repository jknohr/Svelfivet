<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';

    let pageTitle = $state('AI Search Vista')
    let isLoading = $state(false)
    
    // Example of derived state
    let displayTitle = $derived(`${pageTitle} ${isLoading ? '- Loading...' : ''}`)

    // Main content snippet
    const mainContent: Snippet = () => {
        return (
            <div class="ai-search-content">
                <h1>{displayTitle}</h1>
                <div class="content-area">
                    <p>AI Search Content Area</p>
                </div>
            </div>
        )
    }

    // Optional side panel snippets
    const leftPanel: Snippet = () => {
        return (
            <div class="left-panel">
                <h3>Search Filters</h3>
                <!-- Add search filters here -->
            </div>
        )
    }

    const rightPanel: Snippet = () => {
        return (
            <div class="right-panel">
                <h3>Search History</h3>
                <!-- Add search history here -->
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
    .ai-search-content {
        height: 100%;
    }

    .content-area {
        margin-top: var(--spacing-md);
    }

    :global(.left-panel), :global(.right-panel) {
        padding: var(--spacing-sm);
    }
</style>
