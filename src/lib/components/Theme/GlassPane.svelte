<!--
@component GlassPane
A base component for creating frosted glass UI elements with dynamic lighting effects.
Features:
- Configurable blur and transparency
- Dynamic attention state-based tinting
- Interactive lighting effects
- Smooth transitions
- Accessibility support
-->
<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { GlassEffect, GlassState, ThemeContext, GlassConfig } from './Theme.types';

  // Props with TypeScript interface
  interface Props {
    variant?: GlassEffect;
    attentionState?: GlassState;
    interactive?: boolean;
    elevated?: boolean;
    glowOnHover?: boolean;
    children?: Snippet;
    componentType?: string;
  }

  // Props using Svelte 5 style
  let props = $props();
  let { 
    variant = 'medium',
    attentionState = 'default',
    interactive = false,
    elevated = false,
    glowOnHover = true,
    componentType = 'presentation',
    children
  } = props as Props;

  // Theme context
  const themeContext = getContext<ThemeContext>('theme');
  const glassConfig = themeContext.theme.effects.glass;

  // Reactive state using Svelte 5 runes
  let isHovered = $state(false);
  let isFocused = $state(false);
  let isPressed = $state(false);
  let mouseX = $state(50);
  let mouseY = $state(50);

  // Compute active glass config using derived state
  const activeConfig = $derived.by(() => {
    const base = glassConfig.base;
    const states = glassConfig.states as Record<GlassState, Partial<GlassConfig>>;
    const variants = glassConfig.variants as Record<GlassEffect, Partial<GlassConfig>>;
    
    const stateConfig = attentionState !== 'default' ? states[attentionState] ?? {} : {};
    const variantConfig = variants[variant] ?? {};
    
    const config: GlassConfig = {
      ...base,
      ...variantConfig,
      ...stateConfig
    };

    return config;
  });

  // Generate CSS variables using derived state
  const glassVars = $derived.by(() => {
    const config = $state.snapshot(activeConfig);
    const intensity = isHovered ? (config.lightIntensity * 1.2) : config.lightIntensity;
    const glow = isHovered && glowOnHover ? config.glowRadius : '0px';

    return {
      '--glass-blur': config.blur,
      '--glass-opacity': config.opacity.toString(),
      '--glass-border-opacity': config.borderOpacity.toString(),
      '--glass-tint': config.tint,
      '--glass-light-color': config.lightColor,
      '--glass-light-intensity': intensity.toString(),
      '--glass-glow-radius': glow,
      '--glass-elevation': elevated ? '8px' : '0px'
    } as const;
  });

  // ARIA attributes using derived state
  const ariaAttrs = $derived(() => ({
    tabindex: interactive ? 0 : undefined,
    'aria-pressed': isPressed ? 'true' : undefined,
    'aria-disabled': !interactive ? 'true' : undefined
  }));

  // Update mouse position with proper typing
  function updateMousePosition(event: MouseEvent) {
    if (!interactive) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width) * 100;
    mouseY = ((event.clientY - rect.top) / rect.height) * 100;
  }

  // Reset mouse position
  function resetMousePosition() {
    mouseX = 50;
    mouseY = 50;
  }

  // Initialize mouse position using effect
  $effect(() => {
    resetMousePosition();
  });
</script>

<div
  class="glass-pane"
  class:interactive
  class:elevated
  class:hovered={isHovered}
  class:focused={isFocused}
  class:pressed={isPressed}
  class:has-state={attentionState !== 'default'}
  data-state={attentionState}
  data-variant={variant}
  role={componentType}
  {...ariaAttrs}
  onmouseenter={() => isHovered = true}
  onmouseleave={() => {
    isHovered = false;
    resetMousePosition();
  }}
  onmousemove={updateMousePosition}
  onfocus={() => isFocused = true}
  onblur={() => isFocused = false}
  onmousedown={() => isPressed = true}
  onmouseup={() => isPressed = false}
  style="{Object.entries(glassVars)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')};
    --mouse-x: {mouseX}%;
    --mouse-y: {mouseY}%;"
>
  <div class="glass-content">
    {@render children?.()}
  </div>
  {#if interactive || attentionState !== 'default'}
    <div class="glass-lighting"></div>
  {/if}
</div>

<style>
  .glass-pane {
    position: relative;
    backdrop-filter: blur(var(--glass-blur));
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--glass-tint) var(--glass-opacity), transparent),
      color-mix(in srgb, var(--glass-tint) calc(var(--glass-opacity) * 0.8), transparent)
    );
    border: 1px solid color-mix(in srgb, var(--glass-tint) var(--glass-border-opacity), transparent);
    border-radius: var(--radius-lg, 1rem);
    box-shadow: 
      0 var(--glass-elevation) calc(var(--glass-elevation) * 2) color-mix(in srgb, var(--glass-tint) 0.1, transparent),
      0 0 var(--glass-glow-radius) var(--glass-light-color);
    transition: all var(--transition-normal, 300ms) var(--ease-standard, cubic-bezier(0.4, 0.0, 0.2, 1));
    overflow: hidden;
  }

  .glass-content {
    position: relative;
    z-index: 1;
  }

  .glass-lighting {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      color-mix(in srgb, var(--glass-light-color) calc(var(--glass-light-intensity) * 100%), transparent),
      transparent 50%
    );
    opacity: var(--glass-light-intensity);
    pointer-events: none;
    mix-blend-mode: soft-light;
    transition: opacity var(--transition-fast, 150ms) linear;
  }

  .interactive {
    cursor: pointer;
  }

  .interactive:hover {
    --glass-opacity: calc(var(--glass-opacity) * 1.2);
    --glass-border-opacity: calc(var(--glass-border-opacity) * 1.2);
  }

  .pressed {
    transform: translateY(1px);
    --glass-opacity: calc(var(--glass-opacity) * 0.9);
  }

  .focused {
    outline: none;
    box-shadow: 
      0 var(--glass-elevation) calc(var(--glass-elevation) * 2) color-mix(in srgb, var(--glass-tint) 0.1, transparent),
      0 0 0 3px color-mix(in srgb, var(--glass-light-color) 0.3, transparent),
      0 0 var(--glass-glow-radius) var(--glass-light-color);
  }

  /* State-specific styles */
  .has-state .glass-lighting {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { opacity: calc(var(--glass-light-intensity) * 0.8); }
    50% { opacity: var(--glass-light-intensity); }
    100% { opacity: calc(var(--glass-light-intensity) * 0.8); }
  }
</style> 
