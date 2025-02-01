<script lang="ts">
import type { Snippet } from 'svelte';

let {
  loading = false,
  error = null,
  children
} = $props<{
  loading?: boolean;
  error?: string | null;
  children: Snippet;
}>();
</script>

<div class="results">
  {#if loading}
    <div class="loading">
      <span class="loading-spinner"></span>
      Loading properties...
    </div>
  {:else if error}
    <div class="error">
      {error}
    </div>
  {:else}
    {@render children()}
  {/if}
</div>

<style>
  .results {
    width: 100%;
    height: 100%;
  }

  .loading,
  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-2);
  }

  .loading-spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border: 3px solid var(--surface-3);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    color: var(--error);
  }
</style> 