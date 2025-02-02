<script lang="ts">
  import { layoutConfig } from '$lib/components/Vistas/navigation';
  import type { Snippet } from 'svelte';
  
  let { 
    content,
    isExpanded = false,
    isLocked = false
  } = $props<{
    content: Snippet;
    isExpanded?: boolean;
    isLocked?: boolean;
  }>();
</script>

<div 
  class="control-panel"
  class:expanded={isExpanded}
  class:locked={isLocked}
>
  <div class="panel-content">
    {@render content()}
  </div>
  
  <div class="panel-controls">
    <slot name="controls" />
  </div>
</div>

<style>
  .control-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface);
    border-radius: var(--radius-lg);
    transition: all 0.3s ease;
  }

  .panel-content {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-md);
  }

  .panel-controls {
    padding: var(--spacing-sm);
    border-top: 1px solid var(--border-color);
  }

  .control-panel.expanded {
    box-shadow: var(--shadow-lg);
  }

  .control-panel.locked {
    border: 2px solid var(--primary);
  }
</style>
