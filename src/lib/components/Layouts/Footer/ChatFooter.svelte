<!--
@component
Chat footer component with voice support and agent switching.
Provides text and voice input with real-time communication.

Usage:
```ts
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
  import type { Agent, VoiceState, ChatMessage, ChatState, VoiceChatState, WebSocketState, WebSocketMessage, WebSocketError, ChatEvents } from '$lib/components/Organisms/chat/chat.d';

  // Props using Svelte 5 runes
  let {
    agents,
    initialAgent,
    voiceEnabled = false,
    autoConnect = false,
    onmessage = $bindable(),
    onerror = $bindable(),
    onagentswitch = $bindable(),
    onvoiceassistant = $bindable(),
    onmute = $bindable(),
    onvolumechange = $bindable(),
    onfileupload = $bindable(),
    onutilitiesclick = $bindable()
  } = $props<{
    agents: Agent[];
    initialAgent: string;
    voiceEnabled?: boolean;
    autoConnect?: boolean;
    onmessage?: (message: ChatMessage) => void;
    onerror?: (error: ChatEvents['error']) => void;
    onagentswitch?: (agent: ChatEvents['agentSwitch']) => void;
    onvoiceassistant?: (state: ChatEvents['voiceAssistant']) => void;
    onmute?: (state: { isMuted: boolean }) => void;
    onvolumechange?: (state: { volume: number }) => void;
    onfileupload?: (data: { file: File }) => void;
    onutilitiesclick?: () => void;
  }>();

  // Chat state using Svelte 5 runes
  let chatState = $state<ChatState>({
    showHistory: false,
    message: '',
    chatHistory: [],
    isProcessing: false,
    isVoiceActive: false,
    currentAgent: agents.find((agent: Agent) => agent.id === initialAgent) || agents[0]
  });

  // Voice chat state
  let voiceChatState = $state<VoiceChatState>({
    mediaRecorder: null,
    audioChunks: [],
    voiceState: {
      isListening: false,
      isMuted: false,
      volume: 1.0
    }
  });

  // WebSocket state
  let wsState = $state<WebSocketState>({
    ws: null
  });

  // Derived values
  const isConnected = $derived(wsState.ws?.readyState === WebSocket.OPEN);
  const canSendMessage = $derived(!chatState.isProcessing && chatState.message.trim().length > 0);

  // Effects
  $effect(() => {
    initializeWebSocket();
    if (voiceEnabled && autoConnect) {
      initializeVoiceChat();
    }

    return () => cleanupResources();
  });

  function initializeWebSocket() {
    const wsUrl = chatState.currentAgent.type === 'local'
      ? 'ws://localhost:3000/chat'
      : 'wss://external-agent.example.com/chat';

    wsState.ws = new WebSocket(wsUrl);

    wsState.ws.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as WebSocketMessage;
      handleWebSocketMessage(data);
    };

    wsState.ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
      onerror?.({ message: 'Connection error occurred' });
    };
  }

  async function initializeVoiceChat() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceChatState.mediaRecorder = new MediaRecorder(stream);

      voiceChatState.mediaRecorder.ondataavailable = (event) => {
        voiceChatState.audioChunks = [...voiceChatState.audioChunks, event.data];
      };

      voiceChatState.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(voiceChatState.audioChunks, { type: 'audio/wav' });
        voiceChatState.audioChunks = [];
        await processAudioMessage(audioBlob);
      };

      voiceChatState.voiceState.isListening = true;
      startVoiceRecording();
    } catch (error) {
      console.error('Failed to initialize voice chat:', error);
      onerror?.({ message: 'Could not initialize voice chat' });
    }
  }

  function startVoiceRecording() {
    if (voiceChatState.mediaRecorder?.state === 'inactive' && !voiceChatState.voiceState.isMuted) {
      voiceChatState.mediaRecorder.start(1000);
    }
  }

  function stopVoiceRecording() {
    if (voiceChatState.mediaRecorder?.state === 'recording') {
      voiceChatState.mediaRecorder.stop();
    }
  }

  async function processAudioMessage(audioBlob: Blob) {
    if (!wsState.ws?.readyState || wsState.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not available');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData
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

  function handleWebSocketMessage(data: WebSocketMessage) {
    switch (data.type) {
      case 'message':
        if (data.message) {
          addMessageToHistory(data.message);
        }
        break;
      case 'status':
        chatState.isProcessing = !!data.isProcessing;
        break;
    }
  }

  function addMessageToHistory(message: ChatMessage) {
    chatState.chatHistory = [...chatState.chatHistory, message];
    onmessage?.(message);
  }

  function switchAgent(agentId: string) {
    const newAgent = agents.find((agent: Agent) => agent.id === agentId);
    if (newAgent && newAgent.id !== chatState.currentAgent.id) {
      cleanupResources();
      chatState.currentAgent = newAgent;
      initializeWebSocket();
      onagentswitch?.(newAgent);
    }
  }

  function cleanupResources() {
    wsState.ws?.close();
    wsState.ws = null;
    if (voiceChatState.mediaRecorder) {
      stopVoiceRecording();
      voiceChatState.mediaRecorder = null;
    }
  }

  async function handleSend() {
    if (chatState.message.trim()) {
      await sendMessage(chatState.message.trim(), 'text');
      chatState.message = '';
    }
  }

  async function sendMessage(content: string, type: 'text' | 'voice') {
    if (!wsState.ws?.readyState || wsState.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket connection not available');
      return;
    }

    const messageData = {
      type: 'message',
      content,
      messageType: type,
      timestamp: new Date().toISOString(),
      agent: chatState.currentAgent.id
    };

    try {
      wsState.ws.send(JSON.stringify(messageData));
      onmessage?.(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      onerror?.({ message: 'Failed to send message' });
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function toggleMute() {
    voiceChatState.voiceState.isMuted = !voiceChatState.voiceState.isMuted;
    if (voiceChatState.voiceState.isMuted) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
    onmute?.({ isMuted: voiceChatState.voiceState.isMuted });
  }

  function adjustVolume(value: number) {
    voiceChatState.voiceState.volume = Math.max(0, Math.min(1, value));
    onvolumechange?.({ volume: voiceChatState.voiceState.volume });
  }

  function handleFileUpload(file: File) {
    if (file) {
      onfileupload?.({ file });
    }
  }

  function handleVoiceAssistant() {
    chatState.isVoiceActive = !chatState.isVoiceActive;
    onvoiceassistant?.({ isActive: chatState.isVoiceActive });
  }

  function handleUtilityClick() {
    onutilitiesclick?.();
  }
</script>

<div
  class="chat-footer-container"
  role="complementary"
  aria-label="Chat interface with voice support"
  onmouseenter={() => chatState.showHistory = true}
  onmouseleave={() => chatState.showHistory = false}
>
  {#if chatState.showHistory}
    <div class="chat-history" transition:fade={{ duration: 200 }}>
      {#each chatState.chatHistory as chat}
        <div class="chat-message" class:agent={chat.sender === chatState.currentAgent.name}>
          <div class="message-header">
            <span class="sender">{chat.sender}</span>
            <span class="time">{new Date(chat.timestamp).toLocaleTimeString()}</span>
            {#if chat.messageType === 'voice'}
              <span class="badge">Voice</span>
            {/if}
          </div>
          <p>{chat.content}</p>
        </div>
      {/each}
      {#if chatState.isProcessing}
        <div class="processing-indicator">
          Agent is processing...
        </div>
      {/if}
    </div>
  {/if}

  <div class="chat-footer">
    <div class="agent-selector">
      <select
        value={chatState.currentAgent.id}
        onchange={(e) => switchAgent((e.target as HTMLSelectElement).value)}
      >
        {#each agents as agent}
          <option value={agent.id}>{agent.name}</option>
        {/each}
      </select>
    </div>

    <div class="button-group left">
      <label for="file-upload" class="icon-button" aria-label="Upload file">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
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
        class:active={voiceChatState.voiceState.isListening}
        onclick={toggleMute}
        aria-label={voiceChatState.voiceState.isMuted ? "Unmute" : "Mute"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          {#if voiceChatState.voiceState.isMuted}
            <path d="M1 1l22 22M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/>
          {:else}
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2"/>
          {/if}
        </svg>
      </button>

      {#if voiceEnabled}
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={voiceChatState.voiceState.volume}
          oninput={(e) => adjustVolume(parseFloat((e.target as HTMLInputElement).value))}
          class="volume-slider"
          aria-label="Voice volume"
        />
      {/if}
      
      <button 
        class="icon-button" 
        onclick={handleVoiceAssistant} 
        aria-label={chatState.isVoiceActive ? "Deactivate voice assistant" : "Activate voice assistant"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>

      <button 
        class="icon-button" 
        onclick={handleUtilityClick} 
        aria-label="More options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
      </button>
    </div>

    <textarea
      class="chat-input"
      placeholder="Type a message or speak..."
      bind:value={chatState.message}
      onkeydown={handleKeyDown}
      rows="1"
      disabled={chatState.isProcessing}
      aria-label="Chat message input"
    ></textarea>

    <button
      class="send-button"
      onclick={handleSend}
      disabled={chatState.isProcessing || !chatState.message.trim()}
      aria-label="Send message"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    </button>
  </div>
</div>

<style>
  .chat-footer-container {
    position: relative;
    width: 100%;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .agent-selector {
    margin-right: 1rem;
  }

  .agent-selector select {
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid var(--border-color);
    background: var(--surface-color);
    color: var(--text-color);
  }

  .chat-footer {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 800px;
    background: var(--surface-color);
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  .chat-history {
    position: absolute;
    bottom: calc(100% + 0.5rem);
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    background: var(--surface-color);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .chat-message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: var(--message-bg);
  }

  .chat-message.agent {
    background: var(--agent-message-bg);
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .badge {
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 1rem;
    background: var(--badge-bg);
    color: var(--badge-text);
  }

  .processing-indicator {
    text-align: center;
    padding: 0.5rem;
    color: var(--text-secondary);
    font-style: italic;
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

  .icon-button {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--text-2);
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .icon-button:hover {
    background: rgba(var(--surface-rgb), 0.8);
    color: var(--text);
  }

  .icon-button.active {
    background: rgba(var(--surface-rgb), 0.8);
    color: var(--text);
  }

  .chat-input {
    position: relative;
    max-width: 400px;
    min-width: 200px;
    flex: 1;
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
    border-radius: 0.375rem;
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