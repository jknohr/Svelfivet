<!-- src/templates/PropertyPage.svelte -->
<script lang="ts">
  import { propertiesStore } from '$lib/stores/properties';
  import { onMount } from 'svelte';
  import PropertyMap from '$lib/components/context/real-estate/cards/PropertyMap.svelte';
  import type { Property } from '$lib/stores/properties';

  export let id: number;

  let property: Property | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(() => {
    propertiesStore.subscribe((state) => {
      if (state.data.length > 0) {
        property = state.data.find((p) => p.id === id);
        loading = false;
      }
    }).loadProperties();
  });
</script>

{#if loading}
  <p>Loading property...</p>
{:else if error}
  <p>Error loading property: {error}</p>
{:else if property}
  <div class="property-details">
    <h1>{property.title}</h1>
    <p>{property.location}</p>
    <p>{property.price}</p>
    <img src={property.image} alt={`${property.title} image`} class="property-image" />
    <p>{property.description}</p>
    <Map location={property.location} />
  </div>
{/if}

<style>
  .property-details {
    padding: 1rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(10px);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    max-width: 800px;
    margin: 5rem auto;
  }

  .property-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: var(--radius);
  }
</style>
