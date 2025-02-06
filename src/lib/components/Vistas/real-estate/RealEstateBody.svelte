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
    import PanelLoader from '$lib/utils/panels/PanelLoader.svelte';
    import { showPanel, hidePanel } from '$lib/utils/panels/store';
    import { realEstateConfig } from '../real-estate';
    import IDSnippetContainer from '$lib/services/neuralid/IDSnippetContainer.svelte';
    import { SnippetTypes } from '$lib/services/neuralid/IDSnippets';
    import type { IDNode } from '$lib/services/neuralid/id-relations';

    // Component state
    let pageTitle = $state('Real Estate Vista');
    let isLoading = $state(false);
    let selectedPropertyId = $state<string | null>(null);

    // Derived state
    let displayTitle = $derived(`${pageTitle} ${isLoading ? '- Loading...' : ''}`);

    // Load panels based on route
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

        // Show property details when a property is selected
        if (selectedPropertyId) {
            showPanel({
                id: 'property-details',
                component: 'components/Vistas/real-estate/panels/PropertyDetails.svelte',
                position: 'right',
                props: { propertyId: selectedPropertyId },
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

    // Track content children
    let contentChildren = $state<IDNode[]>([]);
    
    function handleContentChange(children: IDNode[]) {
        contentChildren = children;
    }
</script>

<BaseContentLayout
    spatialConfig={BASE}
    dimensions={{
        leftSidebarWidth: '250px',
        rightSidebarWidth: '250px',
        mainContentWidth: 'auto'
    }}
>
    <div>
        <h1>{displayTitle}</h1>
        <IDSnippetContainer
            type={SnippetTypes.CONTAINER}
            metadata={{
                vistaType: 'real-estate',
                isLoading
            }}
            onChildrenChange={handleContentChange}
        />
    </div>
    
    <PanelLoader position="left" />
    <PanelLoader position="right" />
</BaseContentLayout>

<style>
    div {
        height: 100%;
    }

    div {
        margin-top: var(--spacing-md);
    }

    :global(.left-panel), :global(.right-panel) {
        padding: var(--spacing-sm);
    }
</style>
