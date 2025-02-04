<!--
@component
Real Estate Vista Body Component

- Main component for the real estate vista layout
- Manages property filters and details panels
- Handles loading states and panel visibility

Usage:
```html
<RealEstateBody />
```
-->

<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';
    import PanelLoader from '$lib/utils/panels/PanelLoader.svelte';
    import { showPanel, hidePanel } from '$lib/utils/panels/store';
    import { realEstateConfig } from '../real-estate';

    <!-- Component state -->
    let pageTitle = $state('Real Estate Vista');
    let isLoading = $state(false);

    <!-- Derived state -->
    let displayTitle = $derived(`${pageTitle} ${isLoading ? '- Loading...' : ''}`);

    <!-- Load panels based on route -->
    $effect(() => {
        // Show filters by default
        showPanel({
            id: 'property-filters',
            component: 'components/Vistas/real-estate/panels/PropertyFilters.svelte',
            position: 'left',
            metadata: {
                title: 'Property Filters',
                icon: 'filter_list',
                width: '300px'
            }
        });

        // Show property details when a property is selected from the Vista state
        const selectedPropertyId = $state(null);
        if (selectedPropertyId) {
            showPanel({
                id: 'property-details',
                component: 'components/Vistas/real-estate/panels/PropertyDetails.svelte',
                position: 'right',
                props: { propertyId },
                metadata: {
                    title: 'Property Details',
                    icon: 'info',
                    width: '400px'
                }
            });
        } else {
            hidePanel('property-details');
        }
    });

    // Main content snippet
    const mainContent: Snippet = () => {
        return () => `
            <div class="real-estate-content">
                <h1>{displayTitle}</h1>
                <div class="content-area">
                    {#if isLoading}
                        <p>Loading...</p>
                    {:else}
                        <slot />
                    {/if}
                </div>
            </div>
        `;
    };

    // Panel loader snippets
    const leftPanel: Snippet = () => {
        return () => `<PanelLoader position="left" />`;
    };

    const rightPanel: Snippet = () => {
        return () => `<PanelLoader position="right" />`;
    };
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
    .real-estate-content {
        height: 100%;
    }

    .content-area {
        margin-top: var(--spacing-md);
    }

    :global(.left-panel), :global(.right-panel) {
        padding: var(--spacing-sm);
    }
</style>