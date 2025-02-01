
 <!-- src/lib/components/NavigationBar.svelte -->
<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { currentContext } from '$lib/components/Templates/Canvas/stores/context';
  import { auth } from '$lib/stores/auth';
  import { loginPopup } from '$lib/stores/loginPopup';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/common/atomic/buttons/button.svelte';
  import LoginPopup from 'src/routes/auth/login/LoginPopup.svelte';
  import { clickOutside } from '$lib/actions/click-outside';
  import { trapFocus } from '$lib/actions/trap-focus';
  import type { ContextType } from '$lib/types/context';
  import type { NavigationItem, NavigationConfig } from '$lib/types/navigation';
  import { contextConfigs } from '$lib/config/navigation/navigation';
  import {
    Spring,
    Tween,
    prefersReducedMotion,
    spring,
    tweened
  } from 'svelte/motion';
  import { state, effect, derived } from 'svelte/store';

  interface UserNav {
    top: NavigationItem[];
    bottom: NavigationItem[];
  }

  // State management
  let isContextMenuOpen = $state(false);
  let isUserMenuOpen = $state(false);
  let isMobileMenuOpen = $state(false);
  let activeSubmenu = $state<string | null>(null);
  let contextMenuRef = $state<HTMLElement | null>(null);

  // Reactive context data
  let pathname = $state("");
  let currentCtx = $state<ContextType | null>(null);
  let mainNav = $state<NavigationItem[]>([]);
  let userNav = $state<UserNav | null>(null);

  $effect(() => {
    pathname = window.location.pathname;
    currentCtx = $currentContext.current;
    if (currentCtx && contextConfigs[currentCtx]) {
      mainNav = contextConfigs[currentCtx].navigation.main || [];
      userNav = getUserNavigation($auth, currentCtx);
      
      // Check if current path is valid for context
      const isValidPath = mainNav.some(item => 
        pathname.startsWith(item.path) || 
        item.subItems?.some(sub => pathname.startsWith(sub.path))
      );
      
      if (!isValidPath && pathname !== '/') {
        console.warn('Invalid path for context:', pathname);
      }
    }
  });

  // Get user navigation based on auth state and current context
  function getUserNavigation(auth: any, ContextType: ContextType): UserNav {
    if (!auth.isAuthenticated) {
      return {
        top: [
          { label: 'Register', path: '/auth/register', icon: 'person_add' },
          { label: 'Login', path: '#', icon: 'login', onClick: () => loginPopup.open(pathname) }
        ],
        bottom: []
      };
    }

    const contextConfig = contextConfigs[ContextType];
    return {
      top: contextConfig.navigation.user || [],
      bottom: [
        { label: 'Logout', path: '#', icon: 'logout', onClick: handleLogout }
      ]
    };
  }

  // Event handlers
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function toggleSubmenu(menuId: string) {
    activeSubmenu = activeSubmenu === menuId ? null : menuId;
  }

  function toggleContextMenu() {
    isContextMenuOpen = !isContextMenuOpen;
  }

  function toggleUserMenu() {
    isUserMenuOpen = !isUserMenuOpen;
  }

  function handleClickOutside(menu: 'context' | 'user') {
    if (menu === 'context') isContextMenuOpen = false;
    if (menu === 'user') isUserMenuOpen = false;
  }

  async function handleContextSwitch(ContextType: ContextType) {
    try {
      await currentContext.switchContext(ContextType);
      // Reset navigation state
      activeSubmenu = null;
      isContextMenuOpen = false;
      // Update main navigation
      mainNav = contextConfigs[ContextType]?.navigation.main || [];
    } catch (error) {
      console.error('Error switching context:', error);
    }
  }

  function handleNavigation(path: string, requiresAuth = false) {
    if (requiresAuth && !$auth.isAuthenticated) {
      // Open login popup with redirect path
      loginPopup.open(path);
      return;
    }
    
    goto(path);
    isMobileMenuOpen = false;
    activeSubmenu = null;
  }

  function handleLogout() {
    auth.logout();
    isUserMenuOpen = false;
  }

  // Check if a route requires authentication
  function requiresAuth(item: NavigationItem): boolean {
    return item.requiresAuth || false;
  }

  // Check if user has required roles for a route
  function hasRequiredRoles(item: NavigationItem): boolean {
    if (!item.roles || !item.roles.length) return true;
    return $auth.user?.roles?.some(role => item.roles?.includes(role)) || false;
  }

  // Handle successful login
  function handleLoginSuccess(data: any) {
    loginPopup.close();
    if ($loginPopup.redirectPath) {
      goto($loginPopup.redirectPath);
    }
  }
</script>

<nav class="navigation-bar" class:mobile-open={isMobileMenuOpen}>
  <!-- Mobile Toggle -->
  <button
    class="mobile-toggle"
    onclick={toggleMobileMenu}
    aria-label="Toggle navigation menu"
    aria-expanded={isMobileMenuOpen}
  >
    <span class="material-icons-outlined">
      {isMobileMenuOpen ? 'close' : 'menu'}
    </span>
  </button>

  <!-- Context Switcher -->
  <div class="context-switcher">
    <button
      class="context-button round"
      onclick={toggleContextMenu}
      aria-label="Switch context"
      aria-expanded={isContextMenuOpen}
      aria-haspopup="true"
    >
      <span class="material-icons-outlined icon" aria-hidden="true">
        {currentCtx ? contextConfigs[currentCtx]?.icon || 'apps' : 'apps'}
      </span>
    </button>

    {#if isContextMenuOpen}
      <div
        class="context-menu"
        role="menu"
        tabindex="-1"
        transition:slide={{duration: 150}}
        use:clickOutside={() => handleClickOutside('context')}
        use:trapFocus
      >
        {#each Object.entries(contextConfigs) as [id, config]}
          <button
            class="menu-item"
            onclick={() => handleContextSwitch(id as ContextType)}
            role="menuitem"
          >
            <span class="material-icons-outlined icon" aria-hidden="true">
              {(config as NavigationConfig).icon}
            </span>
            <span class="label">{(config as NavigationConfig).label}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Main Navigation -->
  <div class="main-nav" class:mobile-open={isMobileMenuOpen}>
    {#each mainNav as item}
      {#if item.subItems}
        <div class="nav-group">
          <button
            class="nav-item"
            onclick={() => toggleSubmenu(item.path)}
            aria-expanded={activeSubmenu === item.path}
            aria-haspopup="true"
            disabled={requiresAuth(item) && !$auth.isAuthenticated}
          >
            <span class="material-icons-outlined icon" aria-hidden="true">
              {item.icon}
            </span>
            <span class="label">{item.label}</span>
            <span class="material-icons-outlined" aria-hidden="true">
              {activeSubmenu === item.path ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {#if activeSubmenu === item.path}
            <div class="submenu" transition:slide={{duration: 150}}>
              {#each item.subItems as subItem}
                {#if hasRequiredRoles(subItem)}
                  <button
                    class="submenu-item"
                    onclick={() => handleNavigation(subItem.path, requiresAuth(subItem))}
                    aria-current={pathname === subItem.path}
                    disabled={requiresAuth(subItem) && !$auth.isAuthenticated}
                  >
                    <span class="material-icons-outlined icon" aria-hidden="true">
                      {subItem.icon}
                    </span>
                    <span class="label">{subItem.label}</span>
                  </button>
                {/if}
              {/each}
            </div>
          {/if}
        </div>
      {:else}
        {#if hasRequiredRoles(item)}
          <button
            class="nav-item"
            onclick={() => handleNavigation(item.path, requiresAuth(item))}
            aria-current={pathname === item.path}
            disabled={requiresAuth(item) && !$auth.isAuthenticated}
          >
            <span class="material-icons-outlined icon" aria-hidden="true">
              {item.icon}
            </span>
            <span class="label">{item.label}</span>
          </button>
        {/if}
      {/if}
    {/each}
  </div>

  <!-- User Menu -->
  {#if userNav}
    <div class="user-menu">
      <button
        class="user-button"
        onclick={toggleUserMenu}
        aria-label="User menu"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="true"
      >
        <span class="material-icons-outlined icon" aria-hidden="true">
          {$auth.isAuthenticated ? 'account_circle' : 'person_outline'}
        </span>
      </button>

      {#if isUserMenuOpen}
        <div
          class="menu"
          role="menu"
          tabindex="-1"
          transition:slide={{duration: 150}}
          use:clickOutside={() => handleClickOutside('user')}
          use:trapFocus
        >
          {#each userNav.top as item}
            <button
              class="menu-item"
              onclick={() => item.onClick ? item.onClick() : handleNavigation(item.path, requiresAuth(item))}
              role="menuitem"
              disabled={requiresAuth(item) && !$auth.isAuthenticated}
            >
              <span class="material-icons-outlined icon" aria-hidden="true">
                {item.icon}
              </span>
              <span class="label">{item.label}</span>
            </button>
          {/each}

          {#if userNav.bottom.length}
            <div class="divider"></div>
            {#each userNav.bottom as item}
              <button
                class="menu-item"
                onclick={() => item.onClick ? item.onClick() : handleNavigation(item.path, requiresAuth(item))}
                role="menuitem"
              >
                <span class="material-icons-outlined icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span class="label">{item.label}</span>
              </button>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</nav>

{#if $loginPopup.isOpen}
  <LoginPopup
    show={true}
    onsuccess={handleLoginSuccess}
    onclose={() => loginPopup.close()}
  />
{/if}

<style lang="scss">
  .navigation-bar {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
    width: 100%;
    height: var(--nav-height, 60px);
    background: var(--surface-1);
    border-bottom: 1px solid var(--border);
  }

  .mobile-toggle {
    display: none;
  }

  .context-switcher {
    position: relative;
  }

  .context-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    background: none;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: background-color 0.2s;
  }

  .context-button:hover {
    background: var(--surface-2);
  }

  .context-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 100;
  }

  .main-nav {
    flex: 1;
    display: flex;
    gap: var(--spacing-md);
  }

  .nav-group {
    position: relative;
  }

  .nav-item,
  .submenu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    background: none;
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: background-color 0.2s;
    white-space: nowrap;
  }

  .nav-item:hover,
  .submenu-item:hover {
    background: var(--surface-2);
  }

  .submenu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 100;
  }

  .user-menu {
    position: relative;
  }

  .user-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .user-button:hover {
    background: var(--surface-2);
  }

  .menu {
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 200px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 100;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border: none;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .menu-item:hover {
    background: var(--surface-2);
  }

  .divider {
    height: 1px;
    background: var(--border);
    margin: var(--spacing-xs) 0;
  }

  .icon {
    font-size: 1.5rem;
    opacity: 0.8;
  }

  .label {
    font-size: 0.9rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .mobile-toggle {
      display: block;
    }

    .main-nav {
      display: none;
    }

    .main-nav.mobile-open {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: var(--nav-height, 60px);
      left: 0;
      right: 0;
      background: var(--surface-1);
      border-bottom: 1px solid var(--border);
      padding: var(--spacing-md);
    }
  }

  .context-button.round {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--surface-variant);
    border: 2px solid var(--primary);
    transition: all 0.2s ease;
  }

  .context-button.round:hover {
    background: var(--primary-container);
    transform: scale(1.05);
  }

  .context-button.round .icon {
    font-size: 24px;
    margin: 0;
  }

  .context-button.round + .context-menu {
    margin-top: 8px;
    margin-left: -100px;
  }
</style>


Here is the idea for  the New MainNavigation.svelte..

import { state, effect, action } from 'svelte';
import { spring, tweened } from 'svelte/motion';
import * as d3 from 'd3';
import { onMount } from 'svelte';

// State Management
const selectedCategory = state(null);
const rotationAngleTop = spring(0, { prefersReducedMotion: 0.1, damping: 0.3 });
const rotationAngleBottom = spring(0, { stiffness: 0.1, damping: 0.3 });
const frostIntensity = tweened(0, { duration: 500 });
const darkMode = state(false);

// Define Menu Structure
const categories = [
  { name: 'Home', icon: '🏠', sub: ['Overview', 'Updates', 'News'] },
  { name: 'Services', icon: '🛠️', sub: ['Consulting', 'Support', 'Training'] },
  { name: 'About', icon: 'ℹ️', sub: ['Team', 'History', 'Careers'] },
  { name: 'Contact', icon: '📞', sub: ['Email', 'Phone', 'Locations'] }
];
const visibleCategories = state(categories);

// Action: Rotate Discs
const rotateDisc = action((node, angle) => {
  d3.select(node)
    .transition()
    .duration(500)
    .ease(d3.easeCubicInOut)
    .attr('transform', `rotate(${angle})`);
});

// Effect: Update Rotation with directional constraints
effect(() => {
  if (selectedCategory.value) {
    let index = categories.findIndex(c => c.name === selectedCategory.value);
    rotationAngleTop.set(index * -45); // Top disc rotates left only
    rotationAngleBottom.set(index * 30); // Bottom disc rotates right only
    frostIntensity.set(index * 5);
  }
});

// UI Component
const Menu = () => {
  return (
    <div class={`nav-container ${darkMode.value ? 'dark-mode' : ''}`}>
      <button class="dark-mode-toggle" on:click={() => darkMode.set(!darkMode.value)}>
        {darkMode.value ? '🌙' : '☀️'}
      </button>
      <svg class="menu-svg" viewBox="0 0 400 400">
        <g class="top-disc" use:rotateDisc={rotationAngleTop}>
          {visibleCategories.value.map((cat, i) => (
            <text key={i} x={200} y={50 + i * 30} class="menu-item" on:click={() => selectedCategory.set(cat.name)}>
              {cat.icon} {cat.name}
            </text>
          ))}
        </g>
        <g class="bottom-disc" use:rotateDisc={rotationAngleBottom}>
          {selectedCategory.value && categories.find(c => c.name === selectedCategory.value).sub.map((subItem, i) => (
            <text key={i} x={200} y={200 + i * 30} class="submenu-item">
              {subItem}
            </text>
          ))}
        </g>
      </svg>
      <div class="glass-pane" style={{ filter: `blur(${frostIntensity.value}px)`, opacity: 0.8 }}></div>
    </div>
  );
};

export default Menu;