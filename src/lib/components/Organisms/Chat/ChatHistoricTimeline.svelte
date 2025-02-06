<script lang="ts">
  import GlassPane from '$lib/components/Theme/GlassPane.svelte';
  import Typography from '$lib/components/Theme/Typography.svelte';
  import type { ThemeContext } from '$lib/components/Theme/Theme.types';
  import { getContext } from 'svelte';

  // Props using Svelte 5 runes
  let {
    speed = $bindable(),
    on = $bindable()
  } = $props<{
    speed: number;
    on: {
      seek: (params: { time: string }) => void;
      play: () => void;
      pause: () => void;
    };
  }>();

  // Get theme context
  const theme = getContext<ThemeContext>('theme');

  // State using Svelte 5 runes
  let timelineWidth = $state(600);
  let currentTime = $state(0);

  // Derived values
  const markerPosition = $derived(`${(currentTime / timelineWidth) * 100}%`);

  // Event handlers
  const handleSeek = (params: { time: string }) => {
    currentTime = Number(params.time);
    on.seek({ time: params.time });
  };

  const handlePlay = () => {
    on.play();
  };

  const handlePause = () => {
    on.pause();
  };
</script>

<div class="timeline-wrapper">
  <GlassPane variant="medium" attentionState="default">
    <div class="timeline-controls">
      <div class="timeline">
        <div class="marker" style={`left: ${markerPosition}`}></div>
        <input 
          type="range" 
          min="0" 
          max="1000" 
          value={currentTime} 
          oninput={(e: Event) => {
            const target = e.target as HTMLInputElement;
            handleSeek({ time: target.value });
          }}
        />
      </div>
      <div class="controls">
        <button onclick={handlePlay}>
          <Typography size="sm" weight="medium">Play</Typography>
        </button>
        <button onclick={handlePause}>
          <Typography size="sm" weight="medium">Pause</Typography>
        </button>
      </div>
    </div>
  </GlassPane>
</div>

<style>
  .timeline-wrapper {
    position: fixed;
    bottom: var(--spacing-lg, 20px);
    left: var(--spacing-lg, 20px);
    width: 600px;
  }

  .timeline-controls {
    position: fixed;
    bottom: var(--spacing-lg, 20px);
    left: var(--spacing-lg, 20px);
    width: 600px;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm, 10px);
  }

  .timeline {
    position: relative;
    width: 100%;
    height: var(--timeline-height, 20px);
    background: var(--surface-2);
    border-radius: var(--radius-lg, 10px);
  }

  .marker {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--marker-width, 4px);
    height: var(--timeline-height, 20px);
    background: var(--accent);
    border-radius: var(--radius-sm, 2px);
  }

  .controls {
    display: flex;
    gap: var(--spacing-sm, 10px);
  }

  button {
    padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
    border: none;
    border-radius: var(--radius-sm, 5px);
    background: var(--accent);
    color: var(--text-on-accent);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity var(--transition-duration, 0.3s) var(--transition-timing, ease);
  }

  button:hover {
    opacity: 1;
  }

  input[type="range"] {
    width: 100%;
    height: var(--timeline-height, 20px);
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: var(--thumb-size, 16px);
    height: var(--thumb-size, 16px);
    background: var(--accent);
    border-radius: 50%;
    cursor: pointer;
    margin-top: calc((var(--timeline-height, 20px) - var(--thumb-size, 16px)) / 2);
  }

  input[type="range"]::-moz-range-thumb {
    width: var(--thumb-size, 16px);
    height: var(--thumb-size, 16px);
    background: var(--accent);
    border: none;
    border-radius: 50%;
    cursor: pointer;
  }
</style>
