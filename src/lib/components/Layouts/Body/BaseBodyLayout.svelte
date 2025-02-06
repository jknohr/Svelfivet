<svelte:options runes={true} />

<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quartOut } from 'svelte/easing';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import type { LayoutContent, LayoutDimensions, LayoutAccessibility } from '../types';
  import { defaultDimensions, defaultAccessibility } from '../types';
  import type { Snippet } from 'svelte';

  // State for sidebar and content scroll
  let sidebarState = $state({
    side: 'left',
    expanded: false
  });
  
  let scrollState = $state({
    scrollTop: 0,
    scrollHeight: 0
  });

  // Props and state
  let headerExpanded = $state(false);
  let showFilters = $state(false);
  
  let { 
    leftComponent,
    rightComponent,
    mainContent,
    dimensions = defaultDimensions,
    accessibility = defaultAccessibility,
    filters,
    keyboard = {
      leftSidebar: { expand: 'Alt+[', collapse: 'Alt+]' },
      rightSidebar: { expand: 'Alt+;', collapse: "Alt+'" }
    }
  } = $props<{
    leftComponent?: LayoutContent['leftSidebar'];
    rightComponent?: LayoutContent['rightSidebar'];
    mainContent?: LayoutContent['mainContent'];
    dimensions?: Partial<LayoutDimensions>;
    accessibility?: LayoutAccessibility;
    filters?: Snippet;
    keyboard?: {
      leftSidebar: { expand: string; collapse: string };
      rightSidebar: { expand: string; collapse: string };
    };
  }>();

  // Reactive state
  let isLeftExpanded = $state(false);
  let isRightExpanded = $state(false);
  let isLeftLocked = $state(false);
  let isRightLocked = $state(false);
  let mainContentRef = $state<HTMLElement | null>(null);
  let scrollTop = $state(0);
  let scrollHeight = $state(0);

  // Derived values
  let bodyHeight = $derived(
    headerExpanded 
      ? `${dimensions.headerHeight}%`
      : `${dimensions.expandedHeaderHeight}%`
  );

  let widths = $derived({
    left: `${isLeftExpanded 
      ? dimensions.expandedSidebarWidth 
      : dimensions.leftSidebarWidth}%`,
    right: `${isRightExpanded 
      ? dimensions.expandedSidebarWidth 
      : dimensions.rightSidebarWidth}%`,
    main: `${100 - 
      (isLeftExpanded ? dimensions.expandedSidebarWidth : dimensions.leftSidebarWidth) -
      (isRightExpanded ? dimensions.expandedSidebarWidth : dimensions.rightSidebarWidth)}%`
  });

  // Methods
  function handleSidebarInteraction(side: 'left' | 'right', action: 'enter' | 'leave' | 'click', event?: MouseEvent | KeyboardEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const isLeft = side === 'left';
    const locked = isLeft ? isLeftLocked : isRightLocked;
    
    switch (action) {
      case 'enter':
        if (!locked) {
          if (isLeft) isLeftExpanded = true;
          else isRightExpanded = true;
        }
        break;
      case 'leave':
        if (!locked) {
          if (isLeft) isLeftExpanded = false;
          else isRightExpanded = false;
        }
        break;
      case 'click':
        if (isLeft) {
          isLeftLocked = !isLeftLocked;
          isLeftExpanded = isLeftLocked;
        } else {
          isRightLocked = !isRightLocked;
          isRightExpanded = isRightLocked;
        }
        sidebarState = { side, expanded: isLeft ? isLeftExpanded : isRightExpanded };
        break;
    }
  }

  // Content scroll effect
  $effect(() => {
    if (!mainContentRef) return;
    
    function handleScroll(event: Event) {
      if (!(event.target instanceof HTMLElement)) return;
      
      scrollState = { scrollTop: event.target.scrollTop, scrollHeight: event.target.scrollHeight };
    }

    mainContentRef.addEventListener('scroll', handleScroll);
    return () => mainContentRef?.removeEventListener('scroll', handleScroll);
  });

  // Keyboard shortcuts effect
  $effect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.altKey) {
        switch (event.key) {
          case keyboard.leftSidebar.expand:
          case keyboard.leftSidebar.collapse:
            handleSidebarInteraction('left', 'click', event);
            break;
          case keyboard.rightSidebar.expand:
          case keyboard.rightSidebar.collapse:
            handleSidebarInteraction('right', 'click', event);
            break;
        }
      }
    }

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<svelte:boundary>
  <UIScalingLayout>
    <div 
      class="layout-container" 
      style="height: {bodyHeight}"
      role={accessibility.aria.role}
      aria-label={accessibility.aria.label}
    >
      {#if leftComponent}
        <div
          role="region"
          aria-label={accessibility.aria.leftSidebar}
          transition:fly|local={{ x: -20, duration: 200, easing: quartOut }}
        >
          <button 
            class="sidebar left-sidebar"
            class:expanded={isLeftExpanded}
            class:locked={isLeftLocked}
            style="width: {widths.left}"
            onmouseenter={() => handleSidebarInteraction('left', 'enter')}
            onmouseleave={() => handleSidebarInteraction('left', 'leave')}
            onclick={() => handleSidebarInteraction('left', 'click')}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSidebarInteraction('left', 'click', e);
              }
            }}
            type="button"
            aria-expanded={isLeftExpanded}
          >
            {@render leftComponent?.()}
          </button>
        </div>
      {/if}

      <main 
        class="main-content"
        style="width: {widths.main}"
        aria-label={accessibility.aria.mainContent}
        bind:this={mainContentRef}
      >
        {@render mainContent?.()}
        {#if showFilters}
          {@render filters?.()}
        {/if}
      </main>

      {#if rightComponent}
        <div 
          class="sidebar right-sidebar"
          class:expanded={isRightExpanded}
          class:locked={isRightLocked}
          style="width: {widths.right}"
          role="button"
          tabindex="0"
          onmouseenter={handleSidebarInteraction.bind(null, 'right', 'enter')}
          onmouseleave={handleSidebarInteraction.bind(null, 'right', 'leave')}
          onclick={handleSidebarInteraction.bind(null, 'right', 'click')}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSidebarInteraction('right', 'click', e);
            }
          }}
          aria-label={accessibility.aria.rightSidebar}
          aria-expanded={isRightExpanded}
          transition:fly|local={{ x: 20, duration: 200, easing: quartOut }}
        >
          {@render rightComponent?.()}
        </div>
      {/if}
    </div>
  </UIScalingLayout>

  {#snippet failed(error, reset)}
    <div class="error-boundary">
      <p>Something went wrong in the layout: {(error as Error).message}</p>
      <button onclick={reset}>Reset Layout</button>
    </div>
  {/snippet}
</svelte:boundary>

<style>
  .layout-container {
    display: flex;
    width: 100%;
    position: relative;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--surface-1);
  }

  .sidebar {
    position: sticky;
    top: 0;
    height: 100%;
    transition: width var(--transition-duration) var(--transition-timing);
    background: var(--surface-2);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-sm);
  }

  .sidebar.expanded {
    box-shadow: var(--shadow-lg);
  }

  .sidebar.locked {
    border: 2px solid var(--accent);
  }

  .left-sidebar {
    border-right: 1px solid var(--border);
  }

  .right-sidebar {
    border-left: 1px solid var(--border);
  }

  .main-content {
    transition: width var(--transition-duration) var(--transition-timing);
    background: var(--surface-1);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    overflow-y: auto;
    min-height: 100%;
  }

  .error-boundary {
    padding: var(--spacing-lg);
    background: var(--error-surface);
    color: var(--error-text);
    border-radius: var(--radius-lg);
    text-align: center;
  }

  .error-boundary button {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--error-action);
    color: var(--error-action-text);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
  }

  .error-boundary button:hover {
    background: var(--error-action-hover);
  }
</style>
