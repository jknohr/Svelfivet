<!--
@component
A tooltip component that provides hover information.
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    content,
    position = 'top',
    children
  } = $props();

  let visible = $state(false);

  $effect(() => {
    if (visible) {
      // Any side effects when tooltip becomes visible
    }
  });
</script>

<div class="tooltip-container">
  <div 
    class="tooltip-trigger"
    tabindex="0"
    role="button"
    onclick={() => visible = !visible}
    onkeydown={(e) => e.key === 'Enter' && (visible = !visible)}
    onmouseenter={() => visible = true}
    onmouseleave={() => visible = false}
  >
    {@render children?.()}
  </div>

  {#if visible}
    <div class="tooltip" data-position={position}>
      {content}
    </div>
  {/if}
</div>

<style>
  .tooltip-container {
    position: relative;
    display: inline-block;
  }

  .tooltip-trigger {
    display: inline-block;
  }

  .tooltip {
    position: absolute;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
    pointer-events: none;
  }

  .tooltip[data-position="top"] {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-0.5rem);
  }

  .tooltip[data-position="bottom"] {
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(0.5rem);
  }

  .tooltip[data-position="left"] {
    right: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(-0.5rem);
  }

  .tooltip[data-position="right"] {
    left: 100%;
    top: 50%;
    transform: translateY(-50%) translateX(0.5rem);
  }
</style> 
