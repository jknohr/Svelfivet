<svelte:options runes={true} />

<script lang="ts">
  import { currentVista } from '$lib/stores/vista';
  import type { VistaConfig, SocialMediaConfig } from '$lib/types/vista';

  // Events
  const socialEvent = $event<{
    type: 'click' | 'share';
    platform: string;
    data?: any;
  }>();

  // Props
  const {
    showLabels = false,
    showHandles = false
  } = $props<{
    showLabels?: boolean;
    showHandles?: boolean;
  }>();

  // Vista-aware state
  let currentVistaConfig = $derived($currentVista as VistaConfig);
  let socialTheme = $derived(currentVistaConfig?.theme || {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)'
  });
  let socialPlatforms = $derived(currentVistaConfig?.social || []);

  function handleSocialClick(platform: SocialMediaConfig) {
    socialEvent.dispatch({
      type: 'click',
      platform: platform.platform,
      data: { url: platform.url, handle: platform.handle }
    });
  }

  function handleShare(platform: SocialMediaConfig) {
    socialEvent.dispatch({
      type: 'share',
      platform: platform.platform,
      data: { 
        url: window.location.href,
        handle: platform.handle
      }
    });
  }
</script>

<div class="social-panel" style="--accent-color: {socialTheme.accent}">
  {#each socialPlatforms as platform}
    <button
      class="social-button"
      onclick={() => handleSocialClick(platform)}
      aria-label="{platform.label}"
    >
      <span class="icon" aria-hidden="true">
        {platform.icon}
      </span>
      {#if showLabels}
        <span class="label">{platform.label}</span>
      {/if}
      {#if showHandles && platform.handle}
        <span class="handle">{platform.handle}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .social-panel {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  .social-button {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    background: transparent;
    border: 1px solid var(--accent-color);
    border-radius: var(--radius-sm);
    color: inherit;
    cursor: pointer;
    transition: all var(--transition-duration) var(--transition-timing);
  }

  .social-button:hover {
    background-color: var(--surface-mixed-200);
    transform: translateY(-1px);
  }

  .icon {
    font-size: var(--font-size-lg);
  }

  .label {
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .handle {
    font-size: var(--font-size-sm);
    color: var(--text-2);
  }
</style>
