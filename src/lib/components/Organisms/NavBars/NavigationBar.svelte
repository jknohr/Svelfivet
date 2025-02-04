<svelte:options runes={true} />

<script lang="ts">
  import { currentVista } from '$lib/stores/vista';
  import { currentContext } from '$lib/stores/context';
  import { vistaConfigs, navigationAccess } from '$lib/components/Vistas/navigation';
  import { Spring } from 'svelte/motion';
  import { fade, slide } from 'svelte/transition';
  import type { 
    Category,
    SearchResult,
    NavigationState,
    NavigationBarProps,
    ViewMode
  } from './Navigation.types';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { LayoutAccessibility } from '$lib/components/Layouts/types';
  import { defaultAccessibility } from '$lib/components/Layouts/types';
  import type { VistaType } from '$lib/types/vista';
  import type { ContextType } from '$lib/types/context';

  type Props = NavigationBarProps & {
    categories: Category[];
  };

  const { 
    headerHeight = '64px',
    componentWidth,
    config,
    accessibility = defaultAccessibility,
    searchEnabled = true,
    onNavigate,
    onNavigationChange,
    isContextMenuOpen = false,
    isUserMenuOpen = false,
    isMobileMenuOpen = false,
    activeSubmenu = null,
    oncontextmenu = () => {},
    onusermenu = () => {},
    onmobilemenu = () => {},
    onsubmenuchange = (submenu: string | null) => {},
    onclickoutside = (event: MouseEvent) => {},
    viewMode = 'desktop' as ViewMode,
    categories = []
  } = $props();

  // Define proper function types
  type NavigateFunction = (path: string) => void;
  type NavigationChangeFunction = (items: Category[]) => void;
  type SubmenuChangeFunction = (submenu: string | null) => void;

  // State
  let searchQuery = $state('');
  let selectedCategory = $state<string | null>(null);
  let isSearching = $state(false);
  let searchResults = $state<SearchResult[]>([]);
  let currentCtx = $state<ContextType>('real-estate');
  let navigationItems = $state<Category[]>([]);
  let reducedMotion = $state(false);
  let isMobile = $state(false);
  let currentFrostIntensity = $state(0);
  let highlightedIndex = $state(-1);

  // Springs for animations
  const springConfig = { damping: 0.7, stiffness: 0.2 };
  const frostIntensity = new Spring(0, springConfig);
  const blurIntensity = new Spring(0, springConfig);
  const rotationAngleTop = new Spring(0, springConfig);
  const rotationAngleBottom = new Spring(0, springConfig);
  const translationY = new Spring(0, springConfig);

  // Derived values
  let filteredCategories = $derived<Category[]>(
    isSearching && searchResults.length > 0
      ? searchResults.map(result => ({
          id: result.text,
          name: result.text,
          icon: result.icon
        }))
      : navigationItems
  );

  // Methods
  function handleCategorySelect(category: Category) {
    selectedCategory = category.name;
    if (!reducedMotion) {
      rotationAngleTop.set(45);
      rotationAngleBottom.set(-45);
      translationY.set(10);
    }
  }

  function handleVistaChange(vista: VistaType) {
    if ($currentVista?.current) {
      $currentVista.current = vista;
    }
  }

  function handleKeyDown(event: KeyboardEvent, category: Category) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleCategorySelect(category);
        break;
      case 'ArrowUp':
        event.preventDefault();
        highlightedIndex = Math.max(0, highlightedIndex - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        highlightedIndex = Math.min(filteredCategories.length - 1, highlightedIndex + 1);
        break;
    }
  }

  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
    isSearching = !!searchQuery.trim();
    
    if (searchQuery.trim()) {
      searchResults = searchCategories(searchQuery);
      highlightedIndex = 0;
    } else {
      searchResults = [];
      highlightedIndex = -1;
    }
  }

  function handleNavigation(path: string) {
    onNavigate?.(path);
  }

  function searchCategories(query: string): SearchResult[] {
    // Implement search logic here
    return [];
  }

  // Effects
  $effect(() => {
    if ($currentVista?.current) {
      const vistaConfig = vistaConfigs[$currentVista.current];
      const userRole = 'user'; // Replace with actual user role
      const allowedSections = navigationAccess.roles[userRole] || [];
      
      navigationItems = categories.filter((category: Category) => 
        allowedSections.includes(category.name)
      );
    }
  });

  $effect(() => {
    const contextValue = $currentContext.current;
    if (contextValue) {
      currentCtx = contextValue;
      navigationItems = categories;
      onNavigationChange?.(navigationItems);
    }
  });

  // Mobile detection
  $effect(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  // Reduced motion detection
  $effect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mediaQuery.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  });

  // Reset animations
  $effect(() => {
    if (!selectedCategory || reducedMotion) {
      rotationAngleTop.set(0);
      rotationAngleBottom.set(0);
      translationY.set(0);
    }
  });
</script>

<UIScalingLayout>
  <nav
    class="navigation"
    class:mobile={isMobile}
    role={accessibility.aria.role}
    aria-label={accessibility.aria.label}
    transition:fade={{ duration: reducedMotion ? 0 : 200 }}
  >
    {#if config.icon || config.label}
      <header class="nav-header">
        {#if config.icon}
          <span class="nav-icon" aria-hidden="true">{config.icon}</span>
        {/if}
        {#if config.label}
          <h2 class="nav-label">{config.label}</h2>
        {/if}
      </header>
    {/if}

    {#if searchEnabled}
      <div 
        class="search-container"
        transition:slide={{ duration: reducedMotion ? 0 : 200 }}
      >
        <input
          type="search"
          class="search-input"
          class:frost={$frostIntensity > 0}
          style="--frost-intensity: {$frostIntensity}"
          placeholder="Search navigation..."
          bind:value={searchQuery}
          oninput={handleSearch}
          aria-label="Search navigation items"
        />
        <span class="search-icon" aria-hidden="true">🔍</span>
      </div>
    {/if}

    {#if config.content}
      <div class="content">
        {#await Promise.resolve(config.content())}
          <p>Loading...</p>
        {:then result}
          {result}
        {:catch error}
          <p style="color: red">{error.message}</p>
        {/await}
      </div>
    {/if}

    <ul 
      class="nav-items" 
      role="menu"
      transition:slide={{ duration: reducedMotion ? 0 : 200 }}
    >
      {#each filteredCategories as category, index (category.id)}
        {#if true}
          {@const typedCategory = category as Category}
          {@const isSelected = selectedCategory === typedCategory.name}
          {@const isHighlighted = index === highlightedIndex}
          <li 
            class="nav-item"
            class:highlighted={isHighlighted}
            role="menuitem"
            transition:slide={{ duration: reducedMotion ? 0 : 200 }}
          >
            <GlassPane
              as="button"
              className={`nav-button ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
              onclick={() => handleCategorySelect(typedCategory)}
              onkeydown={(e: KeyboardEvent) => handleKeyDown(e, typedCategory)}
              tabindex="0"
              ariaSelected={isSelected}
              style="--rotation-top: {$rotationAngleTop}deg; --rotation-bottom: {$rotationAngleBottom}deg; --translation-y: {$translationY}px"
            >
              {#if typedCategory.icon}
                <span class="item-icon" aria-hidden="true">{typedCategory.icon}</span>
              {/if}
              <span class="item-label">{typedCategory.name}</span>
            </GlassPane>
          </li>
        {/if}
      {/each}
    </ul>
  </nav>
</UIScalingLayout>

<style>
  :global(.nav-button) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    transform: 
      rotateX(var(--rotation-top, 0))
      rotateY(var(--rotation-bottom, 0))
      translateY(var(--translation-y, 0));
  }

  :global(.nav-button:hover) {
    background-color: var(--hover-bg, rgba(0, 0, 0, 0.05));
  }

  :global(.nav-button.selected) {
    background-color: var(--selected-bg, rgba(0, 0, 0, 0.1));
  }

  :global(.nav-button.highlighted) {
    outline: 2px solid var(--highlight-color, #0066cc);
  }

  .item-icon {
    font-size: 1.2rem;
    transition: transform 0.2s;
  }

  .item-label {
    flex: 1;
  }

  :global(.nav-button:focus-visible) {
    outline: 2px solid var(--focus-color, #0066cc);
    outline-offset: -2px;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.nav-button),
    .item-icon {
      transition: none;
    }
  }

  .navigation {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .navigation.mobile {
    padding: 0.5rem;
  }

  .nav-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-icon {
    font-size: 1.5rem;
  }

  .nav-label {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .search-container {
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 0.5rem;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 4px;
    transition: all 0.2s;
  }

  .search-input.frost {
    backdrop-filter: blur(calc(var(--frost-intensity, 0) * 5px));
    background-color: rgba(255, 255, 255, calc(var(--frost-intensity, 0) * 0.1));
  }

  .search-icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .nav-items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-item {
    margin: 0;
  }

  .nav-item.highlighted {
    transform: translateX(4px);
  }
</style>
