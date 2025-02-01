<!--
@component LoginButton
A split button for login/register with glass effect and engraved appearance.
Features:
- Split design with register | login sections
- Glass effect with engraved appearance
- Light/dark mode adaptation
- Spatial scaling integration
-->
<svelte:options runes={true} />

<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';

  // Props
  let {
    onLogin = () => {},
    onCreateUser = () => {},
    disabled = false
  } = $props();

  // Theme context
  const theme = getContext<UnifiedThemeContext>('theme');

  // Local state
  let isLoginHovered = $state(false);
  let isRegisterHovered = $state(false);
  let isLoginActive = $state(false);
  let isRegisterActive = $state(false);

  // Derived state
  let buttonState = $derived(() => {
    if (isLoginActive || isRegisterActive) return 'active';
    if (isLoginHovered || isRegisterHovered) return 'hover';
    return 'default';
  });
</script>

<div class="login-button-container" class:disabled>
  <GlassPane
    variant="light"
    state={buttonState}
    glowOnHover={true}
    componentType="button"
  >
    <div class="split-button">
      <!-- Register Side -->
      <button
        class="button-half register"
        on:mouseenter={() => isRegisterHovered = true}
        on:mouseleave={() => isRegisterHovered = false}
        on:mousedown={() => isRegisterActive = true}
        on:mouseup={() => isRegisterActive = false}
        on:click={(e) => onCreateUser(e)}
        {disabled}
        aria-label="Register"
      >
        <Typography size="base" weight="medium">
          Register
        </Typography>
      </button>

      <div class="divider" />

      <!-- Login Side -->
      <button
        class="button-half login"
        on:mouseenter={() => isLoginHovered = true}
        on:mouseleave={() => isLoginHovered = false}
        on:mousedown={() => isLoginActive = true}
        on:mouseup={() => isLoginActive = false}
        on:click={(e) => onLogin(e)}
        {disabled}
        aria-label="Login"
      >
        <Typography size="base" weight="medium">
          Login
        </Typography>
      </button>
    </div>
  </GlassPane>
</div>

<style>
  .login-button-container {
    position: relative;
    height: var(--ui-unit);
    min-width: calc(var(--ui-unit) * 6);
  }

  .split-button {
    display: flex;
    align-items: stretch;
    height: 100%;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-surface) 95%, transparent);
    box-shadow: 
      /* Engraved effect - light mode */
      inset 0 1px 2px color-mix(in srgb, var(--color-shadow) 15%, transparent),
      /* Subtle inner glow */
      inset 0 0 15px color-mix(in srgb, var(--color-glow) 5%, transparent);
  }

  .button-half {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 var(--ui-grid);
    border: none;
    background: transparent;
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--transition-normal) var(--ease-standard);
  }

  .button-half:hover {
    background: color-mix(in srgb, var(--color-primary) 5%, transparent);
  }

  .button-half:active {
    background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  .divider {
    width: 1px;
    margin: var(--ui-grid) 0;
    background: color-mix(in srgb, var(--color-border) 50%, transparent);
  }

  .disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  /* Dark mode adjustments */
  :global([data-theme="dark"]) .split-button {
    background: color-mix(in srgb, var(--color-surface) 97%, transparent);
    box-shadow: 
      /* Engraved effect - dark mode */
      inset 0 1px 3px color-mix(in srgb, black 20%, transparent),
      /* Subtle highlight */
      inset 0 -1px 1px color-mix(in srgb, white 5%, transparent);
  }

  /* Spatial adjustments */
  @media (--ar) {
    .login-button-container {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-floating));
    }
  }

  @media (--vr) {
    .login-button-container {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }
  }
</style>
