<script lang="ts">
  import { contextStore } from '$lib/components/Templates/Canvas/stores/context';
  import Button from '$lib/components/Atoms/Button/Buttong.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import { slide } from 'svelte/transition';
  import type { ContextConfig } from '$lib/types/context';

  export let isOpen = false;
  export let position: 'left' | 'right' = 'left';
  export let width = '280px';

  function handleContextSelect(context: ContextConfig) {
    contextStore.setActive(context);
    isOpen = false;
  }

  function handleClose() {
    isOpen = false;
  }
</script>

{#if isOpen}
<div 
  class="vista-menu"
  class:left={position === 'left'}
  class:right={position === 'right'}
  style="width: {width}"
  transition:slide={{ duration: 200 }}
>
  <div class="menu-header">
    <Typography>Switch Context</Typography>
    <Button 
      onclick={handleClose}
      aria-label="Close menu"
    >
      <span class="material-icons">close</span>
    </Button>
  </div>

  <div class="menu-content" role="menu">
    {#each $contextStore.items as context (context.id)}
      <Button
        onclick={() => handleContextSelect(context)}
        class="menu-item"
        role="menuitem"
        data-active={$contextStore.active?.id === context.id}
      >
        <div class="menu-item-content">
          <span class="material-icons icon">{context.icon}</span>
          <div class="text-content">
            <Typography>{context.label}</Typography>
            <Typography class="description">{context.description}</Typography>
          </div>
        </div>
      </Button>
    {/each}
  </div>
</div>
{/if}

<style>
  .vista-menu {
    position: fixed;
    top: 0;
    height: 100vh;
    z-index: var(--layer-menu);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    padding: var(--spacing-4);
    background: var(--surface-1);
    backdrop-filter: blur(8px);
  }

  .vista-menu.left {
    left: 0;
  }

  .vista-menu.right {
    right: 0;
  }

  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--spacing-2);
    border-bottom: 1px solid var(--border);
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    overflow-y: auto;
  }

  .menu-item {
    width: 100%;
    padding: var(--spacing-3);
    text-align: left;
  }

  .menu-item[data-active="true"] {
    background: var(--surface-2);
  }

  .menu-item-content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--spacing-3);
    align-items: center;
  }

  .icon {
    font-size: 1.5rem;
    color: var(--text-2);
  }

  .text-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);
  }

  .description {
    color: var(--text-2);
  }
</style> 