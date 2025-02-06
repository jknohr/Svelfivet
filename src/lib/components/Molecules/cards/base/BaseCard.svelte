<!--
@component BaseCard
A base card component that provides a consistent card layout with front and back views using glass morphism effects.
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { Card } from '../card';
  import type { Snippet } from 'svelte';
  import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';

  interface Props {
    card: Card;
    isAdmin?: boolean;
    front?: Snippet;
    admin?: Snippet;
    glassEffect?: GlassEffect;
    glassState?: GlassState;
  }

  let props = $props();
  let { 
    card, 
    isAdmin = false, 
    front, 
    admin,
    glassEffect = 'medium',
    glassState = 'default'
  } = props;

  // Derived state for glass effect based on card type
  let cardGlassEffect = $derived(() => {
    switch (card.type) {
      case 'blog':
        return 'light';
      case 'product':
        return 'medium';
      case 'event':
        return 'heavy';
      default:
        return glassEffect;
    }
  });
</script>

<div class="card-container" class:admin={isAdmin}>
  <GlassPane
    variant={cardGlassEffect}
    attentionState={glassState}
    interactive={true}
    elevated={true}
    glowOnHover={true}
    componentType="article"
  >
    {#snippet children()}
      <div class="card-front">
        {#if front}
          {@render front()}
        {/if}
      </div>
    {/snippet}
  </GlassPane>

  {#if isAdmin && admin}
    <GlassPane
      variant="light"
      attentionState="focus"
      interactive={true}
      elevated={false}
      glowOnHover={true}
      componentType="section"
    >
      {#snippet children()}
        <div class="card-admin">
          {@render admin()}
        </div>
      {/snippet}
    </GlassPane>
  {/if}
</div>

<style>
  .card-container {
    position: relative;
    width: 100%;
  }

  .card-container.admin {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--spacing-md);
  }

  .card-front {
    padding: var(--spacing-lg);
  }

  .card-admin {
    padding: var(--spacing-lg);
  }
</style> 
