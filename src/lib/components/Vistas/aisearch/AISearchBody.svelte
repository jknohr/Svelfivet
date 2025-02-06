svelte:options runes={true} />

<script lang="ts">
  import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
  import { BASE } from '$lib/components/Theme/SpatialDesign';

  // 1. Reactive state using runes:
  let pageTitle = $state('AI Search Vista');
  let isLoading = $state(false);
  let searchQuery = $state('');
  let error = $state('');
  let searchResults = $state([]);

  // 2. Derived state:
  let displayTitle = $derived(() =>
    `${pageTitle}${isLoading ? ' - Loading...' : ''}`
  );

  // 3. For the filters we declare separate reactive state:
  let filter1 = $state(false);
  let filter2 = $state(false);

  // 4. Utility function to dispatch events:
  function dispatchEvent(eventName: string, detail: any) {
    const event = new CustomEvent(eventName, { detail, bubbles: true });
    window.dispatchEvent(event);
  }

  // 5. Handle a search action:
  function handleSearch() {
    if (searchQuery.trim() === '') return;
    isLoading = true;
    // Simulated API call:
    setTimeout(() => {
      isLoading = false;
      dispatchEvent('searchResults', { query: searchQuery, results: [] });
    }, 2000);
  }

  // 6. Simple event handlers:
  function handleFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log("Filter toggled:", target.checked);
  }

  function handleHistoryItemClick(item: string) {
    searchQuery = item;
    handleSearch();
  }

  // 7. History state for the right panel:
  let history = $state([
    'Search Query 1',
    'Search Query 2',
    'Search Query 3'
  ]);
</script>

{#snippet mainContent()}
@render
  <div class="ai-search-content">
    <h1>{displayTitle}</h1>
    <div class="search-bar">
      <input 
        type="text" 
        bind:value={searchQuery}
        placeholder="Search..."
        onkeydown={(e) => { if (e.key === 'Enter') handleSearch(); }}
      />
      <button onclick={handleSearch}>Search</button>
    </div>
    <div class="content-area">
      {#if isLoading}
        <p>Loading...</p>
      {:else if searchQuery.trim() === ''}
        <p>Please enter a search query.</p>
      {:else}
        <p>AI Search Content Area</p>
        <!-- Display search results here -->
      {/if}
    </div>
  </div>
{/snippet}

{#snippet leftPanel()}
@render
  <div class="left-panel">
    <h3>Search Filters</h3>
    <form onsubmit={(e) => { e.preventDefault(); }}>
      <div class="filter-group">
        <label>
          <input 
            type="checkbox"
            bind:checked={filter1}
            onchange={handleFilterChange}
          />
          Filter 1
        </label>
      </div>
      <div class="filter-group">
        <label>
          <input 
            type="checkbox"
            bind:checked={filter2}
            onchange={handleFilterChange}
          />
          Filter 2
        </label>
      </div>
      <!-- Add additional filters if necessary -->
    </form>
  </div>
{/snippet}

{#snippet rightPanel()}
@render
  <div class="right-panel">
    <h3>Search History</h3>
    <ul>
      {#each history as item}
        <li><button type="button" onclick={() => handleHistoryItemClick(item)}>{item}</button></li>
      {/each}
    </ul>
  </div>
{/snippet}

<!-- Pass the snippet blocks to BaseContentLayout -->
<BaseContentLayout
  spatialConfig={BASE}
  mainContent={mainContent}
  leftComponent={leftPanel}
  rightComponent={rightPanel}
  dimensions={{
    leftSidebarWidth: '250px',
    rightSidebarWidth: '250px',
    mainContentWidth: 'auto'
  }}
  children={() => ''}
/>

<style>
  .ai-search-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .search-bar {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  input {
    flex: 1;
    padding: var(--spacing-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
  }
  button {
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    border-radius: var(--radius-sm);
    background-color: var(--primary);
    color: var(--surface);
    cursor: pointer;
  }
  button:hover {
    background-color: var(--states-focus);
  }
  .content-area {
    flex: 1;
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--surface-background);
    border-radius: var(--radius-md);
  }
  :global(.left-panel),
  :global(.right-panel) {
    padding: var(--spacing-sm);
    background-color: var(--surface);
  }
  .left-panel,
  .right-panel {
    display: flex;
    flex-direction: column;
  }
  h3 {
    margin-top: 0;
    color: var(--text);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .right-panel button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
    width: 100%;
  }
  
  .right-panel button:hover {
    text-decoration: underline;
  }
  .search-results {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  .search-result {
    padding: var(--spacing-md);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background-color: var(--surface);
  }
  .search-result h3 {
    margin: 0 0 var(--spacing-sm);
    color: var(--primary);
  }
  .content {
    margin: var(--spacing-sm) 0;
    color: var(--text);
  }
  .metadata {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    align-items: center;
    font-size: 0.9em;
    color: var(--text-light);
  }
  .type {
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--primary);
    color: var(--surface);
    border-radius: var(--radius-sm);
  }
  .tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
  .tag {
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--surface-background);
    border-radius: var(--radius-sm);
  }
  .error-message {
    padding: var(--spacing-md);
    background-color: var(--states-error);
    color: var(--surface);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
  }
</style>