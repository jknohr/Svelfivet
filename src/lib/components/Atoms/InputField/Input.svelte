<!--
@component Input
A modern input component with glass effect styling and theme integration.
Features:
- Glass effect styling with hover and focus states
- Multiple sizes and variants
- Theme system integration
- Full accessibility support
- AR/VR environment support
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { InputProps, InputSize, InputVariant } from './Input.types';
  import { INPUT_SIZES, INPUT_STATES, INPUT_VARIANTS } from './Input.types';
  import GlassPane from '../../Theme/GlassPane.svelte';
  import Typography from '../../Theme/Typography.svelte';

  // Props
  let {
    label,
    value = $bindable(''),
    type = 'text',
    placeholder = '',
    disabled = false,
    size = 'md' as InputSize,
    variant = 'default' as InputVariant,
    state: inputState = 'default',
    glass = true,
    elevated = false,
    required = false,
    ariaLabel,
    onInput,
    onFocus,
    onBlur
  } = $props();

  // Local state
  let isFocused = $state(false);
  let isHovered = $state(false);

  // Derived values for dynamic styling
  let effectiveElevation = $derived.by(() => isFocused ? 2 : isHovered ? 1 : 0);
  
  // Get styles from constants
  let sizeStyles = $derived.by(() => INPUT_SIZES[size as InputSize]);
  let variantStyles = $derived.by(() => INPUT_VARIANTS[variant as InputVariant]);
  
  // Event handlers
  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = target.value;
    onInput?.(target.value);
  }

  function handleFocus() {
    isFocused = true;
    onFocus?.();
  }

  function handleBlur() {
    isFocused = false;
    onBlur?.();
  }

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
  }

  // Generate unique ID for input-label association
  const id = `input-${Math.random().toString(36).slice(2, 11)}`;
</script>

{#snippet labelContent(labelText: string)}
  <Typography size={sizeStyles.fontSize}>
    {labelText}
  </Typography>
{/snippet}

<div 
  class="input-container"
  class:disabled
  class:focused={isFocused}
  class:hovered={isHovered}
  style:--input-height={sizeStyles.height}
  style:--input-padding={sizeStyles.padding}
  style:--input-radius={sizeStyles.radius}
>
  {#if label}
    <label for={id} class="label-wrapper">
      {@render labelContent(label)}
    </label>
  {/if}

  <GlassPane
    variant={glass ? variant : 'transparent'}
    attentionState={inputState}
    interactive={!disabled}
    elevated={elevated || effectiveElevation > 0}
    glowOnHover={!disabled}
    componentType="input"
  >
    <input
      {id}
      {type}
      {placeholder}
      {disabled}
      {required}
      bind:value
      aria-label={ariaLabel || label}
      aria-invalid={inputState === 'error'}
      aria-disabled={disabled}
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
    />
  </GlassPane>
</div>

<style>
  .input-container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--ui-space-2);
    z-index: var(--ui-layer-1);
  }

  .input-container:hover {
    z-index: var(--ui-layer-2);
  }

  .input-container:focus-within {
    z-index: var(--ui-layer-3);
  }

  .label-wrapper {
    color: var(--color-text-secondary);
  }

  input {
    width: 100%;
    height: var(--input-height);
    padding: var(--input-padding);
    border: none;
    border-radius: var(--input-radius);
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: inherit;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  input::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  input:focus {
    outline: none;
  }

  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .disabled input {
    cursor: not-allowed;
  }

  /* Spatial adjustments */
  @media (--ar) {
    .input-container {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-input));
    }
  }

  @media (--vr) {
    .input-container {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }
  }
</style>