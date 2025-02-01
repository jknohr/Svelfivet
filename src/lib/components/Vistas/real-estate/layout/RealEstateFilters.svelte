<!-- src/components/organisms/Sidebar.svelte -->
<script>
  import InputField from '../atoms/InputField.svelte';
  import Checkbox from '../atoms/Checkbox.svelte';
  import Button from '../atoms/Button.svelte';
  import { propertiesStore } from '../../stores/properties';
  import { onMount } from 'svelte';

  let filters = {
    location: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
  };

  function applyFilters() {
    // Implement filtering logic
    console.log('Filters applied:', filters);
    // For example, update the store with filtered data
  }
</script>

<aside class="sidebar">
  <h2>Filters</h2>
  <div class="filter-group">
    <InputField
      label="Location"
      bind:value={filters.location}
      placeholder="Enter location"
    />
  </div>
  <div class="filter-group">
    <InputField
      label="Price Min"
      bind:value={filters.priceMin}
      placeholder="Min"
    />
    <InputField
      label="Price Max"
      bind:value={filters.priceMax}
      placeholder="Max"
    />
  </div>
  <div class="filter-group">
    <InputField
      label="Bedrooms"
      bind:value={filters.bedrooms}
      placeholder="Number of bedrooms"
    />
  </div>
  <div class="filter-group">
    <InputField
      label="Bathrooms"
      bind:value={filters.bathrooms}
      placeholder="Number of bathrooms"
    />
  </div>
  <div class="filter-actions">
    <Button label="Apply Filters" variant="primary" onClick={applyFilters} />
  </div>
</aside>

<style>
  .sidebar {
    width: 20%;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    backdrop-filter: blur(4px);
    border-right: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: var(--shadow);
    position: fixed;
    top: 5rem;
    left: 0;
    bottom: 0;
    overflow-y: auto;
  }

  .filter-group {
    margin-bottom: 1rem;
  }

  .filter-actions {
    margin-top: 1rem;
  }
</style>