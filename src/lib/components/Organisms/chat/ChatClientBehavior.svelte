<script lang="ts">
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';

  interface Props {
    behavioralStatus: string;
  }

  const props = $props();
  const { behavioralStatus } = props as Props;

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  let statusClass = $state(`status-${behavioralStatus?.toLowerCase() ?? 'neutral'}`);
  let statusColor = $state('var(--text-2)');

  $effect(() => {
    statusClass = `status-${behavioralStatus?.toLowerCase() ?? 'neutral'}`;
    switch (behavioralStatus?.toLowerCase()) {
      case 'active':
        statusColor = 'var(--color-success)';
        break;
      case 'away':
        statusColor = 'var(--color-warning)';
        break;
      case 'busy':
        statusColor = 'var(--color-error)';
        break;
      default:
        statusColor = 'var(--text-2)';
    }
  });
</script>

<div class="client-behavior">
  <GlassPane variant="light" attentionState="default">
    <div class={`status-indicator ${statusClass}`} title={behavioralStatus}>
      <div class="status-dot" style="background-color: {statusColor}"></div>
      <div class="status-text">
        <Typography size="sm" weight="medium" color={statusColor}>
          {behavioralStatus}
        </Typography>
      </div>
    </div>
  </GlassPane>
</div>

<style>
  .client-behavior {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm, 0.5rem);
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs, 0.5rem);
    padding: var(--spacing-2xs, 0.25rem) var(--spacing-sm, 0.75rem);
    border-radius: var(--radius-full, 1rem);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .status-text {
    text-transform: capitalize;
  }
</style>
