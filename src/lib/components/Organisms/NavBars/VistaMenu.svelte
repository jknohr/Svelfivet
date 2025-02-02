<svelte:options runes={true} />

<script lang="ts">
  import { slide } from 'svelte/transition';
  import { contextConfigs } from '$lib/components/Vistas/navigation';
  import type { ContextType } from '$lib/types/context';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';

  // Types
  type VistaInfo = {
    id: ContextType;
    name: string;
    icon: string;
    description: string;
  };

  // Props
  let {
    initialVista = 'real-estate' as ContextType,
    onSelect = ((vista: ContextType): void => {}) as (vista: ContextType) => void
  } = $props();

  // State
  let isOpen = $state(false);
  let isHovered = $state(false);
  let isActive = $state(false);
  let selectedVista = $state<ContextType>(initialVista);

  // Derived state
  let buttonState = $derived(() => {
    if (isActive) return 'active';
    if (isHovered) return 'hover';
    return 'default';
  });

  // Convert contextConfigs to array for rendering
  function computeVistas(): VistaInfo[] {
    return Object.entries(contextConfigs).map(([id, config]): VistaInfo => ({
      id: id as ContextType,
      name: config.label,
      icon: config.icon,
      description: config.description
    }));
  }

  let vistas = $derived(computeVistas());

  // Handle vista selection
  function selectVista(vista: VistaInfo) {
    selectedVista = vista.id;
    isOpen = false;
    onSelect(vista.id);
  }
</script>

<div class="vista-menu">
  <GlassPane
    variant="light"
    state={buttonState}
    glowOnHover={true}
    componentType="button"
  >
    <button 
      class="vista-button"
      onmouseenter={() => isHovered = true}
      onmouseleave={() => isHovered = false}
      onmousedown={() => isActive = true}
      onmouseup={() => isActive = false}
      onclick={() => isOpen = !isOpen}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <span class="material-icons">{contextConfigs[selectedVista].icon}</span>
      <Typography size="base" weight="medium">
        <span class="vista-name">{contextConfigs[selectedVista].label}</span>
      </Typography>
    </button>
  </GlassPane>

  {#if isOpen}
    <div 
      class="vista-dropdown" 
      role="menu" 
      aria-label="Vista selection menu"
      transition:slide={{ duration: 150 }}
    >
      {#each vistas as vista (vista.id)}
        <button
          class="vista-option"
          class:selected={vista.id === selectedVista}
          onclick={() => selectVista(vista)}
          role="menuitem"
          aria-label={vista.description}
        >
          <span class="material-icons">{vista.icon}</span>
          <div class="vista-info">
            <Typography size="base" weight="medium">
              <span class="vista-name">{vista.name}</span>
            </Typography>
            <Typography size="sm" color="muted">
              <span class="vista-description">{vista.description}</span>
            </Typography>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .vista-menu {
    position: relative;
    height: var(--ui-unit);
    min-width: calc(var(--ui-unit) * 4);
  }

  .vista-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--color-text);
    transition: all 0.2s;
    border-radius: var(--radius-md);
  }

  .vista-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    width: 300px;
    background: color-mix(in srgb, var(--color-surface) 95%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--radius-md);
    box-shadow: 
      0 4px 6px color-mix(in srgb, var(--color-shadow) 10%, transparent),
      inset 0 1px 2px color-mix(in srgb, var(--color-highlight) 15%, transparent);
    padding: 0.5rem;
    transform-origin: top left;
    animation: dropdown 0.2s ease-out;
    backdrop-filter: blur(10px);
    z-index: 1000;
  }

  .vista-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 0.75rem;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--color-text);
    transition: all 0.2s;
    border-radius: var(--radius-md);
    text-align: left;
  }

  .vista-option:hover {
    background: color-mix(in srgb, var(--color-primary) 5%, transparent);
    transform: translateX(4px);
  }

  .vista-option.selected {
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    color: var(--color-primary);
  }

  .vista-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  .vista-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vista-description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--color-text-muted);
  }

  .material-icons {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  @keyframes dropdown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Dark mode adjustments */
  :global([data-theme="dark"]) .vista-dropdown {
    background: color-mix(in srgb, var(--color-surface) 97%, transparent);
    box-shadow: 
      0 4px 6px color-mix(in srgb, black 20%, transparent),
      inset 0 1px 2px color-mix(in srgb, white 5%, transparent);
  }

  /* Spatial adjustments */
  @media (--ar) {
    .vista-menu {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-floating));
    }
  }

  @media (--vr) {
    .vista-menu {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }
  }
</style> 