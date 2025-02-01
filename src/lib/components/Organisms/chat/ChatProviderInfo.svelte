<script lang="ts">
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';
  import ChatImageCarousel from './ChatImageCarousel.svelte';

  interface Props {
    avatarUrl: string;
    providerDetails: string;
    providerOfferings: string[];
    listingImages: { images: string[]; price: string }[];
  }

  const props = $props();
  const { 
    avatarUrl,
    providerDetails,
    providerOfferings,
    listingImages 
  } = props as Props;

  // Get theme context
  const theme = getContext<ThemeContext>('theme');
</script>

<div class="provider-info">
  <GlassPane variant="light" attentionState="default">
    <div class="header">
      <div class="avatar-container">
        <img src={avatarUrl} alt="Provider Avatar" class="avatar" />
      </div>
      <div class="info">
        <div class="title">
          <Typography size="lg" weight="medium" color="var(--text-1)">Provider Profile</Typography>
        </div>
        <div class="status">
          <div class="status-dot"></div>
          <Typography size="sm" color="var(--color-success)">Available</Typography>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="section">
        <div class="section-title">
          <Typography size="base" weight="medium" color="var(--text-1)">Provider Offerings</Typography>
        </div>
        <div class="details">
          <Typography size="sm" color="var(--text-2)">{providerDetails}</Typography>
        </div>
        <ul class="offerings-list">
          {#each providerOfferings as offering}
            <li>
              <Typography size="sm" color="var(--text-2)">{offering}</Typography>
            </li>
          {/each}
        </ul>
      </div>

      <div class="carousel-section">
        <ChatImageCarousel 
          images={listingImages[0]?.images ?? []} 
          price={listingImages[0]?.price ?? ''} 
        />
      </div>
    </div>
  </GlassPane>
</div>

<style>
  .provider-info {
    padding: var(--spacing-md, 1rem);
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 1rem);
    margin-bottom: var(--spacing-lg, 1.5rem);
  }

  .avatar-container {
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

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xs, 0.25rem);
  }

  .status {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.5rem);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-success);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 1.5rem);
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm, 0.75rem);
  }

  .details {
    line-height: var(--line-height-relaxed, 1.4);
  }

  .offerings-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs, 0.5rem);
  }

  .offerings-list li {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.5rem);
  }

  .offerings-list li:before {
    content: "•";
    color: var(--color-primary);
  }

  .carousel-section {
    margin-top: var(--spacing-md, 1rem);
  }
</style>
