<!--
@component Header
Header container that loads the three navigation components:
- VistaMenu (static, 10% width)
- NavigationBar (dynamic based on context)
- UserNavbar (login/user menu, 10% width)
-->
<svelte:options runes={true} />

<script lang="ts">
  import { currentVista } from '$lib/stores/vista';
  import { vistaConfigs } from '$lib/components/Vistas/navigation';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import VistaMenu from '$lib/components/Organisms/NavBars/VistaMenu.svelte';
  import NavigationBar from '$lib/components/Organisms/NavBars/NavigationBar.svelte';
  import UserNavbar from '$lib/components/Organisms/NavBars/UserNavbar.svelte';
  import type { LayoutAccessibility } from '../types';
  import { defaultAccessibility } from '../types';
  import type { Category } from '$lib/components/Organisms/NavBars/Navigation.types';
  import type { NavigationState } from '$lib/components/Organisms/NavBars/Navigation.types';

  // Props using $props rune
  const {
    initialHeight = '7.5%',
    expandedHeight = '15%',
    accessibility = defaultAccessibility,
    categories
  } = $props<{
    initialHeight?: string;
    expandedHeight?: string;
    accessibility?: LayoutAccessibility;
    categories?: Category[];
  }>();

  const vistasMenuWidth = '10%';
  const userMenuWidth = '10%';

  // Get the current vista's navigation items
  const categoriesDerived = $derived(() => {
    if (categories) return categories;
    const vista = $currentVista.current;
    if (!vista) return [];
    const config = vistaConfigs[vista];
    if (!config) return [];
    return config.navigation.items.map(item => ({
      id: item.label.toLowerCase().replace(/\s+/g, '-'),  // Create an id from the label
      name: item.label,
      icon: item.icon,
    }));
  });

  // State using runes
  let headerHeight = $state(initialHeight);

  // Derived values
  let headerStyle = $derived(`
    height: ${headerHeight};
    transition: height var(--transition-duration) var(--transition-timing);
  `);

  // Handle header expansion on hover
  function onHeaderHover() {
    headerHeight = expandedHeight;
  }

  function onHeaderLeave() {
    headerHeight = initialHeight;
  }
</script>

<UIScalingLayout>
  <header 
    class="header-container" 
    style={headerStyle}
    role={accessibility.aria.role}
    onmouseenter={onHeaderHover}
    onmouseleave={onHeaderLeave}
  >
    <GlassPane 
      variant="medium" 
      interactive={true}
    >
      <div class="header-content">
        <div class="vista-menu" style={`width: ${vistasMenuWidth}`}>
          <VistaMenu />
        </div>
        
        <div class="navigation-bar">
          <NavigationBar 
            categories={categoriesDerived()}
            componentWidth="80%"
            config={$currentVista.current ? vistaConfigs[$currentVista.current] : undefined}
            onNavigate={(category: Category) => {
              // Handle navigation
            }}
            onNavigationChange={(state: NavigationState) => {
              // Handle navigation state change
            }}
          />
        </div>
        
        <div class="user-menu" style={`width: ${userMenuWidth}`}>
          <UserNavbar />
        </div>
      </div>
    </GlassPane>
  </header>
</UIScalingLayout>

<style>
  .header-container {
    position: sticky;
    top: 0;
    width: 100%;
    z-index: var(--z-index-header);
    background: var(--background-header);
  }

  .header-content {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .navigation-bar {
    flex: 1;
    height: 100%;
  }

  .vista-menu,
  .user-menu {
    height: 100%;
  }
</style>