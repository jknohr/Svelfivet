<script lang="ts">
  export { default } from './LayoutManager.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { layoutConfig, vistaConfigs } from '$lib/components/Vistas/navigation';
  import type { VistaType, LayoutProps } from '$lib/types/vista';
  import type { Snippet } from 'svelte';
  import HeaderLayout from './Header/HeaderLayout.svelte';
  import BaseLayout from './Body/BaseBodyLayout.svelte';
  import LayoutFooter from './Footer/LayoutFooter.svelte';
  import { currentVista } from '$lib/stores/vista';
  import ThemeProvider from '$lib/components/Theme/ThemeProvider.svelte';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import BaseContentLayout from './Body/Content/BaseContentLayout.svelte';
  import { auth } from '$lib/stores/auth';

  // Define props using $props
  let { 
    layoutChange = (event: CustomEvent<{ type: string; dimension: string }>) => {},
    vistaSwitch = (event: CustomEvent<{ from: VistaType | null; to: VistaType }>) => {},
    themeChange = (event: CustomEvent<{ mode: 'light' | 'dark' | 'system' }>) => {},
    children
  } = $props<{
    layoutChange?: (event: CustomEvent<{ type: string; dimension: string }>) => void;
    vistaSwitch?: (event: CustomEvent<{ from: VistaType | null; to: VistaType }>) => void;
    themeChange?: (event: CustomEvent<{ mode: 'light' | 'dark' | 'system' }>) => void;
    children?: any;
  }>();

  // Base accessibility requirements
  interface LayoutAccessibility {
    aria: {
      role: 'main' | 'navigation' | 'complementary' | 'banner' | 'contentinfo';
      label: string;
      description?: string;
      keyboardShortcuts?: string[];
    };
    keyboard: {
      focusable: boolean;
      tabIndex?: number;
      shortcuts?: Record<string, () => void>;
    };
  }

  // Vista layouts cache
  const vistaLayouts: Record<string, any> = $state({});

  // Content layout component
  let ContentLayoutComponent = $state<any>(null);

  // Track current layout component
  // let ContentLayoutComponent = $state(null);

  // Navigation state management
  let navigationState = $state({
    previousStates: new Map<string, any>(),
    preloadedContent: new Map<string, any>(),
    currentPath: ''
  });

  // Define layout props using $state
  let defaultLayoutProps = $state<LayoutProps & {
    aria: {
      role: 'main' | 'navigation' | 'complementary' | 'banner' | 'contentinfo';
      label: string;
      description?: string;
    },
    keyboard: {
      focusable: boolean;
      tabIndex?: number;
      shortcuts?: Record<string, () => void>;
    },
    mainContent?: Snippet;
  }>({
    showNav: true,
    showLeftSidebar: true,
    showRightSidebar: true,
    showFooter: true,
    showMap: false,
    showFilters: false,
    pageTitle: '',
    dimensions: {
      headerHeight: '60px',
      footerHeight: '60px',
      leftSidebarWidth: '250px',
      rightSidebarWidth: '250px',
      mainContentWidth: 'auto',
      expandedHeaderHeight: '120px',
      expandedSidebarWidth: '300px'
    },
    aria: {
      role: 'main',
      label: 'Main content',
      description: 'Main content area'
    },
    keyboard: {
      focusable: true,
      tabIndex: 0,
      shortcuts: {}
    },
    mainContent: undefined
  });

  // Helper functions for navigation state management
  function collectPageState() {
    // Collect form data and other stateful elements
    const forms = document.querySelectorAll('form');
    const formData = new Map();
    
    forms.forEach((form, index) => {
      const elements = form.elements;
      const data: Record<string, any> = {};
      
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLInputElement;
        if (element.name) {
          data[element.name] = element.value;
        }
      }
      
      formData.set(`form-${index}`, data);
    });

    return {
      forms: formData,
      scroll: window.scrollY
    };
  }

  async function preloadContent(path: string): Promise<any> {
    // Initialize with a default state
    let authState: { isAuthenticated: boolean; user: { id: string; roles: string[]; } | null } = { 
      isAuthenticated: false, 
      user: null 
    };
    
    // Get the current auth state synchronously
    const unsubscribe = auth.subscribe(state => {
      authState = state;
    });
    
    // Cleanup subscription
    unsubscribe();

    // Check if user is authenticated
    if (!authState.isAuthenticated) {
      throw new Error('Authentication required');
    }

    // Get the vista type from the path
    const vistaType = path.split('/')[1] || 'default';

    // Get the vista configuration
    const vistaConfig = vistaConfigs[vistaType as keyof typeof vistaConfigs];
    
    // Find the navigation item for this path
    const findNavItem = (items: any[]): any => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.subItems) {
          const found = findNavItem(item.subItems);
          if (found) return found;
        }
      }
      return null;
    };

    const navItem = vistaConfig ? findNavItem(vistaConfig.navigation.items) : null;

    // Check if the path is previewable
    if (!navItem?.metadata?.preview) {
      throw new Error('Content preview not available for this path');
    }

    // Check if user has required roles for this vista
    if (vistaType !== 'public' && (!authState.user || !authState.user.roles.includes(vistaType))) {
      throw new Error('Unauthorized: Insufficient permissions');
    }

    try {
      // Implement your content preloading logic here
      // This could fetch data from an API, load components, etc.
      const response = await new Promise((resolve) => {
        // Simulate content preloading
        setTimeout(() => {
          resolve({
            path,
            timestamp: Date.now(),
            authorized: true,
            preview: true
          });
        }, 100);
      });

      return response;
    } catch (error) {
      console.error('Error preloading content:', error);
      throw error;
    }
  }

  function renderContent(content: any) {
    // Implement your content rendering logic here
    console.log('Rendering content:', content);
  }

  async function loadContent(path: string): Promise<any> {
    // Implement your content loading logic here
    return preloadContent(path);
  }

  // Navigation event handlers
  onMount(() => {
    // Initialize current path
    navigationState.currentPath = window.location.pathname;

    // Restore state if available
    const previousState = navigationState.previousStates.get(navigationState.currentPath);
    if (previousState) {
      window.scrollTo(0, previousState.scroll);
      // Implement state restoration logic
    }
  });

  $effect(() => {
    // Watch for navigation state changes
    const currentPath = navigationState.currentPath;
    if (currentPath && defaultLayoutProps.mainContent) {
      defaultLayoutProps.mainContent();
    }
  });

  // Dynamic import function for vista layouts
  async function importVistaLayout(vistaType: string) {
    try {
      const module = await import(`$lib/vistas/${vistaType}/BodyLayout.ts`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load vista ${vistaType}, using BaseLayout`, error);
      return BaseLayout;
    }
  }

  let previousVista: string | null = null;

  $effect(() => {
    const currentVistaValue = $currentVista;
    if (currentVistaValue && typeof currentVistaValue === 'string') {
      const cached = vistaLayouts[currentVistaValue];
      if (cached) {
        ContentLayoutComponent = cached;
      } else {
        importVistaLayout(currentVistaValue).then(layout => {
            vistaLayouts[currentVistaValue] = layout;
            ContentLayoutComponent = layout;
        });
      }

      // Dispatch vista switch event
      if (previousVista !== currentVistaValue) {
        vistaSwitch(new CustomEvent('vistaSwitch', { 
          detail: { 
            from: previousVista || undefined, 
            to: currentVistaValue 
          } 
        }));
        previousVista = currentVistaValue;
      }
    }
  });

  // Handle keyboard shortcuts
  function handleKeydown(event: KeyboardEvent) {
    const shortcut = `${event.altKey ? 'Alt+' : ''}${event.key}`;
    const handler = defaultLayoutProps.keyboard?.shortcuts?.[shortcut];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }
</script>

{#if ContentLayoutComponent}
  <div 
    role={defaultLayoutProps.aria.role}
    aria-label={defaultLayoutProps.aria.label}
    aria-describedby={defaultLayoutProps.aria.description}
  >
    {#key ContentLayoutComponent}
      <ContentLayoutComponent />
    {/key}
  </div>
{/if}

{#if defaultLayoutProps.showLeftSidebar && defaultLayoutProps.leftSidebar}
  <div 
    role="complementary"
    aria-label="Left sidebar"
  >
    {#if defaultLayoutProps.leftSidebar && typeof defaultLayoutProps.leftSidebar === 'function'}
      {@const result = defaultLayoutProps.leftSidebar()}
      {#if result instanceof Promise}
        {#await result then resolvedContent}
          <svelte:element this={('div' as string)}>
            {resolvedContent}
          </svelte:element>
        {/await}
      {:else}
        <svelte:element this={('div' as string)}>
          {result}
        </svelte:element>
      {/if}
    {/if}
  </div>
{/if}

{#if defaultLayoutProps.showRightSidebar && defaultLayoutProps.rightSidebar}
  <div 
    role="complementary"
    aria-label="Right sidebar"
  >
    {#if defaultLayoutProps.rightSidebar && typeof defaultLayoutProps.rightSidebar === 'function'}
      {@const result = defaultLayoutProps.rightSidebar()}
      {#if result instanceof Promise}
        {#await result then resolvedContent}
          <svelte:element this={('div' as string)}>
            {resolvedContent}
          </svelte:element>
        {/await}
      {:else}
        <svelte:element this={('div' as string)}>
          {result}
        </svelte:element>
      {/if}
    {/if}
  </div>
{/if}

{#if defaultLayoutProps.showFooter}
  <div 
    role="contentinfo"
    aria-label="Footer"
  >
    {#if defaultLayoutProps.footerContent && typeof defaultLayoutProps.footerContent === 'function'}
      {@const result = defaultLayoutProps.footerContent()}
      {#if result instanceof Promise}
        {#await result then resolvedContent}
          <svelte:element this={('div' as string)}>
            {resolvedContent}
          </svelte:element>
        {/await}
      {:else}
        <svelte:element this={('div' as string)}>
          {result}
        </svelte:element>
      {/if}
    {:else}
      <LayoutFooter 
        initialHeight={defaultLayoutProps.dimensions.footerHeight}
        accessibility={{
          aria: defaultLayoutProps.aria,
          keyboard: defaultLayoutProps.keyboard
        }}
        showBreadcrumbs={true}
        showSocialMedia={true}
      />
    {/if}
  </div>
{/if}

{#if defaultLayoutProps.mainContent}
  <div 
    role="main"
    aria-label="Main content"
  >
    {#if defaultLayoutProps.mainContent && typeof defaultLayoutProps.mainContent === 'function'}
      {@const result = defaultLayoutProps.mainContent()}
      {#if result instanceof Promise}
        {#await result then resolvedContent}
          <div>
            {resolvedContent}
          </div>
        {/await}
      {:else}
        <div>
          {result}
        </div>
      {/if}
    {/if}
  </div>
{/if}

<nav>
  <a 
    href="/about" 
    onmouseenter={() => defaultLayoutProps.preContent?.('/about')}
    onclick={() => defaultLayoutProps.postContent?.()}
  >
    About
  </a>
</nav>

<svelte:window onkeydown={handleKeydown} />

<ThemeProvider>
  <UIScalingLayout>
    <div 
      class="layout-container" 
      role={defaultLayoutProps.aria.role}
      aria-label={defaultLayoutProps.aria.label}
      aria-describedby={defaultLayoutProps.aria.description}
    >
      <HeaderLayout />
      
      {#key $currentVista}
        {#if ContentLayoutComponent}
          <div role="main" aria-label="Main content">
            {@render defaultLayoutProps.mainContent?.()}
          </div>
        {/if}
      {/key}
      
      {#if defaultLayoutProps.showLeftSidebar && defaultLayoutProps.leftSidebar}
        {#if defaultLayoutProps.leftSidebar && typeof defaultLayoutProps.leftSidebar === 'function'}
          {@const result = defaultLayoutProps.leftSidebar()}
          {#if result instanceof Promise}
            {#await result then resolvedContent}
              <svelte:element this={('div' as string)}>
                {resolvedContent}
              </svelte:element>
            {/await}
          {:else}
            <svelte:element this={('div' as string)}>
              {result}
            </svelte:element>
          {/if}
        {/if}
      {/if}
      
      {#if defaultLayoutProps.showRightSidebar && defaultLayoutProps.rightSidebar}
        {#if defaultLayoutProps.rightSidebar && typeof defaultLayoutProps.rightSidebar === 'function'}
          {@const result = defaultLayoutProps.rightSidebar()}
          {#if result instanceof Promise}
            {#await result then resolvedContent}
              <svelte:element this={('div' as string)}>
                {resolvedContent}
              </svelte:element>
            {/await}
          {:else}
            <svelte:element this={('div' as string)}>
              {result}
            </svelte:element>
          {/if}
        {/if}
      {/if}
      
      {#if defaultLayoutProps.showFooter}
        <div 
          role="contentinfo"
          aria-label="Footer"
        >
          {#if defaultLayoutProps.footerContent && typeof defaultLayoutProps.footerContent === 'function'}
            {@const result = defaultLayoutProps.footerContent()}
            {#if result instanceof Promise}
              {#await result then resolvedContent}
                <svelte:element this={('div' as string)}>
                  {resolvedContent}
                </svelte:element>
              {/await}
            {:else}
              <svelte:element this={('div' as string)}>
                {result}
              </svelte:element>
            {/if}
          {:else}
            <LayoutFooter 
              initialHeight={defaultLayoutProps.dimensions.footerHeight}
              accessibility={{
                aria: defaultLayoutProps.aria,
                keyboard: {
                  focusable: defaultLayoutProps.keyboard?.focusable ?? true,
                  tabIndex: defaultLayoutProps.keyboard?.tabIndex,
                  shortcuts: defaultLayoutProps.keyboard?.shortcuts ?? {}
                }
              }}
              showBreadcrumbs={true}
              showSocialMedia={true}
            />
          {/if}
        </div>
      {/if}
    </div>
  </UIScalingLayout>
</ThemeProvider>

<style>
  .layout-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  :global(.pre-content),
  :global(.main-content),
  :global(.post-content) {
    width: var(--main-content-width);
    margin: 0 auto;
    transition: width var(--transition-duration) var(--transition-timing);
  }

  :global(.left-sidebar),
  :global(.right-sidebar) {
    position: fixed;
    top: var(--header-height);
    bottom: var(--footer-height);
    width: var(--sidebar-width);
    transition: all var(--transition-duration) var(--transition-timing);
    z-index: var(--z-index-sidebar);
  }

  :global(.left-sidebar) {
    left: 0;
  }

  :global(.right-sidebar) {
    right: 0;
  }

  :global(.map-container) {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: var(--map-width);
    transition: width var(--transition-duration) var(--transition-timing);
  }

  :global(.map-placeholder) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: var(--surface-variant);
    color: var(--text-secondary);
  }
</style>
