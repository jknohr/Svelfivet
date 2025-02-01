<script lang="ts">
  import ChatClientBehavior from './ChatClientBehavior.svelte';
  import ChatClientWishes from './ChatClientWishes.svelte';
  import ListingPreview from './ListingPreview.svelte';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';

  interface Props {
    avatarUrl: string;
    goal: string;
    requirements: string;
    softWants: string[];
    hardWants: string[];
    dontWants: string[];
    behavioralStatus: string;
    listings: { images: string[]; price: string; }[];
  }

  const props = $props();
  const { 
    avatarUrl,
    goal,
    requirements,
    softWants,
    hardWants,
    dontWants,
    behavioralStatus,
    listings 
  } = props as Props;

  // Get theme context
  const theme = getContext<ThemeContext>('theme');
</script>

<GlassPane variant="medium" attentionState="default" class="client-info">
  <GlassPane variant="light" attentionState="default" class="header">
    <div class="avatar-container">
      <div class="avatar-wrapper">
        <img src={avatarUrl} alt="Client Avatar" class="avatar" />
      </div>
      <ChatClientBehavior {behavioralStatus} />
    </div>
  </GlassPane>

  <div class="content">
    <ChatClientWishes
      {goal}
      {requirements}
      {softWants}
      {hardWants}
      {dontWants}
    />
  </div>

  {#if listings?.length}
    <GlassPane variant="light" attentionState="default" class="footer">
      <ListingPreview {listings} detailed={true} />
    </GlassPane>
  {/if}
</GlassPane>

<style>
  .client-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
    max-width: 800px;
    margin: 0 auto;
  }

  .header {
    padding: var(--spacing-md, 1rem);
  }

  .avatar-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 1rem);
  }

  .avatar-wrapper {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--surface-3);
  }

  .avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .content {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--spacing-md, 1rem);
  }

  .footer {
    padding: var(--spacing-md, 1rem);
  }

  @media (max-width: 768px) {
    .client-info {
      border-radius: 0;
      height: 100vh;
    }
  }
</style>
