<!--
@component Header
Navigation logic container that manages state and behavior for the entire navigation system.
Features:
- Context menu management
- User menu state
- Mobile responsiveness
- Navigation item handling
-->
<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import type { Snippet } from 'svelte';
  import type { Category } from './types';
  import { onMount } from 'svelte';
  import VistaMenu from '$lib/components/Organisms/NavBars/VistaMenu.svelte';
  import NavigationBar from '$lib/components/Layouts/Header/NavigationLogic/Navigationlogic.svelte';
  import UserNavbar from '$lib/components/Organisms/NavBars/UserNavbar.svelte';

  // Props
  let { 
    content,
    categories = [],
  } = $props<{
    content?: Snippet;
    categories?: Category[];
  }>();

  // Theme context
  const theme = getContext<UnifiedThemeContext>('theme');

  // State management
  let isContextMenuOpen = $state(false);
  let isUserMenuOpen = $state(false);
  let isMobileMenuOpen = $state(false);
  let activeSubmenu = $state<string | null>(null);
  let contextMenuRef = $state<HTMLElement | null>(null);
  let isHeaderFocused = $state(false);
  let headerRef: HTMLElement;

  // Computed dimensions based on hover state
  let headerHeight = $derived(`${isHeaderFocused ? '15vh' : '7.5vh'}`);
  let componentWidth = $derived(`${isHeaderFocused ? '20%' : '10%'}`);

  // Event handlers
  function handleMouseEnter() {
    isHeaderFocused = true;
  }

  function handleMouseLeave() {
    isHeaderFocused = false;
  }

  function handleContextMenu() {
    isContextMenuOpen = !isContextMenuOpen;
  }

  function handleUserMenu() {
    isUserMenuOpen = !isUserMenuOpen;
  }

  function handleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function handleSubmenu(submenu: string | null) {
    activeSubmenu = submenu;
  }

  function handleClickOutside(event: MouseEvent) {
    if (contextMenuRef && !contextMenuRef.contains(event.target as Node)) {
      isContextMenuOpen = false;
    }
  }

  // Setup event listeners
  $effect(() => {
    if (headerRef) {
      headerRef.addEventListener('mouseenter', handleMouseEnter);
      headerRef.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        headerRef.removeEventListener('mouseenter', handleMouseEnter);
        headerRef.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  });
</script>

<header 
  bind:this={headerRef}
  class="header"
  style:height={headerHeight}
>
  <div class="header-content" class:focused={isHeaderFocused}>
    <div class="vista-section" style:width={componentWidth}>
      <VistaMenu />
    </div>
    
    <div class="navigation-section">
      <NavigationBar
        {categories}
        {isContextMenuOpen}
        {isUserMenuOpen}
        {isMobileMenuOpen}
        {activeSubmenu}
        oncontextmenu={handleContextMenu}
        onusermenu={handleUserMenu}
        onmobilemenu={handleMobileMenu}
        onsubmenuchange={handleSubmenu}
        onclickoutside={handleClickOutside}
      />
    </div>
    
    <div class="user-section" style:width={componentWidth}>
      <UserNavbar />
    </div>
  </div>

  {#if content}
    <div class="content-section">
      {@render content()}
    </div>
  {/if}
</header>

<style>
  .header {
    position: relative;
    width: 100%;
    min-height: var(--header-min-height, 48px);
    transition: height var(--transition-normal) var(--ease-standard);
  }

  .header-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    height: 100%;
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }

  .vista-section,
  .user-section {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  .navigation-section {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .content-section {
    width: 100%;
    padding: var(--spacing-md);
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
</style>