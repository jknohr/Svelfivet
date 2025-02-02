<script lang="ts">
  import { page } from '$app/stores';
  
  $: path = $page.url.pathname;
  $: segments = path.split('/').filter(Boolean);
</script>

<nav aria-label="breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    {#each segments as segment, i}
      <li>
        <span>/</span>
        <a href={`/${segments.slice(0, i + 1).join('/')}`}>
          {segment}
        </a>
      </li>
    {/each}
  </ol>
</nav>

<style>
  nav {
    color: var(--text-2);
  }

  ol {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;
  }

  a:hover {
    color: var(--primary);
  }
</style>
