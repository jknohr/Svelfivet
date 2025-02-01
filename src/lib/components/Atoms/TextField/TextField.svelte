<!-- /src/lib/components/TextField.svelte -->
<!--
@component TextField
A modern textarea component with glass effect styling and theme integration.
Features:
- Glass effect styling with hover and focus states
- Multiple sizes and variants
- Theme system integration
- Full accessibility support
- AR/VR environment support
-->

<svelte:options runes={true} />

<script lang="ts">
  import type { TextFieldProps, TextFieldSize, TextFieldVariant } from './TextField.types';
  import { TEXTFIELD_SIZES, TEXTFIELD_STATES, TEXTFIELD_VARIANTS } from './TextField.types';
  import GlassPane from '../../Theme/GlassPane.svelte';
  import Typography from '../../Theme/Typography.svelte';

  // Props
  let {
    label,
    value = $bindable(''),
    placeholder = '',
    icon,
    disabled = false,
    readonly = false,
    required = false,
    size = 'md' as TextFieldSize,
    variant = 'default' as TextFieldVariant,
    state: textFieldState = 'default',
    glass = true,
    elevated = false,
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
  let sizeStyles = $derived.by(() => TEXTFIELD_SIZES[size as TextFieldSize]);
  let variantStyles = $derived.by(() => TEXTFIELD_VARIANTS[variant as TextFieldVariant]);

  // Event handlers
  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
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

  // Generate unique ID for textarea-label association
  const id = `textarea-${Math.random().toString(36).slice(2, 11)}`;
</script>

{#snippet labelContent(labelText: string)}
  <Typography size={sizeStyles.fontSize}>
    {labelText}
  </Typography>
{/snippet}

{#snippet iconContent(iconName: string)}
  <Typography size={sizeStyles.fontSize} family="icon">
    {iconName}
  </Typography>
{/snippet}

<div 
  class="textarea-container"
  class:disabled
  class:readonly
  class:focused={isFocused}
  class:hovered={isHovered}
  style:--textarea-height={sizeStyles.height}
  style:--textarea-padding={sizeStyles.padding}
  style:--textarea-radius={sizeStyles.radius}
>
  {#if label}
    <label for={id} class="label-wrapper">
      {@render labelContent(label)}
    </label>
  {/if}

  <GlassPane
    variant={glass ? variant : 'transparent'}
    attentionState={textFieldState}
    interactive={!disabled}
    elevated={elevated || effectiveElevation > 0}
    glowOnHover={!disabled}
    componentType="textarea"
  >
    <div class="textarea-wrapper" class:has-icon={!!icon}>
      {#if icon}
        <span class="icon-wrapper">
          {@render iconContent(icon)}
        </span>
      {/if}

      <textarea
        {id}
        {placeholder}
        {readonly}
        {required}
        {disabled}
        bind:value
        aria-label={ariaLabel || label}
        aria-invalid={textFieldState === 'error'}
        aria-disabled={disabled}
        oninput={handleInput}
        onfocus={handleFocus}
        onblur={handleBlur}
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
      ></textarea>
    </div>
  </GlassPane>
</div>

<style>
  .textarea-container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--ui-space-2);
    z-index: var(--ui-layer-1);
  }

  .textarea-container:hover {
    z-index: var(--ui-layer-2);
  }

  .textarea-container:focus-within {
    z-index: var(--ui-layer-3);
  }

  .label-wrapper {
    color: var(--color-text-secondary);
  }

  .textarea-wrapper {
    position: relative;
    display: flex;
    width: 100%;
  }

  .textarea-wrapper.has-icon {
    gap: var(--ui-space-2);
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
  }

  textarea {
    width: 100%;
    min-height: var(--textarea-height);
    padding: var(--textarea-padding);
    border: none;
    border-radius: var(--textarea-radius);
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: inherit;
    resize: vertical;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  textarea::placeholder {
    color: var(--color-text-secondary);
    opacity: 0.7;
  }

  textarea:focus {
    outline: none;
  }

  .disabled textarea {
    cursor: not-allowed;
  }

  .readonly textarea {
    cursor: default;
  }

  /* Spatial adjustments */
  @media (--ar) {
    .textarea-container {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-input));
    }
  }

  @media (--vr) {
    .textarea-container {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }
  }
</style>

<!--
wE NEED TO MAKE SURE THIS IS NOT MISSING FOR dIAGRAMS.TextField
<input
	{placeholder}
	type="text"
	bind:value={$textStore}
	onkeydown={(event) => event.stopPropagation()}
	onclick={(event) => event.stopPropagation()}
	onmousedown={(event) => event.stopPropagation()}
/>
-->