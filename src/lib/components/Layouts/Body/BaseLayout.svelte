<svelte:options runes={true} />

<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { Snippet } from 'svelte';
  import { layoutConfig } from '$lib/components/Vistas/navigation';
  import BaseContentLayout from './Content/BaseContentLayout.svelte';
  import BaseControlPanel from './UserControlPanel/BaseControlPanel.svelte';
  import BaseContentPanel from './AIContentPanel/BaseContentPanelLayout.svelte';

  interface Props {
    leftComponent?: Snippet;
    rightComponent?: Snippet;
    mainContent?: Snippet;
    headerExpanded?: boolean;
    showFilters?: boolean;
    filters?: Snippet;
  }

  // Props using proper $props rune syntax
  let { 
    leftComponent,
    rightComponent,
    mainContent,
    headerExpanded = false,
    showFilters = false,
    filters,
  } = $props<Props>();

  // State declarations
  let isLeftExpanded = $state(false);
  let isRightExpanded = $state(false);
  let isLeftLocked = $state(false);
  let isRightLocked = $state(false);

  // Derived values using layoutConfig
  let bodyHeight = $derived(headerExpanded ? 
    `calc(100vh - ${layoutConfig.header.height} - ${layoutConfig.footer.height})` : 
    `calc(100vh - ${layoutConfig.header.height} - ${layoutConfig.footer.height})`
  );
  
  let widths = $derived({
    left: isLeftExpanded ? layoutConfig.sidebar.expandedWidth : layoutConfig.sidebar.collapsedWidth,
    right: isRightExpanded ? layoutConfig.sidebar.expandedWidth : layoutConfig.sidebar.collapsedWidth,
    main: (() => {
      if (isLeftExpanded && isRightExpanded) return layoutConfig.content.defaultWidth;
      if (isLeftExpanded || isRightExpanded) return layoutConfig.content.maxWidth;
      return '95%';
    })()
  });

  // Panel event handlers
  function handleLeftPanelExpand() {
    isLeftExpanded = !isLeftExpanded;
  }

  function handleRightPanelExpand() {
    isRightExpanded = !isRightExpanded;
  }

  function handleLeftPanelLock() {
    isLeftLocked = !isLeftLocked;
    isLeftExpanded = isLeftLocked;
  }

  function handleRightPanelLock() {
    isRightLocked = !isRightLocked;
    isRightExpanded = isRightLocked;
  }

  // Type-safe event handler
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    if (isLeftLocked && !target.closest('.left-sidebar')) {
      handleLeftPanelLock();
    }
    
    if (isRightLocked && !target.closest('.right-sidebar')) {
      handleRightPanelLock();
    }
  }

  // Setup click handler
  $effect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  });
</script>

<div class="layout-container" style:height={bodyHeight}>
  <BaseContentPanel
    content={leftComponent}
    isExpanded={isLeftExpanded}
    isLocked={isLeftLocked}
    onToggleExpand={handleLeftPanelExpand}
    onToggleLock={handleLeftPanelLock}
    class="left-sidebar"
    style:width={widths.left}
  />

  <BaseContentLayout
    content={mainContent}
    {filters}
    {showFilters}
    style:width={widths.main}
  />

  <BaseControlPanel
    content={rightComponent}
    isExpanded={isRightExpanded}
    isLocked={isRightLocked}
    class="right-sidebar"
    style:width={widths.right}
  >
    <div slot="controls">
      <button 
        on:click={handleRightPanelExpand}
        aria-label={isRightExpanded ? 'Collapse panel' : 'Expand panel'}
      >
        {isRightExpanded ? '→' : '←'}
      </button>
      <button 
        on:click={handleRightPanelLock}
        aria-label={isRightLocked ? 'Unlock panel' : 'Lock panel'}
      >
        {isRightLocked ? '🔓' : '🔒'}
      </button>
    </div>
  </BaseControlPanel>
</div>

<style>
  .layout-container {
    display: flex;
    width: 100%;
    gap: var(--spacing-md);
    position: relative;
    transition: height 0.3s ease;
  }

  :global(.left-sidebar),
  :global(.right-sidebar) {
    position: sticky;
    top: 0;
    height: 100%;
    transition: all 0.3s ease;
  }

  button {
    padding: var(--spacing-xs);
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  button:hover {
    opacity: 1;
  }
</style>
