<svelte:options runes={true} />

<script lang="ts">
  import { on } from 'svelte/events';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import NavigationBreadcrumb from '$lib/components/Molecules/Breadcrumb/NavigationBreadcrumb.svelte';
  import type { LayoutAccessibility } from '../types';
  import { defaultAccessibility } from '../types';
  import type { Agent, ChatEvents, ChatMessage } from '$lib/components/Organisms/Chat/chat';
  import { currentVista } from '$lib/stores/vista';
  import type { VistaConfig } from '$lib/types/vista';
  import Typography from '$lib/components/Typography.svelte';

  // Events
  const footerEvent = (type: 'resize' | 'chat' | 'social' | 'breadcrumb', data: any) => {
    const event = new CustomEvent(type, { detail: data });
    window.dispatchEvent(event);
  };

  // Props
  const {
    initialHeight = '7.5%',
    expandedHeight = '15%',
    accessibility = defaultAccessibility,
    agents = [],
    initialAgent = '',
    voiceEnabled = false,
    autoConnect = false,
    showBreadcrumbs = true,
    showSocialMedia = true
  } = $props<{
    initialHeight?: string;
    expandedHeight?: string;
    accessibility?: LayoutAccessibility;
    agents?: Agent[];
    initialAgent?: string;
    voiceEnabled?: boolean;
    autoConnect?: boolean;
    showBreadcrumbs?: boolean;
    showSocialMedia?: boolean;
  }>();

  // State
  let isExpanded = $state(false);
  let isChatOpen = $state(false);
  let currentVolume = $state(1);
  let isMuted = $state(false);

  // Vista-aware state
  let currentVistaConfig = $derived($currentVista);
  let footerTheme = $derived({
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    accent: 'var(--color-accent)',
    surface: 'var(--color-surface-mixed-100)'
  });

  // Derived values
  let footerHeight = $derived(isExpanded ? expandedHeight : initialHeight);
  let footerStyle = $derived(`
    height: ${footerHeight};
    transition: height var(--transition-duration) var(--transition-timing);
    background-color: ${footerTheme.surface};
    color: ${footerTheme.primary};
  `);

  // Methods
  function toggleExpand() {
    isExpanded = !isExpanded;
    footerEvent('resize', { expanded: isExpanded, height: footerHeight });
  }

  function handleChatMessage(message: ChatMessage) {
    footerEvent('chat', { type: 'message', message });
  }

  function handleChatError(error: ChatEvents['error']) {
    footerEvent('chat', { type: 'error', error });
  }

  function handleAgentSwitch(agent: ChatEvents['agentSwitch']) {
    footerEvent('chat', { type: 'agent', agent });
  }

  function handleVoiceAssistant(state: ChatEvents['voiceAssistant']) {
    footerEvent('chat', { type: 'voice', state });
  }

  function handleMute() {
    isMuted = !isMuted;
    footerEvent('chat', { type: 'mute', isMuted });
  }

  function handleVolumeChange(volume: number) {
    currentVolume = volume;
    footerEvent('chat', { type: 'volume', volume });
  }

  function handleFileUpload(file: File) {
    footerEvent('chat', { type: 'file', file });
  }

  function handleUtilitiesClick() {
    footerEvent('chat', { type: 'utilities' });
  }

  function handleSocialAction(action: string) {
    footerEvent('social', { action });
  }

  function handleBreadcrumbClick(path: string) {
    footerEvent('breadcrumb', { path });
  }
</script>

<UIScalingLayout>
  <footer 
    class="footer-container" 
    style={footerStyle}
    role={accessibility.aria.role}
    aria-label={accessibility.aria.label}
  >
    <GlassPane class="footer-content">
      <!-- Left Section -->
      {#if showBreadcrumbs}
        <nav class="breadcrumb-nav" aria-label="Breadcrumb navigation">
          <NavigationBreadcrumb />
        </nav>
      {/if}

      <!-- Center Section - Chat Interface -->
      <div class="chat-interface">
        <snippet name="chat">
          <div class="chat-controls" style="--accent-color: {footerTheme.accent}">
            <!-- Agent Selection -->
            <select 
              class="agent-select"
              value={initialAgent}
              onchange={(e) => handleAgentSwitch((e.target as HTMLSelectElement).value)}
              aria-label="Select AI agent"
            >
              {#each agents as agent}
                <option value={agent.id}>{agent.name}</option>
              {/each}
            </select>

            <!-- Voice Controls -->
            {#if voiceEnabled}
              <div class="voice-controls">
                <button
                  class="voice-button"
                  onclick={handleMute}
                  aria-label={isMuted ? "Unmute voice" : "Mute voice"}
                >
                  <span class="icon" aria-hidden="true">
                    <Typography.Icon name={isMuted ? 'mute' : 'volume_up'} />
                  </span>
                </button>
                <input
                  type="range"
                  class="volume-slider"
                  min="0"
                  max="1"
                  step="0.1"
                  value={currentVolume}
                  onchange={(e) => handleVolumeChange(Number((e.target as HTMLInputElement).value))}
                  aria-label="Voice volume"
                />
              </div>
            {/if}

            <!-- Utilities -->
            <button
              class="utilities-button"
              onclick={handleUtilitiesClick}
              aria-label="Open utilities"
            >
              <span class="icon" aria-hidden="true"><Typography.Icon name="settings" /></span>
            </button>
          </div>
        </snippet>
      </div>

      <!-- Right Section -->
      {#if showSocialMedia}
        <div class="social-media">
          <snippet name="social-media">
            <!-- Default social media content -->
          </snippet>
        </div>
      {/if}
    </GlassPane>
  </footer>
</UIScalingLayout>

<style>
  .footer-container {
    position: sticky;
    bottom: 0;
    width: 100%;
    z-index: var(--layer-footer);
  }

  /* Removed unused selector */ {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: var(--space-2);
  }

  .breadcrumb-nav {
    flex: 1;
    max-width: 30%;
  }

  .chat-interface {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chat-controls {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  .agent-select {
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    border: 1px solid var(--accent-color);
    background: transparent;
    color: inherit;
  }

  .voice-controls {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .voice-button,
  .utilities-button {
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: var(--space-1);
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-duration) var(--transition-timing);
  }

  .voice-button:hover,
  .utilities-button:hover {
    background-color: var(--surface-mixed-200);
  }

  .volume-slider {
    width: 100px;
  }

  .social-media {
    flex: 1;
    max-width: 30%;
    display: flex;
    justify-content: flex-end;
  }
</style>
