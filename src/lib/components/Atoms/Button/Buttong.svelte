<!--
@component Button
A versatile button component with glass morphism effects.
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    variant?: 'text' | 'outlined' | 'contained';
    glassEffect?: GlassEffect;
    glassState?: GlassState;
    ariaLabel?: string;
    ariaDescribedby?: string;
    tabindex?: number;
    disabled?: boolean;
    content?: Snippet;
    class?: string;
    role?: string;
    'aria-label'?: string;
    'data-active'?: boolean;
  }

  let props = $props();
  let { 
    variant = 'contained',
    glassEffect = 'light',
    glassState = 'default',
    ariaLabel,
    ariaDescribedby,
    tabindex = 0,
    disabled = false,
    content,
    class: className,
    role,
    'aria-label': ariaLabelOverride,
    'data-active': active
  } = props;

  // Map button variant to glass effect
  $effect(() => {
    switch (variant) {
      case 'text':
        glassEffect = 'light';
        break;
      case 'outlined':
        glassEffect = 'medium';
        break;
      case 'contained':
        glassEffect = 'heavy';
        break;
    }
  });
</script>

<button 
  class={className}
  {role}
  aria-label={ariaLabel}
  data-active={active}
  on:click
>
  <slot />
</button>

<style>
  .button-content {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--text-sm);
    font-weight: 500;
    width: 100%;
    height: 100%;
  }

  .text {
    color: var(--text-1);
  }

  .outlined {
    color: var(--text-1);
  }

  .contained {
    color: var(--text-on-accent);
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2) var(--spacing-4);
    border: none;
    border-radius: var(--radius-2);
    background: transparent;
    color: var(--text-1);
    cursor: pointer;
    font: inherit;
    transition: all 0.2s ease;
  }

  button:hover {
    background: var(--surface-2);
  }

  button:active {
    background: var(--surface-3);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--brand);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style> 
