<!-- /src/lib/components/Tag.svelte -->
<!--
@component Tag
A styled tag component with customizable color, removable functionality, and theme integration.
Features:
- Customizable color
- Removable tags
- Theme integration for styling
- Accessibility support with ARIA attributes
-->

<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import { createElementRunes } from '$lib/components/Theme/ThemeElements';
  import type { TagProps } from './Tag.types';

  // Props
  let props = $props<TagProps>();
  let {
    label,
    color = 'primary',
    removable = false,
    onRemove
  } = props;

  // Theme context
  const themeContext = getContext<UnifiedThemeContext>('theme');

  // State
  let isHovered = $state(false);

  // Element runes
  const element = createElementRunes('tag' as const);
  const elementState = element.state.create();

  // Derived classes
  const tagClasses = $derived(() => ({
    'tag': true,
    'tag-primary': color === 'primary',
    'tag-secondary': color === 'secondary',
    'tag-success': color === 'success',
    'tag-error': color === 'error',
    'tag-warning': color === 'warning',
    'tag-hovered': isHovered
  }));

  // Handle remove
  function handleRemove() {
    onRemove?.();
  }

  // Handle mouse enter
  function handleMouseEnter() {
    isHovered = true;
  }

  // Handle mouse leave
  function handleMouseLeave() {
    isHovered = false;
  }
</script>

<div
  class={tagClasses}
  use:element.effects.setupInteractions
  use:element.effects.setupAccessibility
  use:element.effects.setupGestures
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
>
  <span class="tag-label">{label}</span>
  {#if removable}
    <button
      class="tag-remove-button"
      aria-label="Remove tag"
      onclick={handleRemove}
    >
      <Typography isIcon size="sm">
        close
      </Typography>
    </button>
  {/if}
</div>

<style>
  .tag {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    background-color: var(--color-primary-light);
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: default;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  .tag-primary {
    background-color: var(--color-primary-light);
    color: var(--color-primary);
  }

  .tag-secondary {
    background-color: var(--color-secondary-light);
    color: var(--color-secondary);
  }

  .tag-success {
    background-color: var(--color-success-light);
    color: var(--color-success);
  }

  .tag-error {
    background-color: var(--color-error-light);
    color: var(--color-error);
  }

  .tag-warning {
    background-color: var(--color-warning-light);
    color: var(--color-warning);
  }

  .tag-hovered {
    background-color: var(--color-primary-lighter);
    color: var(--color-primary);
  }

  .tag-remove-button {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: var(--color-text-light);
    transition: color var(--transition-normal) var(--ease-standard);
  }

  .tag-remove-button:hover {
    color: var(--color-text);
  }
</style>