<script lang="ts">
  import { layoutConfig } from '$lib/components/Vistas/navigation';
  import type { Snippet } from 'svelte';
  import { fly } from 'svelte/transition';
  
  let { 
    content,
    isExpanded = false,
    isLocked = false,
    onToggleExpand = () => {},
    onToggleLock = () => {}
  } = $props<{
    content: Snippet;
    isExpanded?: boolean;
    isLocked?: boolean;
    onToggleExpand?: () => void;
    onToggleLock?: () => void;
  }>();
</script>

<div 
  class="ai-panel"
  class:expanded={isExpanded}
  class:locked={isLocked}
  transition:fly={{x: -20, duration: 300}}
>
  <div class="panel-header">
    <button 
      class="expand-button"
      on:click={onToggleExpand}
      aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
    >
      <span class="icon">{isExpanded ? '←' : '→'}</span>
    </button>
    
    <button 
      class="lock-button"
      on:click={onToggleLock}
      aria-label={isLocked ? 'Unlock panel' : 'Lock panel'}
    >
      <span class="icon">{isLocked ? '🔒' : '🔓'}</span>
    </button>
  </div>

  <div class="panel-content">
    {@render content()}
  </div>
</div>

<style>
  .ai-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface);
    border-radius: var(--radius-lg);
    transition: all 0.3s ease;
  }

  .panel-header {
    display: flex;
    justify-content: flex-end;
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .panel-content {
    flex: 1;
    overflow: auto;
    padding: var(--spacing-md);
  }

  .expand-button,
  .lock-button {
    padding: var(--spacing-xs);
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .expand-button:hover,
  .lock-button:hover {
    opacity: 1;
  }

  .ai-panel.expanded {
    box-shadow: var(--shadow-lg);
  }

  .ai-panel.locked {
    border: 2px solid var(--primary);
  }

  .icon {
    font-size: 1.2em;
  }
</style>
