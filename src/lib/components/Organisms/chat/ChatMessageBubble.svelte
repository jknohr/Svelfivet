
### ChatMessageBubble.svelte

```svelte
<script lang="ts">
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';
  import { PlatformThemes } from './chatboxtheme';
  
  let { 
    platform = $bindable('default'),
    message = $bindable(''),
    user = $bindable(''),
    avatarUrl = $bindable(''),
    timestamp = $bindable(new Date().toISOString())
  } = $props<{
    platform?: string;
    message: string;
    user: string;
    avatarUrl: string;
    timestamp?: string;
  }>();

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  // Derived platform theme
  const platformTheme = $derived(PlatformThemes[platform] || PlatformThemes['default']);
</script>

<GlassPane variant="light" attentionState="default">
  <div class="chat-bubble">
    <div class="header">
      <img src={avatarUrl} alt={user} class="avatar" />
      <Typography size="sm" weight="medium" class="user-name">{user}</Typography>
    </div>
    
    <Typography size="base" class="message-content">{message}</Typography>
    
    <div class="footer">
      <Typography size="xs" class="timestamp">
        {new Date(timestamp).toLocaleTimeString()}
      </Typography>
    </div>
  </div>
</GlassPane>

<style>
  .chat-bubble {
    padding: var(--spacing-md, 0.75rem);
    border-radius: var(--radius-lg, 10px);
    width: 100%;
    box-sizing: border-box;
    transition: var(--transition-all);
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.5rem);
    margin-bottom: var(--spacing-xs, 0.5rem);
  }

  .avatar {
    width: var(--avatar-size, 24px);
    height: var(--avatar-size, 24px);
    border-radius: 50%;
    object-fit: cover;
  }

  .message-content {
    margin: 0;
    line-height: var(--line-height-relaxed, 1.4);
    word-break: break-word;
  }

  .footer {
    margin-top: var(--spacing-xs, 0.5rem);
    opacity: 0.7;
  }

  :global(.user-name) {
    color: var(--text-primary);
  }

  :global(.timestamp) {
    color: var(--text-secondary);
  }
</style>

