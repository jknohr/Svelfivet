<script lang="ts">
  import SocialMediaContact from './SocialMediaContact.svelte';
  import BreadcrumbNav from './BreadcrumbNav.svelte';
  import AIChatInterface from './AIChatInterface.svelte';
  import type { Agent, ChatEvents, ChatMessage } from '$lib/components/Organisms/chat/chat.d';

  interface Props {
    agents: Agent[];
    initialAgent: string;
    voiceEnabled?: boolean;
    autoConnect?: boolean;
    onmessage: (message: ChatMessage) => void;
    onerror: (error: ChatEvents['error']) => void;
    onagentswitch: (agent: ChatEvents['agentSwitch']) => void;
    onvoiceassistant: (state: ChatEvents['voiceAssistant']) => void;
    onmute: (state: { isMuted: boolean }) => void;
    onvolumechange: (state: { volume: number }) => void;
    onfileupload: (data: { file: File }) => void;
    onutilitiesclick: () => void;
  }

  let { 
    agents,
    initialAgent,
    voiceEnabled = false,
    autoConnect = false,
    onmessage,
    onerror,
    onagentswitch,
    onvoiceassistant,
    onmute,
    onvolumechange,
    onfileupload,
    onutilitiesclick
  } = $props<Props>();
</script>

<div class="chat-footer-container" role="complementary" aria-label="Chat interface with voice support">
  <div class="chat-footer">
    <BreadcrumbNav />
    <SocialMediaContact />
    <AIChatInterface
      {agents}
      {initialAgent}
      {voiceEnabled}
      {autoConnect}
      {onmessage}
      {onerror}
      {onagentswitch}
      {onvoiceassistant}
      {onmute}
      {onvolumechange}
      {onfileupload}
      {onutilitiesclick}
    />
  </div>
</div>

<style>
  .chat-footer-container {
    position: relative;
    width: 100%;
    height: 7.5vh;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chat-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    gap: 1rem;
  }
</style>