<svelte:options runes={true} />

<script lang="ts">
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import type { LayoutAccessibility } from '../../types';
  import { defaultAccessibility } from '../../types';

  // Props
  // Props in Svelte 5.0 are declared using $props rune
  let { 
    controls = [], 
    accessibility = defaultAccessibility,
    title = 'Controls',
    icon = '⚙️'
  } = $props<{
    controls?: Control[];
    accessibility?: LayoutAccessibility;
    title?: string;
    icon?: string;
  }>();

  type Control = {
    id: string;
    type: 'toggle' | 'select' | 'range' | 'text';
    label: string;
    value: string | boolean | number;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    icon?: string;
  };

  // State
  // In Svelte 5.0, $state creates a reactive variable
  // When using with objects/arrays, it creates a deeply reactive proxy
  // This means changes to nested properties will trigger reactivity
  let activeControls = $state<Record<string, Control['value']>>({});

  // Initialize activeControls from props
  // $effect in Svelte 5.0 is used for side effects
  // It automatically tracks dependencies and re-runs when they change
  // Here it initializes activeControls whenever the controls prop changes
  $effect(() => {
    controls.forEach((control: Control) => {
      activeControls[control.id] = control.value;
    });
  });

  // Methods
  // In Svelte 5.0, event handlers are now just onclick, onchange, etc. (no colons)
  // TypeScript requires proper event typing and target assertions
  function handleControlChange(control: Control, value: Control['value']) {
    activeControls[control.id] = value;
  }
</script>

<UIScalingLayout>
  <GlassPane
    class="control-panel"
    role={accessibility.aria.role}
    aria-label={accessibility.aria.label}
  >
    <header class="panel-header">
      <span class="icon" aria-hidden="true">{icon}</span>
      <h2 class="title">{title}</h2>
    </header>

    <div class="controls-container">
      {#each controls as control (control.id)}
        <div class="control-item">
          <label 
            class="control-label" 
            for={control.id}
          >
            {#if control.icon}
              <span class="control-icon" aria-hidden="true">
                {control.icon}
              </span>
            {/if}
            {control.label}
          </label>

          {#if control.type === 'toggle'}
            <button
              type="button"
              class="toggle-button"
              class:active={activeControls[control.id]}
              onclick={(event: MouseEvent) => handleControlChange(control, !activeControls[control.id])}
              aria-pressed={Boolean(activeControls[control.id])}
            >
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
              <span class="sr-only">
                {activeControls[control.id] ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          {:else if control.type === 'select'}
            <select
              id={control.id}
              class="select-input"
              value={activeControls[control.id]}
              onchange={(event: Event) => {
                const target = event.target as HTMLSelectElement;
                handleControlChange(control, target.value);
              }}
            >
              {#each control.options || [] as option}
                <option value={option}>{option}</option>
              {/each}
            </select>
          {:else if control.type === 'range'}
            <input
              type="range"
              id={control.id}
              class="range-input"
              min={control.min}
              max={control.max}
              step={control.step}
              value={activeControls[control.id]}
              oninput={(event: Event) => {
                const target = event.target as HTMLInputElement;
                handleControlChange(control, Number(target.value));
              }}
            />
          {:else if control.type === 'text'}
            <input
              type="text"
              id={control.id}
              class="text-input"
              value={activeControls[control.id]}
              oninput={(event: Event) => {
                const target = event.target as HTMLInputElement;
                handleControlChange(control, target.value);
              }}
            />
          {/if}
        </div>
      {/each}
    </div>
  </GlassPane>
</UIScalingLayout>

<style>
  :global(.control-panel) {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface-background);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--surface-glass);
    border-bottom: 1px solid var(--border-color);
  }

  .icon {
    font-size: 1.2em;
  }

  .title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin: 0;
  }

  .controls-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .control-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
  }

  .control-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }

  .control-icon {
    font-size: 1.1em;
    color: var(--text-secondary);
  }

  /* Toggle button styles */
  .toggle-button {
    position: relative;
    width: 3.5rem;
    height: 2rem;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .toggle-track {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--surface-glass);
    border-radius: var(--radius-full);
    transition: background var(--transition-duration) var(--transition-timing);
  }

  .toggle-thumb {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--text-secondary);
    border-radius: 50%;
    transition: transform var(--transition-duration) var(--transition-timing),
                background var(--transition-duration) var(--transition-timing);
  }

  .toggle-button.active .toggle-track {
    background: var(--color-primary);
  }

  .toggle-button.active .toggle-thumb {
    transform: translateX(1.5rem);
    background: white;
  }

  /* Select input styles */
  .select-input {
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--surface-glass);
    color: var(--text-primary);
    font-size: var(--font-size-md);
    cursor: pointer;
  }

  /* Text input styles */
  .text-input {
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--surface-glass);
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }

  /* Range input styles */
  .range-input {
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--surface-glass);
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }

  /* Focus states */
  .toggle-button:focus-visible,
  .select-input:focus-visible,
  .text-input:focus-visible,
  .range-input:focus-visible {
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
  }

  /* Accessibility */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .toggle-track,
    .toggle-thumb {
      transition: none;
    }
  }
</style>
