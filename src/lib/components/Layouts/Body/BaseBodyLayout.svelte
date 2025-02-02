# BaseLayout.svelte
<svelte:options runes={true} />

<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { Snippet } from 'svelte';

  // Props using proper $props rune syntax
  let { 
    leftComponent,
    rightComponent,
    mainContent,
    headerExpanded = false 
  } = $props<{
    leftComponent?: Snippet;
    rightComponent?: Snippet;
    mainContent?: Snippet;
    headerExpanded?: boolean;
  }>();

  // State declarations
  let isLeftExpanded = $state(false);
  let isRightExpanded = $state(false);
  let isLeftLocked = $state(false);
  let isRightLocked = $state(false);

  // Derived values
  let bodyHeight = $derived(headerExpanded ? '78.5vh' : '85vh');
  
  let widths = $derived({
    left: isLeftExpanded ? '25%' : '2.5%',
    right: isRightExpanded ? '25%' : '2.5%',
    main: (() => {
      if (isLeftExpanded && isRightExpanded) return '50%';
      if (isLeftExpanded || isRightExpanded) return '72.5%';
      return '95%';
    })()
  });

  // Event handlers
  function handleMouseEnter(side: 'left' | 'right') {
    if (side === 'left' && !isLeftLocked) {
      isLeftExpanded = true;
    } else if (side === 'right' && !isRightLocked) {
      isRightExpanded = true;
    }
  }

  function handleMouseLeave(side: 'left' | 'right') {
    if (side === 'left' && !isLeftLocked) {
      isLeftExpanded = false;
    } else if (side === 'right' && !isRightLocked) {
      isRightExpanded = false;
    }
  }

  function handleClick(side: 'left' | 'right', event: MouseEvent | KeyboardEvent) {
    event.stopPropagation();
    if (side === 'left') {
      isLeftLocked = !isLeftLocked;
      isLeftExpanded = isLeftLocked;
    } else {
      isRightLocked = !isRightLocked;
      isRightExpanded = isRightLocked;
    }
  }

  // Handle outside click using $effect
  $effect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      
      if (isLeftLocked) {
        const leftSidebar = document.querySelector('.left-sidebar');
        if (leftSidebar && !leftSidebar.contains(target)) {
          isLeftLocked = false;
          isLeftExpanded = false;
        }
      }
      
      if (isRightLocked) {
        const rightSidebar = document.querySelector('.right-sidebar');
        if (rightSidebar && !rightSidebar.contains(target)) {
          isRightLocked = false;
          isRightExpanded = false;
        }
      }
    }

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  });
</script>

<div class="layout-container" style:height={bodyHeight}>
  <!-- Left Sidebar - AI Content Panel -->
  <aside 
    class="sidebar left-sidebar frosted-glass"
    class:expanded={isLeftExpanded}
    class:locked={isLeftLocked}
    style:width={widths.left}
    onmouseenter={() => handleMouseEnter('left')}
    onmouseleave={() => handleMouseLeave('left')}
    aria-label="Left sidebar"
    transition:fly={{x: -20, duration: 300}}
  >
    <button 
      class="sidebar-button"
      onclick={(e) => handleClick('left', e)}
      onkeydown={(e) => e.key === 'Enter' && handleClick('left', e)}
      aria-label="Toggle left sidebar"
    >
      <div class="sidebar-content">
        {#if leftComponent}
          {@render leftComponent()}
        {/if}
      </div>
      <div class="lock-indicator" class:active={isLeftLocked}>
        <span class="sr-only">{isLeftLocked ? 'Sidebar locked' : 'Sidebar unlocked'}</span>
      </div>
    </button>
  </aside>

  <!-- Main Content Area -->
  <main 
    class="main-content frosted-glass"
    style:width={widths.main}
  >
    {#if mainContent}
      {@render mainContent()}
    {/if}
  </main>

  <!-- Right Sidebar - User Control Panel -->
  <aside 
    class="sidebar right-sidebar frosted-glass"
    class:expanded={isRightExpanded}
    class:locked={isRightLocked}
    style:width={widths.right}
    onmouseenter={() => handleMouseEnter('right')}
    onmouseleave={() => handleMouseLeave('right')}
    aria-label="Right sidebar"
    transition:fly={{x: 20, duration: 300}}
  >
    <button 
      class="sidebar-button"
      onclick={(e) => handleClick('right', e)}
      onkeydown={(e) => e.key === 'Enter' && handleClick('right', e)}
      aria-label="Toggle right sidebar"
    >
      <div class="sidebar-content">
        {#if rightComponent}
          {@render rightComponent()}
        {/if}
      </div>
      <div class="lock-indicator" class:active={isRightLocked}>
        <span class="sr-only">{isRightLocked ? 'Sidebar locked' : 'Sidebar unlocked'}</span>
      </div>
    </button>
  </aside>
</div>

<style>
  .layout-container {
    display: flex;
    width: 100%;
    gap: var(--spacing-md, 1rem);
    position: relative;
    transition: height 0.3s ease;
  }

  .sidebar {
    position: sticky;
    top: 0;
    height: 100%;
    transition: all 0.3s ease;
    border-radius: var(--radius-lg, 0.5rem);
    border: 1px solid rgba(255, 255, 255, 0.18);
    overflow: hidden;
    cursor: pointer;
  }

  .sidebar.expanded {
    backdrop-filter: blur(10px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.05)
    );
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .sidebar.locked {
    border-color: var(--color-primary, #6200ea);
  }

  .main-content {
    flex: 1;
    min-width: 0;
    border-radius: var(--radius-lg, 0.5rem);
    padding: var(--spacing-lg, 1.5rem);
    transition: width 0.3s ease;
    backdrop-filter: blur(10px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }

  .sidebar-content {
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: var(--spacing-md, 1rem);
  }

  .sidebar.expanded .sidebar-content {
    opacity: 1;
  }

  .lock-indicator {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-secondary, #03dac6);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .lock-indicator.active {
    opacity: 1;
  }

  /* Frosted glass effect base styles */
  .frosted-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  /* Ensure proper spacing for nested content */
  :global(.sidebar > *) {
    margin: var(--spacing-md, 1rem);
  }

  /* Hide content when sidebar is collapsed */
  .sidebar:not(.expanded) .sidebar-content {
    visibility: hidden;
  }

  .sidebar-button {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
</style>