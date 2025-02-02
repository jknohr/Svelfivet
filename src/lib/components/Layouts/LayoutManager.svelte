<script lang="ts">
  import { layoutConfig } from '$lib/components/Vistas/navigation';
  import type { ContextType } from '$lib/types/context';
  import HeaderLayout from './Header/HeaderLayout.svelte';
  import BaseLayout from './Body/BaseLayout.svelte';
  import LayoutFooter from './Footer/LayoutFooter.svelte';
  import { currentContext } from '$lib/stores/context';

  // Update type definition to include all required properties
  interface BaseLayoutProps {
    showNav: boolean;
    showLeftSidebar: boolean;
    showRightSidebar: boolean;
    showFooter: boolean;
    leftSidebarWidth: string;
    rightSidebarWidth: string;
    mainContentWidth: string;
    showMap: boolean;
    showFilters: boolean;
    pageTitle: string;
    pageDescription: string;
    preContent: () => void;
    mainContent: () => void;
    postContent: () => void;
    leftSidebar: () => void;
    rightSidebar: () => void;
    map: () => void;
    filters: () => void;
  }

  // Update footerProps type
  interface FooterProps {
    agents: unknown[];
    initialAgent: string;
    voiceEnabled: boolean;
    autoConnect: boolean;
    onmessage: (msg: unknown) => void;
    onerror: (err: unknown) => void;
  }

  // Map contexts to their layout components
  let contextLayouts = $state<Partial<Record<ContextType, typeof BaseLayout>>>({});

  // Default layout props
  let layoutProps = $state<BaseLayoutProps>({
    showNav: true,
    showLeftSidebar: true,
    showRightSidebar: true,
    showFooter: true,
    leftSidebarWidth: '2.5%',
    rightSidebarWidth: '2.5%',
    mainContentWidth: '50%',
    showMap: false,
    showFilters: false,
    pageTitle: 'Context-Aware Platform',
    pageDescription: 'Dynamic context-switching platform',
    preContent: () => undefined,
    mainContent: () => undefined,
    postContent: () => undefined,
    leftSidebar: () => undefined,
    rightSidebar: () => undefined,
    map: () => undefined,
    filters: () => undefined
  });

  // Add footer configuration
  let footerProps = $state<FooterProps>({
    agents: [],
    initialAgent: 'default',
    voiceEnabled: true,
    autoConnect: true,
    onmessage: (msg) => console.log('Message:', msg),
    onerror: (err) => console.error('Error:', err),
    // ...other event handlers
  });

  // Current layout component
  let ContextLayout = $state<typeof BaseLayout>(BaseLayout);

  // Dynamic import function for context layouts
  async function importContextLayout(ContextType: ContextType): Promise<typeof BaseLayout> {
    try {
      const module = await import(`../../../../../routes/${ContextType}/+layout.svelte`);
      return module.default;
    } catch (error) {
      console.warn(`Failed to load layout for context ${ContextType}, using BaseLayout`, error);
      return BaseLayout;
    }
  }

  // Load context layout when context changes
  $effect(() => {
    if ($currentContext?.current) {
      const cached = contextLayouts[$currentContext.current];
      if (cached) {
        ContextLayout = cached;
      } else {
        importContextLayout($currentContext.current).then(layout => {
          contextLayouts = {
            ...contextLayouts,
            [$currentContext.current]: layout
          };
          ContextLayout = layout;
        });
      }
    }
  });
</script>

<div class="layout-container">
  <HeaderLayout />
  
  {#key $currentContext?.current}
    <ContextLayout {...layoutProps} />
  {/key}
  
  <LayoutFooter {...footerProps} />
</div>

<style>
  .layout-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  :global(.pre-content),
  :global(.main-content),
  :global(.post-content),
  :global(.left-sidebar),
  :global(.right-sidebar),
  :global(.map-container) {
    width: 100%;
    height: 100%;
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
