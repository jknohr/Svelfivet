<!-- src/lib/components/NavigationLogic.svelte -->
<script lang="ts">
  import { currentContext } from '$lib/stores/context';
  import { contextConfigs } from '$lib/components/Vistas/navigation';
  import type { ContextType } from '$lib/types/context';
  import type { NavigationItem, Category } from './types';

  // Define proper function types
  type NavigateFunction = (path: string) => void;
  type NavigationChangeFunction = (items: NavigationItem[]) => void;
  type SubmenuChangeFunction = (submenu: string | null) => void;

  // Props with proper types
  let { 
    onNavigate,
    onNavigationChange,
    categories = [],
    isContextMenuOpen = false,
    isUserMenuOpen = false,
    isMobileMenuOpen = false,
    activeSubmenu = null,
    oncontextmenu = () => {},
    onusermenu = () => {},
    onmobilemenu = () => {},
    onsubmenuchange = (submenu: string | null) => {},
    onclickoutside = (event: MouseEvent) => {}
  } = $props<{
    onNavigate?: NavigateFunction;
    onNavigationChange?: NavigationChangeFunction;
    categories?: Category[];
    isContextMenuOpen?: boolean;
    isUserMenuOpen?: boolean;
    isMobileMenuOpen?: boolean;
    activeSubmenu?: string | null;
    oncontextmenu?: () => void;
    onusermenu?: () => void;
    onmobilemenu?: () => void;
    onsubmenuchange?: SubmenuChangeFunction;
    onclickoutside?: (event: MouseEvent) => void;
  }>();

  // State declarations
  let currentCtx = $state<ContextType>('real-estate');
  let navigationItems = $state<NavigationItem[]>([]);

  // Effect to handle context changes
  $effect(() => {
    const contextValue = $currentContext.current;
    if (contextValue && contextConfigs[contextValue]) {
      currentCtx = contextValue;
      const config = contextConfigs[currentCtx];
      navigationItems = config.navigation.main || [];
      onNavigationChange?.(navigationItems);
    }
  });

  // Navigation handlers
  function handleNavigation(path: string) {
    onNavigate?.(path);
  }

  // Export the navigation items for the parent component
  let currentNavigation = $derived(() => {
    const config = contextConfigs[currentCtx];
    return config?.navigation.main || [];
  });
</script>
