<script lang="ts">
import type { BlogPost } from '$lib/types/blog';

let {
  post,
  isPreview = false
} = $props<{
  post: BlogPost;
  isPreview?: boolean;
}>();

// Format date to readable string
let formattedDate = $derived(() => {
  const date = new Date(post.publishedAt);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
});
</script>

<article class="blog-post" class:preview={isPreview}>
  {#if post.coverImage}
    <img 
      src={post.coverImage} 
      alt={post.title}
      class="cover-image"
    />
  {/if}
  
  <div class="content">
    <header>
      {#if post.category}
        <div class="category">{post.category}</div>
      {/if}
      <h1 class="title">
        {#if isPreview}
          <a href="/blog/{post.slug}">{post.title}</a>
        {:else}
          {post.title}
        {/if}
      </h1>
      <div class="meta">
        {#if post.author}
          <div class="author">
            {#if post.author.avatar}
              <img src={post.author.avatar} alt={post.author.name} class="avatar" />
            {/if}
            <span>{post.author.name}</span>
          </div>
        {/if}
        <time datetime={post.publishedAt}>{formattedDate}</time>
      </div>
    </header>

    {#if isPreview}
      <p class="excerpt">{post.excerpt}</p>
      <a href="/blog/{post.slug}" class="read-more">
        Read more
        <span class="material-icons-outlined">arrow_forward</span>
      </a>
    {:else}
      <div class="body">
        {@html post.content}
      </div>
    {/if}
  </div>
</article>

<style>
  .blog-post {
    background: var(--surface-1);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .blog-post.preview {
    transition: transform 0.2s ease;
  }

  .blog-post.preview:hover {
    transform: translateY(-4px);
  }

  .cover-image {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .content {
    padding: var(--spacing-lg);
  }

  .category {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-sm);
    background: var(--primary);
    color: white;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    margin-bottom: var(--spacing-sm);
  }

  .title {
    margin: 0 0 var(--spacing-md);
    font-size: 1.75rem;
    line-height: 1.3;
    color: var(--text-1);
  }

  .title a {
    color: inherit;
    text-decoration: none;
  }

  .title a:hover {
    color: var(--primary);
  }

  .meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    color: var(--text-2);
    font-size: 0.875rem;
    margin-bottom: var(--spacing-lg);
  }

  .author {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .excerpt {
    color: var(--text-2);
    margin-bottom: var(--spacing-md);
    line-height: 1.6;
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
  }

  .read-more:hover {
    text-decoration: underline;
  }

  .body {
    line-height: 1.8;
    color: var(--text-1);
  }

  .body :global(h2) {
    margin: var(--spacing-xl) 0 var(--spacing-md);
    font-size: 1.5rem;
    color: var(--text-1);
  }

  .body :global(p) {
    margin-bottom: var(--spacing-md);
  }

  .body :global(img) {
    max-width: 100%;
    border-radius: var(--radius-md);
    margin: var(--spacing-lg) 0;
  }

  .body :global(blockquote) {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-md) var(--spacing-lg);
    border-left: 4px solid var(--primary);
    background: var(--surface-2);
    font-style: italic;
  }

  .body :global(pre) {
    background: var(--surface-2);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    overflow-x: auto;
    margin: var(--spacing-lg) 0;
  }

  .body :global(code) {
    font-family: monospace;
    font-size: 0.9em;
  }
</style> 