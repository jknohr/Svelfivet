<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';

    let pageTitle = $state('User Vista')
    let isLoading = $state(false)
    
    // Example of derived state
    let displayTitle = $derived(`${pageTitle} ${isLoading ? '- Loading...' : ''}`)

    // Main content snippet
    const mainContent: Snippet = () => {
        return (
            <div class="user-content">
                <h1>{displayTitle}</h1>
                <div class="content-area">
                    <p>User Profile Content Area</p>
                </div>
            </div>
        )
    }

    // Optional side panel snippets
    const leftPanel: Snippet = () => {
        return (
            <div class="left-panel">
                <h3>User Navigation</h3>
                <!-- Add user navigation here -->
            </div>
        )
    }

    const rightPanel: Snippet = () => {
        return (
            <div class="right-panel">
                <h3>User Settings</h3>
                <!-- Add user settings here -->
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
    .user-content {
        height: 100%;
    }

    .content-area {
        margin-top: var(--spacing-md);
    }

    :global(.left-panel), :global(.right-panel) {
        padding: var(--spacing-sm);
    }
</style>
