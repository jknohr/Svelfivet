<svelte:options runes={true} />

<script lang="ts">
  import type { Snippet } from 'svelte';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import UIScalingLayout from '$lib/components/Theme/UIScalingLayout.svelte';
  import { slide } from 'svelte/transition';
  import type { LayoutAccessibility } from '../../types';
  import { defaultAccessibility } from '../../types';

  type PanelAction = {
    type: 'expand' | 'collapse' | 'select' | 'scroll';
    data: {
      sectionId?: string;
      scrollPosition?: number;
    };
  };

  type Section = {
    id: string;
    title: string;
    content: string | Snippet;
    icon?: string;
  };

  // Props with fallback values and destructuring
  let {
    title = 'AI Content',
    icon = '',
    expanded = false,
    accessibility = defaultAccessibility,
    sections = [],
    onPanelAction = (action: PanelAction) => {},
    sectionHeader = undefined,
    ...restProps
  } = $props<{
    title?: string;
    icon?: string;
    expanded?: boolean;
    accessibility?: LayoutAccessibility;
    sections?: Section[];
    onPanelAction?: (action: PanelAction) => void;
    sectionHeader?: Snippet<[section: Section]>;
  }>();

  // State
  let activeSection = $state<string | null>(null);
  let scrollPosition = $state(0);
  let contentRef = $state<HTMLElement | null>(null);

  // Derived values using derived.by for complex calculations
  let sectionHeights = $derived.by(() => {
    if (!contentRef) return {};
    return Object.fromEntries(
      sections.map((section: Section) => {
        const el = contentRef?.querySelector(`#section-${section.id}`);
        return [section.id, el?.clientHeight ?? 0];
      })
    );
  });

  // Effects
  $effect(() => {
    if (!expanded) {
      activeSection = null;
      scrollPosition = 0;
    }
  });

  // Use effect.pre for DOM updates that need to happen before render
  $effect.pre(() => {
    if (contentRef && expanded) {
      contentRef.scrollTop = scrollPosition;
    }
  });

  function handleSectionClick(sectionId: string) {
    activeSection = activeSection === sectionId ? null : sectionId;
    onPanelAction({
      type: activeSection ? 'expand' : 'collapse',
      data: { sectionId }
    });
  }

  function handleScroll(event: Event) {
    if (!(event.target instanceof HTMLElement)) return;
    event.preventDefault();
    scrollPosition = event.target.scrollTop;
    onPanelAction({
      type: 'scroll',
      data: { scrollPosition }
    });
  }
</script>

<svelte:boundary>
  <UIScalingLayout>
    <div 
      class="panel-container"
      role={accessibility.aria.role}
      aria-label={accessibility.aria.label}
      class:expanded={expanded}
    >
      <header class="panel-header" id="panel-header">
        <div class="header-content">
          <span class="icon" aria-hidden="true">{icon}</span>
          <h2 class="title">{title}</h2>
        </div>
        {#if expanded}
          <div class="section-count">
            <span class="count">{sections.length}</span>
            <span class="sr-only">sections available</span>
          </div>
        {/if}
      </header>

      {#if expanded}
        <div 
          class="panel-content"
          bind:this={contentRef}
          onscroll={(event: Event) => handleScroll(event)}
          role="tabpanel"
          aria-labelledby="panel-header"
        >
          {#each sections as section (section.id)}
            <GlassPane
              class="section {activeSection === section.id ? 'active' : ''}"
              id="section-{section.id}"
              role="region"
              aria-labelledby="section-header-{section.id}"
            >
              {section.content}
            </GlassPane>
          {/each}
        </div>
      {/if}
    </div>
  </UIScalingLayout>

  {#snippet failed(error, reset)}
    <div class="error-container">
      <p>An error occurred in the content panel</p>
      <button onclick={reset}>Retry</button>
    </div>
  {/snippet}

  {#each sections as section (section.id)}
    {#if sectionHeader}
      {@render sectionHeader(section)}
    {:else}
      <button
        class="section-header"
        id="section-header-{section.id}"
        onclick={(event: MouseEvent) => handleSectionClick(section.id)}
        aria-expanded={activeSection === section.id}
        aria-controls="section-{section.id}"
        role="tab"
        tabindex="0"
        onkeydown={(event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleSectionClick(section.id);
          }
        }}
      >
        {#if section.icon}
          <span class="icon">{section.icon}</span>
        {/if}
        <span class="title">{section.title}</span>
      </button>
    {/if}
    {#if activeSection === section.id}
      <div class="section-content" transition:slide|local>
        {section.content}
      </div>
    {/if}
  {/each}
</svelte:boundary>

<style>
  .panel-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface-background);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--surface-glass);
    border-bottom: 1px solid var(--border-color);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .icon {
    font-size: 1.2em;
  }

  .title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin: 0;
  }

  .panel-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  :global(.section) {
    background: var(--surface-glass);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    transition: background-color 0.2s ease;
  }

  :global(.section:hover) {
    background: var(--surface-glass-hover);
  }

  :global(.section.active) {
    background: var(--surface-glass-active);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    font-size: var(--font-size-md);
    text-align: left;
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--surface-glass-hover);
    }

    &:focus {
      outline: 2px solid var(--focus-ring);
      outline-offset: -2px;
    }
  }

  .section-content {
    padding: var(--spacing-md);
    background: var(--surface-glass);
    border-radius: var(--radius-md);
    margin-top: var(--spacing-sm);
  }

  .section-count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5em;
    height: 1.5em;
    padding: 0 0.5em;
    background: var(--surface-glass-active);
    border-radius: var(--radius-full);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .error-container {
    padding: var(--spacing-md);
    color: var(--text-error);
    text-align: center;
  }
</style>
