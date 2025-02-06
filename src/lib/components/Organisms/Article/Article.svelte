<!--
@component Article
A blog post article component with admin view support.
Features:
- Rich content display
- Author information
- Social interactions
- Admin analytics
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { Card } from '$lib/components/Molecules/cards/card';
  import { BaseCard } from '$lib/components/Molecules/cards/base';
  import { Button } from '$lib/components/Utility';

  interface BlogPostContent {
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
  }

  interface Props {
    card: Card & { content: BlogPostContent };
    isAdmin?: boolean;
  }

  // Props
  let props = $props();
  let { card, isAdmin = false } = props;

  // State
  let likes = $state(card.content.likes);
  let comments = $state(card.content.comments);
  let shares = $state(card.content.shares);

  // Derived values
  let totalEngagement = $derived(likes + comments + shares);
  let engagementRate = $derived(
    ((totalEngagement / (card.analytics?.views || 1)) * 100).toFixed(1)
  );

  // Event handlers
  function handleLike() {
    likes++;
    dispatchEvent(new CustomEvent('like', { 
      detail: { id: card.id, engagement: totalEngagement },
      bubbles: true,
      composed: true
    }));
  }

  function handleComment() {
    comments++;
    dispatchEvent(new CustomEvent('comment', { 
      detail: { id: card.id },
      bubbles: true,
      composed: true
    }));
  }

  function handleShare() {
    shares++;
    dispatchEvent(new CustomEvent('share', { 
      detail: { id: card.id },
      bubbles: true,
      composed: true
    }));
  }

  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Effects
  $effect(() => {
    // Sync state with props when they change
    likes = card.content.likes;
    comments = card.content.comments;
    shares = card.content.shares;
  });
</script>

<BaseCard {card} {isAdmin}>
  {#snippet front()}
    <article class="blog-post">
      {#if card.content.image}
        <div class="cover-image">
          <img src={card.content.image} alt={card.content.title} />
        </div>
      {/if}

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
                {formatDate(card.content.publishedAt)}
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

        <footer>
          <div class="stats">
            <span class="stat">
              <i class="icon-heart"></i>
              {likes}
            </span>
            <span class="stat">
              <i class="icon-comment"></i>
              {comments}
            </span>
            <span class="stat">
              <i class="icon-share"></i>
              {shares}
            </span>
          </div>

          <div class="actions">
            <Button 
              variant="text"
              ariaLabel="Like post"
              tabindex={0}
              ariaDescribedby="like-post-desc"
              onclick={handleLike}
            >
              {#snippet content()}
                Like
              {/snippet}
            </Button>
            <Button 
              variant="text"
              ariaLabel="Comment on post"
              tabindex={0}
              ariaDescribedby="comment-post-desc"
              onclick={handleComment}
            >
              {#snippet content()}
                Comment
              {/snippet}
            </Button>
            <Button 
              variant="text"
              ariaLabel="Share post"
              tabindex={0}
              ariaDescribedby="share-post-desc"
              onclick={handleShare}
            >
              {#snippet content()}
                Share
              {/snippet}
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
          <span class="value">{totalEngagement}</span>
          <span class="rate">({engagementRate}%)</span>
        </div>
        <div class="stat">
          <span class="label">Shares</span>
          <span class="value">{shares}</span>
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
  .blog-post {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .cover-image {
    width: 100%;
    height: 300px;
    overflow: hidden;
    border-radius: var(--radius-lg);
  }

  .cover-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

  .admin-view .rate {
    font-size: 0.875rem;
    color: var(--text-2);
    margin-left: var(--spacing-xs);
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
