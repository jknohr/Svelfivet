<script lang="ts">
import { SearchFilters } from '$lib/components/common/organisms/SearchBar/search/filters';
import type { ContextType } from '$lib/components/common/utils/content_context/content_context';
import { createEventDispatcher } from 'svelte';

let { 
  context = 'real-estate' as ContextType
} = $props<{
  context?: ContextType;
}>();

const dispatch = createEventDispatcher();

function handleFilterChange(event: CustomEvent) {
  // Forward the filter event
  dispatch('filter', event.detail);
}

function handleReset() {
  // Forward the reset event
  dispatch('reset');
}
</script>

<SearchFilters 
  {context}
  on:filter={handleFilterChange}
  on:reset={handleReset}
/>

<style>
  /* Component-specific styles */
</style> 
