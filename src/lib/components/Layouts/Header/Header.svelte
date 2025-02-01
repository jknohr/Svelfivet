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
  import type { Category } from '../NavigationBar/types';
  import NavigationBar from '../NavigationBar/NavigationBar.svelte';
  
  // Navigation types
  interface NavigationItem {
    id: string;
    label: string;
    icon?: string;
    href?: string;
    items?: NavigationItem[];
    action?: () => void;
  }

  interface UserNav {
    top: NavigationItem[];
    bottom: NavigationItem[];
  }

  // Props
  let { content } = $props<{
    content?: Snippet;
  }>();

  // Menu Structure
  let categories = $state<Category[]>([
    { name: 'Home', icon: 'home', sub: ['Overview', 'Updates', 'News'] },
    { name: 'Services', icon: 'build', sub: ['Consulting', 'Support', 'Training'] },
    { name: 'About', icon: 'info', sub: ['Team', 'History', 'Careers'] },
    { name: 'Contact', icon: 'call', sub: ['Email', 'Phone', 'Locations'] }
  ]);

  // State management
  let isContextMenuOpen = $state(false);
  let isUserMenuOpen = $state(false);
  let isMobileMenuOpen = $state(false);
  let activeSubmenu = $state<string | null>(null);
  let contextMenuRef = $state<HTMLElement | null>(null);
  let isHeaderFocused = $state(false);

  // Theme context
  const theme = getContext<UnifiedThemeContext>('theme');

  // Computed dimensions
  let headerHeight = $derived(`${isHeaderFocused ? '15%' : '7.5%'}`);
  let componentWidth = $derived(`${isHeaderFocused ? '20%' : '10%'}`);

  // Event handlers
  function handleContextMenu() {
    isContextMenuOpen = !isContextMenuOpen;
    if (isContextMenuOpen) {
      isUserMenuOpen = false;
    }
  }

  function handleUserMenu() {
    isUserMenuOpen = !isUserMenuOpen;
    if (isUserMenuOpen) {
      isContextMenuOpen = false;
    }
  }

  function handleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function handleSubmenu(submenuId: string | null) {
    activeSubmenu = submenuId;
  }

  function handleClickOutside() {
    isContextMenuOpen = false;
    isUserMenuOpen = false;
    activeSubmenu = null;
  }

  function handleHeaderFocus(focused: boolean) {
    isHeaderFocused = focused;
  }

  // Effects
  $effect(() => {
    if (!contextMenuRef) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (contextMenuRef && !contextMenuRef.contains(e.target as Node)) {
        handleClickOutside();
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  });
</script>

<header class="header">
  <div class="header-content" class:focused={isHeaderFocused}>
    <div class="vista-section">
      <NavigationBar
        {headerHeight}
        {componentWidth}
        {content}
        {categories}
        {isContextMenuOpen}
        {isUserMenuOpen}
        {isMobileMenuOpen}
        {activeSubmenu}
        {isHeaderFocused}
        onContextMenu={handleContextMenu}
        onUserMenu={handleUserMenu}
        onMobileMenu={handleMobileMenu}
        onSubmenuChange={handleSubmenu}
        onClickOutside={handleClickOutside}
        onHeaderFocus={handleHeaderFocus}
      />
    </div>
    <div class="content-section">
      {#if content}
        {@render content()}
      {/if}
    </div>
    <div class="auth-section">
      <!-- Auth content will be added later -->
    </div>
  </div>
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

  .vista-section,
  .auth-section {
    flex: 0 0 auto;
    height: 100%;
    transition: all var(--transition-normal) var(--ease-standard);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content-section {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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