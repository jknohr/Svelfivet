<script lang="ts">
  import { onMount } from 'svelte';
  import type { LayoutComponent } from '$lib/types/components/layout';
  import BaseLayout from '$lib/components/common/shellapp/BaseLayout.svelte';
  import { MainTheme } from '$lib/styles/maintheme';
  import { currentContext } from '$lib/components/Templates/Canvas/stores/context';
  import { get } from 'svelte/store';

  interface Props {
    mode?: 'default' | 'map' | 'split';
    showMap?: boolean;
    showFilters?: boolean;
    expandContent?: boolean;
  }

  let props = $props<Props>();
  let mode = props.mode ?? 'default';
  let showMap = props.showMap ?? false;
  let showFilters = props.showFilters ?? false;
  let expandContent = props.expandContent ?? false;
  
  let leftSidebarActive = $state(false);
  let rightSidebarActive = $state(false);
  let leftSidebarTimer = $state<ReturnType<typeof setTimeout> | null>(null);
  let rightSidebarTimer = $state<ReturnType<typeof setTimeout> | null>(null);

  // Computed states
  let isMapMode = $derived(mode === 'map' || showMap);
  let isFilterMode = $derived(mode === 'split' || showFilters);
  let theme = $state(get(MainTheme));
  let isDarkMode = $derived(theme.colors.background === '#121212');
  
  // Calculate dynamic widths based on sidebar states
  let mainContentWidth = $derived(() => {
    if (expandContent) {
      if (leftSidebarActive && rightSidebarActive) return '50%';
      if (leftSidebarActive || rightSidebarActive) return '72.5%';
      return '95%';
    }
    return '50%';
  });

  // Handle sidebar hover states with delay
  function handleLeftSidebarEnter() {
    if (leftSidebarTimer) clearTimeout(leftSidebarTimer);
    leftSidebarActive = true;
  }

  function handleLeftSidebarLeave() {
    leftSidebarTimer = setTimeout(() => {
      leftSidebarActive = false;
    }, 300);
  }

  function handleRightSidebarEnter() {
    if (rightSidebarTimer) clearTimeout(rightSidebarTimer);
    rightSidebarActive = true;
  }

  function handleRightSidebarLeave() {
    rightSidebarTimer = setTimeout(() => {
      rightSidebarActive = false;
    }, 300);
  }

  onMount(() => {
    return () => {
      if (leftSidebarTimer) clearTimeout(leftSidebarTimer);
      if (rightSidebarTimer) clearTimeout(rightSidebarTimer);
    };
  });
</script>

<BaseLayout let:preContent let:mainContent let:postContent>
  <svelte:fragment slot="pre-content">
    <!-- Pre-content slot -->
  </svelte:fragment>

  <svelte:fragment slot="main-content">
    <div 
      class="real-estate-layout frosted-glass" 
      class:expanded={expandContent}
      class:has-map={isMapMode}
      class:has-filters={isFilterMode}
      class:dark={isDarkMode}
    >
      <!-- Left Sidebar -->
      <aside 
        class="left-sidebar frosted-glass"
        class:active={leftSidebarActive}
        on:mouseenter={handleLeftSidebarEnter}
        on:mouseleave={handleLeftSidebarLeave}
      >
        {#if leftSidebarActive}
          <div class="sidebar-content">
            {#if isFilterMode}
              <div class="filters frosted-glass-focus">
                <h3>Filters</h3>
                <!-- Filter content -->
              </div>
            {/if}
            <div class="ai-suggestions frosted-glass-attention">
              <h3>AI Suggestions</h3>
              <!-- AI suggestions content -->
            </div>
            <div class="bookmarks frosted-glass">
              <h3>Saved Properties</h3>
              <!-- Bookmarked items -->
            </div>
          </div>
        {/if}
      </aside>

      <!-- Main Content Area -->
      <main style:width={mainContentWidth}>
        <slot />
      </main>

      <!-- Right Sidebar -->
      <aside 
        class="right-sidebar frosted-glass"
        class:active={rightSidebarActive}
        on:mouseenter={handleRightSidebarEnter}
        on:mouseleave={handleRightSidebarLeave}
      >
        {#if rightSidebarActive}
          <div class="sidebar-content">
            <!-- AI Chat Interface -->
          </div>
        {/if}
      </aside>
    </div>
  </svelte:fragment>

  <svelte:fragment slot="post-content">
    <!-- Post-content slot -->
  </svelte:fragment>
</BaseLayout>

<style>
  .real-estate-layout {
    display: flex;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at 50% -20%, rgba(var(--color-primary-rgb), 0.15), transparent 70%);
  }

  .left-sidebar,
  .right-sidebar {
    flex: 0 0 2.5%;
    transition: all 0.3s ease;
    opacity: 0.6;
  }

  .left-sidebar.active,
  .right-sidebar.active {
    flex-basis: 25%;
    opacity: 1;
  }

  .sidebar-content {
    width: 100%;
    height: 100%;
    padding: var(--spacing-md);
    overflow-y: auto;
  }

  main {
    flex: 1;
    transition: width 0.3s ease;
    margin: 0 22.5%;
  }

  .real-estate-layout.expanded main {
    margin: 0;
  }

  .filters,
  .ai-suggestions,
  .bookmarks {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
  }

  h3 {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  /* Dark mode adjustments */
  .real-estate-layout.dark {
    background: radial-gradient(circle at 50% -20%, rgba(var(--color-primary-rgb), 0.15), transparent 70%);
  }

  @media (max-width: 1200px) {
    main {
      margin: 0 10%;
    }
  }

  @media (max-width: 768px) {
    .left-sidebar,
    .right-sidebar {
      display: none;
    }

    main {
      margin: 0;
      width: 100% !important;
    }
  }
</style> 