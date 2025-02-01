<!-- src/templates/PropertyGrid.svelte -->
<script>
  import { propertiesStore } from '../../stores/properties';
  import PropertyCard from '../../organisms/PropertyCard.svelte';
  import { onMount } from 'svelte';

  let properties = [];
  let loading = true;
  let error = null;

  onMount(() => {
    propertiesStore.subscribe((state) => {
      properties = state.data;
      loading = state.loading;
      error = state.error;
    }).loadProperties();
  });
</script>

{#if loading}
  <p>Loading properties...</p>
{:else if error}
  <p>Error loading properties: {error}</p>
{:else}
  <div class="property-grid">
    {#each properties as property}
      <PropertyCard
        title={property.title}
        price={property.price}
        location={property.location}
        imageSrc={property.image}
        onClick={() => {
          // Handle click to navigate to PropertyPage
          console.log(`Clicked on ${property.title}`);
        }}
      />
    {/each}
  </div>
{/if}

<style>
  .property-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }
</style>