<script lang="ts">
  import type { Card } from '$lib/components/common/molecules/cards/card';
  import type { PropertyCardContent } from '$lib/components/common/molecules/cards/cards';
  import { BaseCard } from '$lib/components/common/molecules/cards/base';
  import { PropertyCard } from '$lib/components/context/real-estate/cards';
  import { Button } from '$lib/components/common';
  import { createEventDispatcher } from 'svelte';

  interface PropertyBlogContent {
    title: string;
    author: {
      name: string;
      avatar?: string;
      role?: string;
    };
    publishedAt: string;
    content: string;
    image?: string;
    tags: string[];
    readTime: number;
    likes: number;
    comments: number;
    shares: number;
    // Property-specific fields
    property?: {
      id: string;
      title: string;
      price: number;
      location: string;
      images: string[];
      features: {
        beds: number;
        baths: number;
        sqft: number;
      };
    };
  }

  interface $$Props {
    card: Card & { content: PropertyBlogContent };
    isAdmin?: boolean;
    front?: () => void;
    admin?: () => void;
  }

  let { card, isAdmin = false, front, admin } = $props();

  const dispatch = createEventDispatcher<{
    like: { id: string };
    comment: { id: string };
    share: { id: string };
  }>();

  function handlePropertyView({ id }: { id: string }) {
    // Navigate to property details
  }

  function handlePropertyContact({ id, type }: { id: string; type: 'email' | 'phone' }) {
    // Open contact form for property
  }

  function handlePropertySave({ id, content }: { id: string; content: PropertyCardContent }) {
    // Save property
  }

  function handlePropertyDelete({ id }: { id: string }) {
    // Delete property
  }

  function handleLike() {
    dispatch('like', { id: card.id });
  }

  function handleComment() {
    dispatch('comment', { id: card.id });
  }

  function handleShare() {
    dispatch('share', { id: card.id });
  }

  function formatFeatures(features: { beds: number; baths: number; sqft: number }): string[] {
    return [
      `${features.beds} beds`,
      `${features.baths} baths`,
      `${features.sqft} sqft`
    ];
  }
</script>

<BaseCard {card} {isAdmin}>
  {#snippet front()}
    <article class="property-blog">
      <div class="content">
        <header>
          <div class="meta">
            <div class="author">
              {#if card.content.author.avatar}
                <img 
                  class="avatar" 
                  src={card.content.author.avatar} 
                  alt={card.content.author.name}
                />
              {/if}
              <div class="author-info">
                <span class="name">{card.content.author.name}</span>
                {#if card.content.author.role}
                  <span class="role">{card.content.author.role}</span>
                {/if}
              </div>
            </div>
            <div class="publish-info">
              <time datetime={card.content.publishedAt}>
                {new Date(card.content.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span class="read-time">{card.content.readTime} min read</span>
            </div>
          </div>

          <h1 class="title">{card.content.title}</h1>

          <div class="tags">
            {#each card.content.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        </header>

        <div class="body">
          {@html card.content.content}
        </div>

        {#if card.content.property}
          <div class="property-card">
            <PropertyCard
              card={{
                id: card.content.property.id,
                title: card.content.property.title,
                size: { width: '100%', height: 'auto' },
                content: {
                  type: 'property',
                  title: card.content.property.title,
                  price: card.content.property.price,
                  location: {
                    address: card.content.property.location
                  },
                  images: card.content.property.images,
                  features: formatFeatures(card.content.property.features),
                  contact: {
                    name: card.content.author.name
                  }
                }
              }}
              {isAdmin}
              onContact={handlePropertyContact}
              onView={handlePropertyView}
              onSave={handlePropertySave}
              onDelete={handlePropertyDelete}
            />
          </div>
        {/if}

        <footer>
          <div class="stats">
            <span class="stat">
              <i class="icon-heart"></i>
              {card.content.likes}
            </span>
            <span class="stat">
              <i class="icon-comment"></i>
              {card.content.comments}
            </span>
            <span class="stat">
              <i class="icon-share"></i>
              {card.content.shares}
            </span>
          </div>

          <div class="actions">
            <Button 
              variant="text"
              ariaLabel="Like post"
              tabindex={0}
              ariaDescribedby="like-post-desc"
              ariaExpanded={false}
              ariaHaspopup={false}
              ariaControls=""
              onClick={handleLike}
            >
              Like
            </Button>
            <Button 
              variant="text"
              ariaLabel="Comment on post"
              tabindex={0}
              ariaDescribedby="comment-post-desc"
              ariaExpanded={false}
              ariaHaspopup={false}
              ariaControls=""
              onClick={handleComment}
            >
              Comment
            </Button>
            <Button 
              variant="text"
              ariaLabel="Share post"
              tabindex={0}
              ariaDescribedby="share-post-desc"
              ariaExpanded={false}
              ariaHaspopup={false}
              ariaControls=""
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        </footer>
      </div>
    </article>
  {/snippet}

  {#snippet admin()}
    <div class="admin-view">
      <div class="stats">
        <div class="stat">
          <span class="label">Views</span>
          <span class="value">{card.analytics?.views || 0}</span>
        </div>
        <div class="stat">
          <span class="label">Engagement</span>
          <span class="value">{card.analytics?.interactions || 0}</span>
        </div>
        <div class="stat">
          <span class="label">Shares</span>
          <span class="value">{card.analytics?.conversions || 0}</span>
        </div>
      </div>

      <div class="settings">
        <h4>Post Status</h4>
        <label>
          <input
            type="checkbox"
            checked={card.settings?.isVisible}
            disabled
          />
          Published
        </label>
        <label>
          <input
            type="checkbox"
            checked={card.settings?.isTestable}
            disabled
          />
          Featured
        </label>
      </div>
    </div>
  {/snippet}
</BaseCard>

<style>
  .property-blog {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .author {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .author-info {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-weight: 500;
  }

  .role {
    font-size: 0.875rem;
    color: var(--text-2);
  }

  .publish-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.875rem;
    color: var(--text-2);
  }

  .title {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .tag {
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
  }

 

  .body {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--text-1);
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border);
  }

  .stats {
    display: flex;
    gap: var(--spacing-md);
  }

  .stat {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--text-2);
  }

  .actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .admin-view {
    padding: var(--spacing-lg);
  }

  .admin-view .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .admin-view .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .admin-view .label {
    font-size: 0.875rem;
    color: var(--text-2);
  }

  .admin-view .value {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .settings h4 {
    margin: 0 0 var(--spacing-sm) 0;
  }

  .settings label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
</style> 