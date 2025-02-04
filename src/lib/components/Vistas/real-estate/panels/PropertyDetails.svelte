<script lang="ts">
    import { page } from '$app/stores';
    import type { Property } from '../types';
    
    let selectedProperty = $state<Property | null>(null);
    let isLoading = $state(false);

    // Load property details from SurrealDB
    async function loadProperty(id: string) {
        isLoading = true;
        try {
            const query = `
                SELECT * 
                FROM property 
                WHERE id = $id
            `;
            const result = await db.query(query, { id });
            selectedProperty = result[0];
        } catch (error) {
            console.error('Failed to load property:', error);
        } finally {
            isLoading = false;
        }
    }

    // Load property when ID changes
    $effect(() => {
        const propertyId = page.params.id;
        if (propertyId) {
            loadProperty(propertyId);
        }
    });
</script>

<div class="right-panel">
    <h3>Property Details</h3>
    {#if isLoading}
        <p>Loading property details...</p>
    {:else if selectedProperty}
        <div class="property-details">
            <h4>{selectedProperty.title}</h4>
            <p>{selectedProperty.description}</p>
            <!-- Add more property details -->
        </div>
    {/if}
</div>

<style>
    .right-panel {
        padding: var(--spacing-sm);
    }

    .property-details {
        margin-top: var(--spacing-sm);
    }
</style>
