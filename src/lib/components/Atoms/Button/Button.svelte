<!--
@component Button
A versatile button component with glass effect and theme integration.
Features:
- Multiple sizes and variants with spatial scaling
- Loading state with spinner
- Glass effect integration
- Theme system integration
- Full accessibility support
- AR/VR environment support
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { ButtonConfig, ButtonType } from './Button.types';
  import { BUTTON_SIZES, BUTTON_STATES, BUTTON_SHAPES, ATTENTION_ANIMATIONS, BUTTON_SPATIAL } from './Button.types';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import { createElementRunes } from '$lib/components/Theme/ThemeElements';
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import type { TextSize } from '$lib/components/Theme/Typography.types';

  // Theme context
  const theme = getContext<UnifiedThemeContext>('theme');
  const elementRunes = createElementRunes('button');
  const elementState = elementRunes.state.create();

  // Props
  let {
    label,
    type = 'button' as ButtonType,
    size = 'md',
    shape = 'default',
    variant = 'primary',
    disabled = false,
    fullWidth = false,
    state: initialState = 'default',
    loading = false,
    glowOnHover = true,
    glowIntensity = 1,
    glowColor,
    elevated = false,
    ariaLabel,
    componentType = 'button',
    icon = undefined,
    iconPosition = 'left',
    tint = undefined,
    dissolveOnClick = false,
    attention = 'none',
    dimensions
  } = $props();

  // Local state
  let isDissolving = $state(false);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let glowOpacity = $state(0);

  // Computed styles
  let buttonStyles = $derived.by(() => {
    const sizeStyles = BUTTON_SIZES[size as keyof typeof BUTTON_SIZES];
    const stateStyles = BUTTON_STATES[currentState as keyof typeof BUTTON_STATES];
    const shapeStyles = BUTTON_SHAPES[shape as keyof typeof BUTTON_SHAPES];
    
    const customStyles = dimensions ? {
      width: dimensions.width,
      height: dimensions.height,
      padding: dimensions.padding,
      borderRadius: dimensions.radius
    } : {};

    const glowValue = glowOnHover ? 
      `${sizeStyles.glow} ${glowColor || 'var(--color-glow)'}` : 
      'none';

    // Handle shape-specific styles
    const shapeSpecificStyles = [];
    if ('aspectRatio' in shapeStyles) {
      shapeSpecificStyles.push(`aspect-ratio: ${shapeStyles.aspectRatio}`);
    }

    const glowOpacityValue = typeof stateStyles.glow === 'number' ? 
      stateStyles.glow * (glowIntensity || 1) : 
      0;

    return [
      `height: ${customStyles.height || sizeStyles.height}`,
      `padding: ${customStyles.padding || shapeStyles.padding || sizeStyles.padding}`,
      `border-radius: ${customStyles.borderRadius || shapeStyles.radius}`,
      ...shapeSpecificStyles,
      `opacity: ${stateStyles.opacity}`,
      `cursor: ${disabled ? 'not-allowed' : stateStyles.cursor}`,
      fullWidth ? 'width: 100%' : (customStyles.width ? `width: ${customStyles.width}` : ''),
      `transform: ${stateStyles.transform}`,
      `box-shadow: ${glowValue}`,
      `--glow-opacity: ${glowOpacityValue}`,
      attention !== 'none' ? `animation: ${ATTENTION_ANIMATIONS[attention as keyof typeof ATTENTION_ANIMATIONS]}` : ''
    ].filter(Boolean).join(';');
  });

  // Current state for theming
  let currentState = $derived.by(() => {
    if (disabled) return 'disabled';
    if (loading) return 'loading';
    if (elementState.active) return 'active';
    if (elementState.hover) return 'hover';
    return initialState;
  });

  // Computed size
  let textSize = $derived.by(() => {
    const sizeStyles = BUTTON_SIZES[size as keyof typeof BUTTON_SIZES];
    const fontSize = sizeStyles.fontSize;
    switch (fontSize) {
      case 'xs':
      case 'sm':
      case 'base':
      case 'lg':
      case 'xl':
        return fontSize;
      default:
        return 'xl';
    }
  });

  // Dynamic icon component
  function renderIcon(Icon: any) {
    if (typeof Icon === 'function') {
      return () => new Icon({});
    }
    return Icon;
  }

  // Event handlers
  function handleMouseMove(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 100;
    mouseY = ((event.clientY - rect.top) / rect.height) * 100;
  }

  function handleDissolveComplete() {
    isDissolving = false;
  }

  // Setup effects
  let setupNode: HTMLElement;
  $effect(() => {
    if (setupNode) {
      elementRunes.effects.setupInteractions(setupNode);
      elementRunes.effects.setupAccessibility(setupNode);
      elementRunes.effects.setupGestures(setupNode);
    }
  });
</script>

<div
  class="button-container"
  class:dissolving={isDissolving}
  class:active={elementState.active}
  role="presentation"
  bind:this={setupNode}
>
  <GlassPane
    {variant}
    state={currentState}
    {glowOnHover}
    {componentType}
    {elevated}
    style="--button-tint: {tint}"
  >
    <button
      {type}
      class="button"
      class:loading
      class:disabled
      style={buttonStyles}
      {disabled}
      aria-label={ariaLabel || label}
      aria-disabled={disabled || loading}
      onclick={(e) => {
        if (disabled || loading) {
          e.preventDefault();
          return;
        }
        if (dissolveOnClick && !isDissolving) {
          isDissolving = true;
          setTimeout(handleDissolveComplete, 500);
        }
      }}
      onmousemove={handleMouseMove}
    >
      {#if loading}
        <div class="loading-indicator" />
      {/if}
      
      <span 
        class="button-content" 
        style:opacity={loading ? 0 : 1}
        class:dissolving={isDissolving}
      >
        {#if icon && (iconPosition === 'left' || iconPosition === 'center')}
          <span class="icon left">
            {#if typeof icon === 'function'}
              {renderIcon(icon)}
            {:else}
              {icon}
            {/if}
          </span>
        {/if}

        {#if iconPosition !== 'center'}
          <Typography
            size={textSize}
            weight="medium"
            color="inherit"
          >
            {label}
          </Typography>
        {/if}

        {#if icon && (iconPosition === 'right' || iconPosition === 'center')}
          <span class="icon right">
            {#if typeof icon === 'function'}
              {renderIcon(icon)}
            {:else}
              {icon}
            {/if}
          </span>
        {/if}
      </span>
    </button>
  </GlassPane>
</div>

<style>
  .button-container {
    position: relative;
    width: fit-content;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    transition: all var(--transition-normal) var(--ease-standard);
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    overflow: hidden;
  }

  .button::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mouse-x) var(--mouse-y),
      var(--color-glow) 0%,
      transparent 100%
    );
    opacity: var(--glow-opacity, 0);
    transition: opacity var(--transition-normal) var(--ease-standard);
    pointer-events: none;
    mix-blend-mode: screen;
  }

  .button-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.2em;
    height: 1.2em;
  }

  .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(var(--ui-unit) * 0.75);
    height: calc(var(--ui-unit) * 0.75);
    border: calc(var(--ui-grid) * 0.5) solid currentColor;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: spin var(--transition-normal) linear infinite;
  }

  @keyframes spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  .dissolving {
    animation: dissolve 0.5s ease-out forwards;
  }

  @keyframes dissolve {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }

  .disabled {
    pointer-events: none;
  }

  /* Attention state animations */
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes flash {
    0%, 50%, 100% { opacity: 1; }
    25%, 75% { opacity: 0.5; }
  }

  /* Spatial adjustments */
  @media (--ar) {
    .button {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-button));
    }

    .button:hover {
      transform: translateZ(calc(var(--depth-button) * 1.2));
    }

    .button:active {
      transform: translateZ(calc(var(--depth-button) * 0.8));
    }
  }

  @media (--vr) {
    .button {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }

    .button:hover {
      transform: translateZ(calc(var(--depth-ui) * 1.2));
    }

    .button:active {
      transform: translateZ(calc(var(--depth-ui) * 0.8));
    }
  }
</style>
