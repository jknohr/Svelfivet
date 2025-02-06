<!-- UserProfile.svelte -->
<svelte:options runes />

<script lang="ts">
  // Importing $effect is implicit via runes (or from 'svelte/state' if needed)
  import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
  import NavigationDivider from '$lib/components/Utility/Navigation/NavigationDivider.svelte';
  import { BASE } from '$lib/components/Theme/SpatialDesign';

  // Reactive state using runes:
  let pageTitle = $state('User Profile');
  let isActive = $state(false);
  let contentElement: HTMLElement;

  // Scroll to section helper:
  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Side effect: attach scroll listener once contentElement is set.
  $effect(() => {
    if (!contentElement) return;
    function handleScroll() {
      // Optionally update reactive state based on scrolling.
    }
    contentElement.addEventListener('scroll', handleScroll);
    return () => contentElement.removeEventListener('scroll', handleScroll);
  });
</script>

<BaseContentLayout
  spatialConfig={BASE}
  dimensions={{
    leftSidebarWidth: '250px',
    mainContentWidth: 'auto'
  }}
  mainContent={() => (
  <div class="content-wrapper">
    <NavigationDivider 
      currentSection={pageTitle}
      sections={[{ id: 'profile', label: 'Profile', icon: 'person' }]}
      onSectionClick={scrollToSection}
    />
    <div class="user-content" bind:this={contentElement}>
      <section id="profile">
        <h1>User Profile</h1>
        <div class="profile-details">
          <h3>User Information</h3>
          <p>Name: John Doe</p>
          <p>Email: john.doe@example.com</p>
          <p>Role: Administrator</p>
        </div>
        <div class="profile-actions">
          <button onclick={() => isActive = !isActive}>
            {isActive ? 'Deactivate' : 'Activate'} Account
          </button>
        </div>
      </section>
    </div>
  </div>
{/snippet}
  )
{#snippet leftPanel()}
  <div class="left-panel">
    <h3>Quick Navigation</h3>
    <nav>
      <ul>
        <li 
          class:active={pageTitle === 'Profile'}
          onclick={() => scrollToSection('profile')}
        >
          <span class="material-icons">person</span>
          <span>Profile</span>
        </li>
      </ul>
    </nav>
  </div>
{/snippet}

<BaseContentLayout
  spatialConfig={BASE}
  dimensions={{
    leftSidebarWidth: '250px',
    mainContentWidth: 'auto'
  }}
  mainContent={mainContent}
  leftComponent={leftPanel}
/>

<style>
  .content-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .user-content {
    flex: 1;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: var(--spacing-md);
  }
  section {
    margin-bottom: var(--spacing-xl);
  }
  .profile-details {
    margin: var(--spacing-lg) 0;
    padding: var(--spacing-lg);
    background: var(--surface-background);
    border-radius: var(--radius-md);
  }
  .profile-actions {
    margin-top: var(--spacing-md);
  }
  .profile-actions button {
    padding: var(--spacing-sm) var(--spacing-xl);
    background: var(--primary);
    color: var(--surface);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: var(--fontWeight-medium);
    cursor: pointer;
    transition: all var(--duration-fast) var(--easing-standard);
  }
  .profile-actions button:hover {
    background: var(--states-focus);
  }
  :global(.left-panel) {
    padding: var(--spacing-sm);
  }
  :global(.left-panel) nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    position: sticky;
    top: var(--spacing-md);
  }
  :global(.left-panel) nav ul li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }
  :global(.left-panel) nav ul li:hover {
    background: var(--surface-hover);
  }
  :global(.left-panel) nav ul li.active {
    background: var(--primary-container);
    color: var(--on-primary-container);
  }
  :global(.left-panel) nav ul li .material-icons {
    font-size: 1.25rem;
  }
</style>