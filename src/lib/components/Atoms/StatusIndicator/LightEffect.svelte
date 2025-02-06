<script lang="ts">
  import { onMount } from 'svelte';
  import { createLightMotion, type LightMotion } from './lightEffects';
  
  let { children } = $props<{
    children: any
  }>();
  
  let effect = $state('spotlight');
  let motionType = $state('spring');
  let interactive = $state(false);
  let intensity = $state(0.5);
  let motion = $state<LightMotion | null>(null);
  let mounted = $state(false);
  let ripples = $state<LightMotion[]>([]);
  
  onMount(() => {
    motion = createLightMotion(motionType);
    mounted = true;
  });

  function handleMouseMove(event: MouseEvent) {
    if (!interactive || !motion) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    motion.x.set(x);
    motion.y.set(y);
    motion.opacity.set(0.8);
    motion.scale.set(1.2);
  }

  function handleMouseLeave() {
    if (!motion) return;
    motion.opacity.set(0.5);
    motion.scale.set(1);
    motion.x.set(50);
    motion.y.set(50);
  }

  // Breathing effect using tweened store
  $effect.root(() => {
    if (mounted && effect === 'breathing' && motion) {
      const breathe = async () => {
        while (true) {
          await motion?.opacity.set(0.8, { duration: 2000 });
          await motion?.opacity.set(0.3, { duration: 2000 });
        }
      };
      breathe();
    }
  });

  // Ripple effect using spring
  function createRipple(x: number, y: number) {
    const rippleMotion = createLightMotion('spring');
    rippleMotion.scale.set(2, { hard: false });
    rippleMotion.opacity.set(0, { duration: 1000 });
    rippleMotion.x.set(x);
    rippleMotion.y.set(y);
    return rippleMotion;
  }
  
  function handleClick(event: MouseEvent) {
    if (effect !== 'ripple') return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    const ripple = createRipple(x, y);
    ripples = [...ripples, ripple];
    
    // Clean up ripple after animation
    setTimeout(() => {
      ripples = ripples.filter(r => r !== ripple);
    }, 1000);
  }
</script>

<div
  class="light-effect {effect}"
  class:interactive
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
>
  {#if mounted && motion}
    <div
      class="light"
      style="
        --x: {motion.x}%;
        --y: {motion.y}%;
        --opacity: {motion.opacity};
        --scale: {motion.scale};
      "
    />
    
    {#if effect === 'ripple'}
      {#each ripples as ripple}
        <div
          class="ripple"
          style="
            --x: {ripple.x}%;
            --y: {ripple.y}%;
            --opacity: {ripple.opacity};
            --scale: {ripple.scale};
          "
        />
      {/each}
    {/if}
  {/if}
  {@render children()}
</div>

<style>
  .light-effect {
    position: relative;
    overflow: hidden;
  }

  .light {
    position: absolute;
    inset: 0;
    pointer-events: none;
    transform: translate(
      calc(var(--x) - 50%),
      calc(var(--y) - 50%)
    ) scale(var(--scale));
    opacity: var(--opacity);
  }

  .ripple {
    position: absolute;
    inset: 0;
    pointer-events: none;
    transform: translate(
      calc(var(--x) - 50%),
      calc(var(--y) - 50%)
    ) scale(var(--scale));
    opacity: var(--opacity);
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.8) 0%,
      transparent 70%
    );
  }

  /* Effect-specific styles */
  .light-effect.spotlight .light {
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.8) 0%,
      transparent 70%
    );
  }

  .light-effect.godrays .light {
    background: repeating-linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 2%,
      transparent 4%
    );
    animation: slide 3s linear infinite;
  }

  @keyframes slide {
    from { background-position: 0 0; }
    to { background-position: 100px 0; }
  }
</style>
