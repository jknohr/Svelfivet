<script lang="ts">
  import { getPlatformTheme } from './chatboxtheme';
  import type { PlatformTheme } from './chatboxtheme';
  import type { Conversation, Message, ChatProps } from './types';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';

  const props = $props();

  let platform = $state(props.platform ?? 'default');
  let userId = $state(props.userId ?? '');
  let namespace = $state(props.namespace ?? '');
  let children = $state(props.children);

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  // State using Svelte 5 runes
  let mainTheme = $state<PlatformTheme>();
  let conversations = $state<Record<string, Conversation[]>>({});
  let highValueInterests = $state<Array<{
    providerId: string;
    interest_points: number;
    platform: string;
  }>>([]);
  let allMessages = $state<Message[]>([]);

  // Effects
  $effect(() => {
    mainTheme = getPlatformTheme(platform);
  });

  async function loadHighValueInterests() {
    if (!userId || !namespace) return;
    
    try {
      const query = `
        SELECT providerId, interest_points, platform 
        FROM realestate_user_profile 
        WHERE userId = ${userId} 
        AND namespace = ${namespace}
        AND interest_points > 0
        ORDER BY interest_points DESC;
      `;

      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error('Failed to load interests');
      highValueInterests = await response.json();

      await Promise.all(
        highValueInterests.map(interest => loadProviderConversations(interest.providerId, interest.platform))
      );

      // After loading all conversations, combine and sort all messages
      updateAllMessages();
    } catch (err) {
      console.error('Error loading high-value interests:', err);
    }
  }

  async function loadProviderConversations(providerId: string, platform: string) {
    try {
      const query = `
        SELECT *
        FROM conversation
        WHERE (userId = ${userId} AND providerId = ${providerId})
        OR (userId = ${providerId} AND providerId = ${userId})
        ORDER BY timestamp DESC;
      `;

      const response = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) throw new Error('Failed to load provider conversations');
      conversations[providerId] = await response.json();
    } catch (err) {
      console.error(`Error loading conversations for provider ${providerId}:`, err);
    }
  }

  function updateAllMessages() {
    const newMessages: Message[] = [];
    
    for (const interest of highValueInterests) {
      const providerConvos = conversations[interest.providerId] || [];
      
      for (const convo of providerConvos) {
        const transcript = convo.transcript?.split('\n') || [];
        const responses = convo.response?.split('\n') || [];

        transcript.forEach((msg: string, i: number) => {
          if (msg.trim()) {
            newMessages.push({
              content: msg,
              isResponse: false,
              timestamp: new Date(convo.timestamp),
              providerId: interest.providerId,
              platform: interest.platform
            });
          }
          if (responses[i]?.trim()) {
            newMessages.push({
              content: responses[i],
              isResponse: true,
              timestamp: new Date(convo.timestamp),
              providerId: interest.providerId,
              platform: interest.platform
            });
          }
        });
      }
    }

    // Sort all messages by timestamp
    newMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    allMessages = newMessages;
  }

  $effect(() => {
    loadHighValueInterests();
  });
</script>

<div class="chat-box">
  <GlassPane variant="medium" attentionState="default">
    <div class="messages">
      {#each allMessages as message}
        {@const msgTheme = getPlatformTheme(message.platform)}
        <div class={`message ${message.isResponse ? 'response' : ''}`}>
          <GlassPane 
            variant={message.isResponse ? "dark" : "light"}
            attentionState="default"
            interactive={false}
          >
            <div class="message-content">
              <Typography size="base" weight="regular">{message.content}</Typography>
            </div>
            <div class="message-time">
              <Typography size="xs" weight="regular" color="var(--text-secondary)">{message.timestamp.toLocaleTimeString()}</Typography>
            </div>
          </GlassPane>
        </div>
      {/each}
    </div>
    <div class="chat-bubble-container">
      {@render children?.()}
    </div>
  </GlassPane>
</div>

<style>
  .chat-box {
    padding: var(--spacing-md, 1rem);
    border-radius: var(--radius-lg, 10px);
    margin: var(--spacing-xs, 0.5rem) 0;
    transition: var(--transition-all);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.5rem);
    margin-bottom: var(--spacing-md, 1rem);
  }

  .message {
    max-width: 80%;
    word-break: break-word;
    transition: var(--transition-all);
  }

  .message.response {
    margin-left: auto;
  }

  .message-content {
    line-height: var(--line-height-relaxed, 1.4);
  }

  .message-time {
    margin-top: var(--spacing-2xs, 0.25rem);
    text-align: right;
    opacity: 0.7;
  }

  .chat-bubble-container {
    flex-shrink: 0;
  }
</style>
