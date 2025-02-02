<!--
@component
Chat footer component with voice support and agent switching.
Provides text and voice input with real-time communication.

Usage:
```svelte
<ChatFooter
  agents={agents}
  initialAgent="default"
  voiceEnabled={true}
  autoConnect={false}
  onmessage={(msg) => handleMessage(msg)}
  onerror={(err) => handleError(err)}
  onagentswitch={(agent) => handleAgentSwitch(agent)}
/>
```
-->
<script lang="ts">
  import { fade } from 'svelte/transition';
  import { getContext } from 'svelte';
  import type { Agent, VoiceState, ChatMessage, ChatEvents, WebSocketMessage } from './chat';
  import { formatTimestamp, isValidMessage } from './chat';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  // Dummy Fazwaz AI Agent
  const fazwazAgent: Agent = {
    id: 'fazwaz-ai',
    name: 'Fazwaz AI',
    type: 'local'
  };

  // Props using $props rune
  let { 
    agents = [fazwazAgent],
    initialAgent = 'fazwaz-ai',
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
  } = $props<{
    agents: Agent[];
    initialAgent: string;
    voiceEnabled?: boolean;
    autoConnect?: boolean;
    onmessage?: (message: ChatMessage) => void;
    onerror?: (error: ChatEvents['error']) => void;
    onagentswitch?: (agent: Agent) => void;
    onvoiceassistant?: (state: boolean) => void;
    onmute?: (state: { isMuted: boolean }) => void;
    onvolumechange?: (state: { volume: number }) => void;
    onfileupload?: (file: File) => void;
    onutilitiesclick?: () => void;
  }>();

  // State using $state rune
  let showHistory = $state(false);
  let message = $state('');
  let chatHistory = $state<ChatMessage[]>([]);
  let isProcessing = $state(false);
  let isVoiceActive = $state(false);
  let currentAgent = $state<Agent>(agents.find((agent: Agent) => agent.id === initialAgent) || agents[0]);

  // Voice chat state
  let mediaRecorder = $state<MediaRecorder | null>(null);
  let audioChunks = $state<Blob[]>([]);
  let voiceState = $state<VoiceState>({
    isListening: false,
    isMuted: false,
    volume: 1.0,
  });

  // WebSocket state
  let ws = $state<WebSocket | null>(null);

  // Derived values using $derived rune
  let isConnected = $derived(ws?.readyState === WebSocket.OPEN);
  let canSendMessage = $derived(!isProcessing && message.trim().length > 0);

  // Initialize WebSocket and voice chat using $effect
  $effect(() => {
    initializeWebSocket();
    if (voiceEnabled && autoConnect) {
      initializeVoiceChat();
    }

    return () => cleanupResources();
  });

  // WebSocket initialization
  function initializeWebSocket() {
    const wsUrl = currentAgent.type === 'local'
      ? 'ws://localhost:3000/chat'
      : 'wss://external-agent.example.com/chat';

    ws = new WebSocket(wsUrl);

    ws.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as WebSocketMessage;
      handleWebSocketMessage(data);
    };

    ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
      onerror?.({ message: 'Connection error occurred' });
    };
  }

  // Voice chat initialization
  async function initializeVoiceChat() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks = [...audioChunks, event.data];
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioChunks = [];
        await processAudioMessage(audioBlob);
      };

      voiceState.isListening = true;
      startVoiceRecording();
    } catch (error) {
      console.error('Failed to initialize voice chat:', error);
      onerror?.({ message: 'Could not initialize voice chat' });
    }
  }

  // Voice recording functions
  function startVoiceRecording() {
    if (mediaRecorder?.state === 'inactive' && !voiceState.isMuted) {
      mediaRecorder.start(1000);
    }
  }

  function stopVoiceRecording() {
    if (mediaRecorder?.state === 'recording') {
      mediaRecorder.stop();
    }
  }

  // Process audio message
  async function processAudioMessage(audioBlob: Blob) {
    if (!ws?.readyState || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not available');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const { text } = await response.json();

      if (text.trim()) {
        sendMessage(text, 'voice');
      }
    } catch (error) {
      console.error('Error processing audio message:', error);
      onerror?.({ message: 'Failed to process voice message' });
    }
  }

  // WebSocket message handling
  function handleWebSocketMessage(data: WebSocketMessage) {
    switch (data.type) {
      case 'message':
        if (data.message) {
          addMessageToHistory(data.message);
        }
        break;
      case 'status':
        isProcessing = !!data.isProcessing;
        break;
    }
  }

  // Message history management
  function addMessageToHistory(message: ChatMessage) {
    chatHistory = [...chatHistory, message];
    onmessage?.(message);
  }

  // Agent switching
  function switchAgent(agentId: string) {
    const newAgent = agents.find((agent: Agent) => agent.id === agentId);
    if (newAgent && newAgent.id !== currentAgent.id) {
      cleanupResources();
      currentAgent = newAgent;
      initializeWebSocket();
      onagentswitch?.(newAgent);
    }
  }

  // Resource cleanup
  function cleanupResources() {
    ws?.close();
    ws = null;
    if (mediaRecorder) {
      stopVoiceRecording();
      mediaRecorder = null;
    }
  }

  // Message sending
  async function handleSend() {
    if (message.trim()) {
      await sendMessage(message.trim(), 'text');
      message = '';
    }
  }

  async function sendMessage(content: string, type: 'text' | 'voice') {
    if (!ws?.readyState || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not available');
      return;
    }

    const messageData: ChatMessage = {
      type: 'message',
      content,
      messageType: type,
      timestamp: new Date().toISOString(),
      sender: 'user',
      agent: currentAgent.id,
    };

    try {
      ws.send(JSON.stringify(messageData));
      onmessage?.(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      onerror?.({ message: 'Failed to send message' });
    }
  }

  // Event handlers
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function toggleMute() {
    voiceState.isMuted = !voiceState.isMuted;
    if (voiceState.isMuted) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
    onmute?.({ isMuted: voiceState.isMuted });
  }

  function adjustVolume(value: number) {
    voiceState.volume = Math.max(0, Math.min(1, value));
    onvolumechange?.({ volume: voiceState.volume });
  }

  function handleFileUpload(file: File) {
    if (file) {
      onfileupload?.(file);
    }
  }

  function handleVoiceAssistant() {
    isVoiceActive = !isVoiceActive;
    onvoiceassistant?.(isVoiceActive);
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</svelte:head>

<div class="chat-footer-wrapper">
  <GlassPane variant="medium" attentionState={isProcessing ? 'active' : 'default'}>
    <div
      class="chat-footer-container"
      role="complementary"
      aria-label="Chat interface with voice support"
      onmouseenter={() => showHistory = true}
      onmouseleave={() => showHistory = false}
    >
      {#if showHistory}
        <div class="chat-history" transition:fade={{ duration: 200 }}>
          {#each chatHistory as chat}
            <div 
              class="chat-message"
              class:agent={chat.sender === currentAgent.name}
            >
              <GlassPane 
                variant="light" 
                attentionState="default"
              >
                <div class="message-header">
                  <div class="sender">
                    <Typography size="sm" weight="medium">{chat.sender}</Typography>
                  </div>
                  <div class="timestamp">
                    <Typography size="xs" color="var(--text-secondary)">{formatTimestamp(chat.timestamp)}</Typography>
                  </div>
                  {#if chat.messageType === 'voice'}
                    <div class="voice-badge">
                      <Typography size="xs">Voice</Typography>
                    </div>
                  {/if}
                </div>
                <div class="message-text">
                  <Typography size="base">{chat.content}</Typography>
                </div>
              </GlassPane>
            </div>
          {/each}
          {#if isProcessing}
            <div class="processing">
              <Typography size="sm" color="var(--text-secondary)" align="center">
                Agent is processing...
              </Typography>
            </div>
          {/if}
        </div>
      {/if}

      <div class="chat-footer">
        <div class="agent-selector">
          <select
            value={currentAgent.id}
            onchange={(e) => switchAgent((e.target as HTMLSelectElement).value)}
          >
            {#each agents as agent}
              <option value={agent.id}>
                <Typography size="sm">{agent.name}</Typography>
              </option>
            {/each}
          </select>
        </div>

        <div class="button-group left">
          <label for="file-upload" class="icon-button" aria-label="Upload file">
            <i class="icon">upload_file</i>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.heif,.pdf,image/png,image/jpeg,image/webp,image/heif,application/pdf"
            onchange={(e) => {
              const input = e.target as HTMLInputElement;
              if (input.files?.[0]) {
                handleFileUpload(input.files[0]);
                input.value = '';
              }
            }}
            style="display: none;"
          />

          <button
            class="icon-button"
            class:active={voiceState.isListening}
            onclick={toggleMute}
            aria-label={voiceState.isMuted ? "Unmute" : "Mute"}
          >
            <i class="icon">{voiceState.isMuted ? 'mic_off' : 'mic'}</i>
          </button>

          {#if voiceEnabled}
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceState.volume}
              oninput={(e) => adjustVolume(parseFloat((e.target as HTMLInputElement).value))}
              class="volume-slider"
              aria-label="Voice volume"
            />
          {/if}
          
          <button 
            class="icon-button" 
            onclick={handleVoiceAssistant} 
            aria-label={isVoiceActive ? "Deactivate voice assistant" : "Activate voice assistant"}
          >
            <i class="icon">{isVoiceActive ? 'record_voice_over' : 'voice_chat'}</i>
          </button>

          <button 
            class="icon-button" 
            onclick={onutilitiesclick} 
            aria-label="More options"
          >
            <i class="icon">more_horiz</i>
          </button>
        </div>

        <div class="input-wrapper">
          <textarea
            bind:value={message}
            onkeydown={handleKeyDown}
            rows="1"
            disabled={isProcessing}
            placeholder="Type a message or speak..."
            aria-label="Chat message input"
          ></textarea>
        </div>

        <button
          class="send-button"
          onclick={handleSend}
          disabled={!canSendMessage}
          aria-label="Send message"
        >
          <i class="icon">send</i>
        </button>
      </div>
    </div>
  </GlassPane>
</div>

<style>
  .chat-footer-container {
    position: relative;
    width: 100%;
    padding: var(--space-md);
    border-radius: var(--radius-lg);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .agent-selector {
    margin-right: var(--space-sm);
  }

  .agent-selector select {
    padding: var(--space-xs);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--surface-color);
    color: var(--text-color);
  }

  .chat-footer {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: 800px;
    border-radius: var(--radius-md);
    padding: var(--space-sm);
  }

  .chat-history {
    position: absolute;
    bottom: calc(100% + var(--space-xs));
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    z-index: 10;
  }

  .chat-message {
    margin-bottom: var(--space-sm);
    padding: var(--space-sm);
    border-radius: var(--radius-md);
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    margin-bottom: var(--space-xs);
  }

  .voice-badge {
    padding: var(--space-xxs) var(--space-xs);
    border-radius: var(--radius-full);
    background: var(--primary);
    color: var(--text-on-primary);
  }

  .processing {
    padding: var(--space-sm);
    font-style: italic;
  }

  .message-text {
    color: var(--text);
  }

  .volume-slider {
    appearance: none;
    width: 100px;
    height: 4px;
    background: var(--slider-bg);
    border-radius: 2px;
    outline: none;
  }

  .volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 1.25rem;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'liga';
  }

  .icon-button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--text-2);
    border-radius: 0.375rem;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon-button:hover {
    background: rgba(var(--surface-rgb), 0.8);
    color: var(--text);
  }

  .icon-button.active {
    background: rgba(var(--surface-rgb), 0.8);
    color: var(--text);
  }

  .input-wrapper {
    flex: 1;
    min-width: 0;
  }

  textarea {
    width: 100%;
    border: none;
    outline: none;
    padding: 0.5rem;
    resize: none;
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-height: 100px;
    overflow-y: auto;
    background: transparent;
    color: var(--text);
  }

  .send-button {
    background: var(--primary);
    border: none;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .send-button:hover {
    background: var(--primary-dark);
  }

  .send-button svg {
    width: 1.25rem;
    height: 1.25rem;
  }
</style>