<script lang="ts">
  import { layoutConfig } from '$lib/components/Vistas/navigation';
  import type { Snippet } from 'svelte';

  let {
    content,
    filters,
    showFilters = false
  } = $props<{
    content: Snippet;
    filters?: Snippet;
    showFilters?: boolean;
  }>();
</script>

<div class="content-layout">
  {#if showFilters && filters}
    <div class="filters-area">
      {@render filters()}
    </div>
  {/if}
  
  <div class="main-area">
    {@render content()}
  </div>
</div>

<style>
  .content-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    height: 100%;
    width: 100%;
  }

  .filters-area {
    padding: var(--spacing-sm);
    background: var(--surface-variant);
    border-radius: var(--radius-md);
  }

  .main-area {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-md);
    background: var(--surface);
    border-radius: var(--radius-lg);
    min-height: 0;
  }
</style>
