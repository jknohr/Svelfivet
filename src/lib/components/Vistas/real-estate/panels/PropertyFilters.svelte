<script lang="ts">
    import type { FilterSettings } from '../types';
    
    let filterSettings = $state<FilterSettings | null>(null);
    let isLoading = $state(false);

    // Load filter settings from SurrealDB
    async function loadFilterSettings() {
        isLoading = true;
        try {
            const query = `
                SELECT * 
                FROM filter_settings 
                WHERE user = $auth.id 
                AND vista = 'real-estate'
            `;
            filterSettings = await db.query(query);
        } catch (error) {
            console.error('Failed to load filters:', error);
        } finally {
            isLoading = false;
        }
    }

    // Load filters on mount
    $effect(() => {
        loadFilterSettings();
    });
</script>

<div class="left-panel">
    <h3>Property Filters</h3>
    {#if isLoading}
        <p>Loading filters...</p>
    {:else if filterSettings}
        {#each filterSettings.filters as filter}
            <div class="filter-item">
                <h4>{filter.label}</h4>
                <!-- Add filter controls based on type -->
            </div>
        {/each}
    {/if}
</div>

<style>
    .left-panel {
        padding: var(--spacing-sm);
    }

    .filter-item {
        margin-bottom: var(--spacing-sm);
    }
</style>
