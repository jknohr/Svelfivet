<!--
@component NavigationBar
Visual presentation of the navigation system.
Features:
- Glass effect styling
- Responsive layout
- Hover/focus animations
- AR/VR spatial adaptations
-->
<svelte:options immutable={true} />



<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Spring, Tweened } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type {
    Category,
    SearchResult,
    NavigationBarProps,
    NavigationState
  } from '../../Layouts/Header/NavigationLogic/types';
  import { writable } from 'svelte/store';

  // Props
  export let headerHeight: string = '60px';
  export let componentWidth: string = '100%';
  export let content: () => any = null;
  export let categories: Category[] = [];
  export let isContextMenuOpen: boolean = false;
  export let isUserMenuOpen: boolean = false;
  export let isMobileMenuOpen: boolean = false;
  export let activeSubmenu: string = '';
  export let isHeaderFocused: boolean = false;
  export let onContextMenu: () => void = () => {};
  export let onUserMenu: () => void = () => {};
  export let onMobileMenu: () => void = () => {};
  export let onSubmenuChange: (category: string) => void = () => {};
  export let onClickOutside: () => void = () => {};
  export let onHeaderFocus: (focused: boolean) => void = () => {};

  // Reactive State
  let selectedCategory: string | null = null;
  let searchQuery: string = '';
  let highlightedIndex: number = -1;
  let darkMode: boolean = false;
  let isSearching: boolean = false;
  let filteredCategories: Category[] = [...categories];
  let searchResults: SearchResult[] = [];
  let reducedMotion: boolean = false;
  let isMobile: boolean = false;

  // Reactive Variables with $state
  const selectedCategoryState = $state(selectedCategory);
  const searchQueryState = $state(searchQuery);
  const highlightedIndexState = $state(highlightedIndex);
  const darkModeState = $state(darkMode);
  const isSearchingState = $state(isSearching);
  const filteredCategoriesState = $state(filteredCategories);
  const searchResultsState = $state(searchResults);
  const reducedMotionState = $state(reducedMotion);
  const isMobileState = $state(isMobile);

  // Motion Configuration using Spring and Tweened
  const rotationAngleTop = new Spring(0, {
    stiffness: reducedMotion ? 1 : 0.1,
    damping: reducedMotion ? 1 : 0.3
  });

  const rotationAngleBottom = new Spring(0, {
    stiffness: reducedMotion ? 1 : 0.1,
    damping: reducedMotion ? 1 : 0.3
  });

  const frostIntensity = new Tweened(0, {
    duration: reducedMotion ? 0 : 500
  });

  // Subscribe to motion preference changes
  onMount(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (event) => {
      reducedMotion = event.matches;
      updateSpringConfig();
      updateTweenConfig();
    });

    // Mobile detection
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    isMobile = mobileQuery.matches;
    mobileQuery.addEventListener('change', (event) => {
      isMobile = event.matches;
    });
  });

  onDestroy(() => {
    // Clean up event listeners if necessary
  });

  // Update spring and tween configurations when motion preference changes
  $: {
    rotationAngleTop.configure({
      stiffness: reducedMotion ? 1 : 0.1,
      damping: reducedMotion ? 1 : 0.3
    });
    rotationAngleBottom.configure({
      stiffness: reducedMotion ? 1 : 0.1,
      damping: reducedMotion ? 1 : 0.3
    });
    frostIntensity.set(currentFrostIntensity, {
      duration: reducedMotion ? 0 : 500
    });
  }

  // Track frost intensity changes
  let currentFrostIntensity = 0;
  $: {
    frostIntensity.subscribe((value) => {
      currentFrostIntensity = value;
    });
  }

  // Update filtered categories when search query changes
  $: {
    if (searchQuery) {
      filteredCategories = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.sub.some((subItem) =>
            subItem.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    } else {
      filteredCategories = [...categories];
    }
  }

  // Update search results when filtered categories or selected category changes
  $: {
    const results: SearchResult[] = [];
    filteredCategories.forEach((cat) => {
      results.push({ type: 'category', text: cat.name, icon: cat.icon });
      if (selectedCategory === cat.name) {
        cat.sub.forEach((sub) =>
          results.push({ type: 'subcategory', text: sub, parent: cat.name })
        );
      }
    });
    searchResults = results;
  }

  // Event Handlers
  function handleCategorySelect(category: string) {
    selectedCategory = category;
    onSubmenuChange(category);
    searchQuery = '';
    isSearching = false;
  }

  function handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    searchQuery = input.value;
    highlightedIndex = -1;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isSearching) {
      if (event.key === '/') {
        event.preventDefault();
        isSearching = true;
        return;
      }
    } else {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          highlightedIndex = Math.min(highlightedIndex + 1, searchResults.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          highlightedIndex = Math.max(highlightedIndex - 1, -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0) {
            const result = searchResults[highlightedIndex];
            if (result.type === 'category') {
              handleCategorySelect(result.text);
            } else if (result.parent) {
              handleCategorySelect(result.parent);
            }
          }
          break;
        case 'Escape':
          event.preventDefault();
          isSearching = false;
          searchQuery = '';
          highlightedIndex = -1;
          break;
        default:
          break;
      }
    }
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
  }

  // Spring configuration
  const springConfig = {
    stiffness: reducedMotion ? 1 : 0.1,
    damping: reducedMotion ? 1 : 0.3
  };

  // Effects for animations
  $: {
    if (selectedCategory) {
      const index = categories.findIndex((c) => c.name === selectedCategory);
      rotationAngleTop.set(index * -45);
      rotationAngleBottom.set(index * 30);
      frostIntensity.set(index * 5);
    }
  }

  // Responsive Configuration
  $: {
    if (isMobile) {
      // Limit the number of visible menu items to 3
      const maxVisibleItems = 3;
      filteredCategories = filteredCategories.slice(0, maxVisibleItems);
    } else {
      // Reset to full list
      filteredCategories = [...categories];
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<header
  class="header"
  style:height={headerHeight}
  style:width={componentWidth}
  onmouseenter={() => onHeaderFocus(true)}
  onmouseleave={() => onHeaderFocus(false)}
  onfocusin={() => onHeaderFocus(true)}
  onfocusout={() => onHeaderFocus(false)}
>
  <GlassPane
    variant={darkMode ? 'dark' : 'light'}
    state={isHeaderFocused ? 'focus' : 'default'}
    glowOnHover={true}
    style="filter: blur({currentFrostIntensity}px)"
  >
    <div
      class="header-content"
      class:focused={isHeaderFocused}
      class:dark-mode={darkMode}
      aria-label="Navigation Bar"
    >
      <button
        class="dark-mode-toggle"
        onclick={toggleDarkMode}
        aria-label="Toggle Dark Mode"
      >
        <Typography isIcon size="lg">
          {darkMode ? 'dark_mode' : 'light_mode'}
        </Typography>
      </button>

      {#if isSearching}
        <div class="search-container" transition:fade>
          <input
            type="text"
            placeholder="Search menu... (Esc to close)"
            value={searchQuery}
            oninput={handleSearchInput}
            class="search-input"
            aria-label="Search Input"
          />
          {#if searchQuery}
            <div class="search-results" aria-label="Search Results">
              {#each searchResults as result, i (result.type + result.text)}
                <div
                  class="search-result"
                  class:highlighted={i === highlightedIndex}
                  onclick={() => {
                    if (result.type === 'category') {
                      handleCategorySelect(result.text);
                    } else if (result.parent) {
                      handleCategorySelect(result.parent);
                    }
                  }}
                >
                  {result.text}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        <div class="nav-container">
          <svg class="menu-svg" viewBox="0 0 400 400">
            <!-- Top disc with main categories -->
            <g class="top-disc" style:transform={`rotate(${rotationAngleTop}deg)`}>
              {#each filteredCategories as cat, i (cat.name)}
                <text
                  x="200"
                  y={50 + i * 30}
                  class="menu-item"
                  onclick={() => handleCategorySelect(cat.name)}
                  tabindex="0"
                  role="button"
                  aria-label={`Category ${cat.name}`}
                >
                  <Typography isIcon size="base">{cat.icon}</Typography> {cat.name}
                </text>
              {/each}
            </g>

            <!-- Bottom disc with subcategories -->
            <g class="bottom-disc" style:transform={`rotate(${rotationAngleBottom}deg)`}>
              {#if selectedCategory}
                {#each categories.find((c) => c.name === selectedCategory)?.sub || [] as subItem, i}
                  <text
                    x="200"
                    y={200 + i * 30}
                    class="submenu-item"
                    tabindex="0"
                    role="button"
                    aria-label={`Subcategory ${subItem}`}
                  >
                    {subItem}
                  </text>
                {/each}
              {/if}
            </g>
          </svg>
        </div>
      {/if}

      {#if content}
        <div class="content-section">
          {@html content()}
        </div>
      {/if}
    </div>
  </GlassPane>
</header>


<style>
  .header {
    position: relative;
    width: 100%;
    min-height: var(--header-min-height, 48px);
    transition: height var(--transition-normal) var(--ease-standard);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }

  .nav-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 600px;
    z-index: 1000;
}

  .search-input {
    width: 100%;
    padding: 12px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    background: var(--surface-color, #ffffff);
    color: var(--text-color, #000000);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    background: var(--surface-color, #ffffff);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
  }

  .search-result {
    padding: 12px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background-color 0.2s ease;
  }

  .search-result:hover,
  .search-result.highlighted {
    background-color: var(--hover-color, rgba(0, 0, 0, 0.05));
  }

  .result-icon {
    font-size: 20px;
  }

  .result-text {
    flex: 1;
  }

  .menu-svg {
    width: 100%;
    height: 100%;
    max-height: 400px;
  }

  .menu-item,
  .submenu-item {
    fill: var(--text-color);
    font-size: 16px;
    text-anchor: middle;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .menu-item:hover {
    fill: var(--accent-color);
    font-size: 18px;
  }

  .dark-mode-toggle {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    z-index: 10;
  }

  .dark-mode {
    background: var(--dark-bg);
    color: var(--dark-text);
  }

  .top-disc,
  .bottom-disc {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Spatial adjustments */
  @media (--ar) {
    .header {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-floating));
    }

    .header-content.focused {
      transform: scale(1.1) translateZ(calc(var(--depth-floating) * 1.5));
    }
  }

  @media (--vr) {
    .header {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }

    .header-content.focused {
      transform: scale(1.2) translateZ(calc(var(--depth-ui) * 1.5));
    }
  }

  /* Update transition styles to respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .header,
    .header-content,
    .search-result,
    .menu-item,
    .submenu-item,
    .top-disc,
    .bottom-disc {
      transition: none;
    }

    .menu-item:hover {
      /* Keep color change but remove size animation */
      fill: var(--accent-color);
      font-size: 16px;
    }

    /* Disable spatial animations in AR/VR when reduced motion is preferred */
    @media (--ar), (--vr) {
      .header,
      .header-content.focused {
        transform: none;
      }
    }
  }
</style>