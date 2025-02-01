<!--
@component BadgeCounter
A badge counter component for displaying numeric indicators.
Features:
- Numeric display with overflow handling
- Multiple sizes and variants
- Positioning options
- Pulse animation on changes
- Glass effect integration
- Theme system integration
-->
<svelte:options runes={true} />

<script lang="ts">
  import type { BadgeCounterProps } from './BadgeCounter.types';
  import { 
    BADGE_SIZES, 
    BADGE_FONT_SIZES, 
    BADGE_POSITIONS,
    BADGE_VARIANTS 
  } from './BadgeCounter.types';
  import GlassPane from '../../Theme/GlassPane.svelte';
  import Typography from '../../Theme/Typography.svelte';

  // Props
  const props = $props();
  let {
    count,
    max = 99,
    size = 'md',
    variant = 'primary',
    position = 'top-right',
    pulse = true,
    showZero = false
  } = props as BadgeCounterProps;

  // State
  let previousCount = $state(count);
  let shouldPulse = $state(false);

  // Computed display value
  const displayValue = $derived(() => {
    if (count === 0 && !showZero) return '';
    return count > max ? `${max}+` : count.toString();
  });

  // Handle count changes
  $effect(() => {
    if (count !== previousCount && pulse) {
      shouldPulse = true;
      previousCount = count;
      setTimeout(() => {
        shouldPulse = false;
      }, 1000);
    }
  });

  // Get position styles
  function getPositionStyles() {
    const pos = BADGE_POSITIONS[position];
    return Object.entries(pos)
      .map(([key, value]) => `${key}: ${value}`)
      .join(';');
  }
</script>

<GlassPane
  variant="light"
  attentionState={variant === 'error' ? 'error' : variant === 'warning' ? 'attention' : 'default'}
  interactive={false}
  elevated={true}
  glowOnHover={false}
  componentType="status"
>
  <div 
    class="badge"
    class:pulse={shouldPulse}
    class:empty={!displayValue}
    style:width={BADGE_SIZES[size]}
    style:height={BADGE_SIZES[size]}
    style:background={BADGE_VARIANTS[variant]}
    style={getPositionStyles()}
    role="status"
    aria-label={`Count: ${count}`}
  >
    {#if displayValue}
      <Typography
        size={BADGE_FONT_SIZES[size]}
        weight="medium"
        align="center"
        color="var(--color-surface)"
      >
        {displayValue}
      </Typography>
    {/if}
  </div>
</GlassPane>

<style>
  .badge {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--color-surface);
    font-weight: 500;
    line-height: 1;
    z-index: 10;
  }

  .empty {
    display: none;
  }

  .pulse {
    animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1);
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  /* Spatial adjustments */
  @media (--ar) {
    .badge {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-floating));
    }
  }

  @media (--vr) {
    .badge {
      transform-style: preserve-3d;
      transform: translateZ(var(--depth-ui));
    }
  }
</style>
