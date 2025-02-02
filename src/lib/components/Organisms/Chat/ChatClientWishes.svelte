<script lang="ts">
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';

  interface Props {
    goal: string;
    requirements: string;
    softWants: string[];
    hardWants: string[];
    dontWants: string[];
  }

  const props = $props();
  const { 
    goal,
    requirements,
    softWants,
    hardWants,
    dontWants 
  } = props as Props;

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  // Derived values for display
  const shortGoal = $derived(goal?.split(' ').slice(0, 5).join(' ') + '...');
</script>

<div class="client-wishes">
  <div class="goal-section">
    <div class="goal-label">
      <Typography size="sm" weight="medium" color="var(--text-2)">Goal</Typography>
    </div>
    <div class="goal-text" title={goal}>
      <Typography size="base" color="var(--text-1)">{shortGoal}</Typography>
    </div>
  </div>

  <div class="wishes-grid">
    <div class="wish-category">
      <GlassPane variant="light" attentionState="default">
        <div class="category-title">
          <Typography size="xs" weight="medium" color="var(--text-2)">Needs</Typography>
        </div>
        <div class="wish-content">
          {#if requirements}
            <Typography size="sm">{requirements}</Typography>
          {:else}
            <div class="empty">
              <Typography size="sm" color="var(--text-3)">No needs specified</Typography>
            </div>
          {/if}
        </div>
      </GlassPane>
    </div>

    <div class="wish-category">
      <GlassPane variant="light" attentionState="default">
        <div class="category-title">
          <Typography size="xs" weight="medium" color="var(--text-2)">
            Wants ({softWants?.length ?? 0})
          </Typography>
        </div>
        <div class="wish-content">
          {#if softWants?.length}
            <ul>
              {#each softWants as want}
                <li>
                  <Typography size="sm">{want}</Typography>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="empty">
              <Typography size="sm" color="var(--text-3)">No wants specified</Typography>
            </div>
          {/if}
        </div>
      </GlassPane>
    </div>

    <div class="wish-category">
      <GlassPane variant="light" attentionState="default">
        <div class="category-title">
          <Typography size="xs" weight="medium" color="var(--text-2)">
            Must Have ({hardWants?.length ?? 0})
          </Typography>
        </div>
        <div class="wish-content">
          {#if hardWants?.length}
            <ul>
              {#each hardWants as want}
                <li>
                  <Typography size="sm">{want}</Typography>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="empty">
              <Typography size="sm" color="var(--text-3)">No must-haves specified</Typography>
            </div>
          {/if}
        </div>
      </GlassPane>
    </div>

    <div class="wish-category">
      <GlassPane variant="light" attentionState="default">
        <div class="category-title">
          <Typography size="xs" weight="medium" color="var(--text-2)">
            Deal Breakers ({dontWants?.length ?? 0})
          </Typography>
        </div>
        <div class="wish-content">
          {#if dontWants?.length}
            <ul>
              {#each dontWants as want}
                <li>
                  <Typography size="sm">{want}</Typography>
                </li>
              {/each}
            </ul>
          {:else}
            <div class="empty">
              <Typography size="sm" color="var(--text-3)">No deal breakers specified</Typography>
            </div>
          {/if}
        </div>
      </GlassPane>
    </div>
  </div>
</div>

<style>
  .client-wishes {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
    padding: var(--spacing-md, 1rem);
  }

  .goal-section {
    border-bottom: 1px solid var(--surface-3);
    padding-bottom: var(--spacing-xs, 0.5rem);
  }

  .goal-label {
    margin-bottom: var(--spacing-2xs, 0.25rem);
  }

  .goal-text {
    line-height: var(--line-height-relaxed, 1.4);
  }

  .wishes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md, 1rem);
  }

  .wish-category {
    padding: var(--spacing-sm, 0.75rem);
  }

  .category-title {
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-xs, 0.5rem);
  }

  .wish-content {
    margin-top: var(--spacing-xs, 0.5rem);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: var(--spacing-2xs, 0.25rem) 0;
    display: flex;
    align-items: center;
  }

  li:before {
    content: "•";
    color: var(--color-primary);
    margin-right: var(--spacing-xs, 0.5rem);
  }

  .empty {
    font-style: italic;
  }
</style>
