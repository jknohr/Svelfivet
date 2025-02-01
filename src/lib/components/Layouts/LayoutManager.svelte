<script lang="ts">
  import { layoutConfig, navigationAccess } from '$lib/config/navigation/navigation';
  import type { ContextType } from '$lib/types/context';
  import type { BaseLayoutProps, LayoutComponent } from '$lib/types/components/layout';
  import type { LayoutMode } from '$lib/types/components/layout';
  import BaseLayout from './BaseLayout.svelte';
  import { currentContext } from '$lib/components/Templates/Canvas/stores/context';

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

{#key $currentContext?.current}
  <ContextLayout {...layoutProps} />
{/key}

<style>
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
