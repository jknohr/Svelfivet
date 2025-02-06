<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Spring } from 'svelte/motion';
  import { calculateRayPaths } from './raytracing';
  
  interface Ray {
    startX: number;
    startY: number;
    angle: number;
    intensity: number;
    color: string;
  }

  interface GridCell {
    x: number;
    y: number;
    opacity: number;
    elevation: number;
  }

  export let gridSize = { columns: 12, rows: 12 };
  export let rayCount = 5;
  export let rayColor = 'rgba(255, 255, 255, 0.15)';
  export let shadowColor = 'rgba(0, 0, 0, 0.2)';
  export let interactive = true;
  
  let container: HTMLElement;
  let rays: Ray[] = [];
  let gridCells: GridCell[] = [];
  let paths: string[] = [];
  let shadows: string[] = [];
  
  // Spring animations for ray properties
  let springX = new Spring(0, { stiffness: 0.1, damping: 0.6 });
  let springY = new Spring(0, { stiffness: 0.1, damping: 0.6 });
  let springAngle = new Spring(0, { stiffness: 0.05, damping: 0.7 });

  // Track grid elements
  function updateGridCells() {
    const elements = container?.querySelectorAll('[data-glass-element]') || [];
    gridCells = Array.from(elements).map(el => {
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      return {
        x: (rect.left - containerRect.left) / containerRect.width * gridSize.columns,
        y: (rect.top - containerRect.top) / containerRect.height * gridSize.rows,
        opacity: parseFloat(getComputedStyle(el).opacity),
        elevation: parseFloat(getComputedStyle(el).getPropertyValue('--elevation') || '0')
      };
    });
  }

  // Create and update rays
  function updateRays(mouseX?: number, mouseY?: number) {
    if (mouseX !== undefined && mouseY !== undefined) {
      springX.set(mouseX);
      springY.set(mouseY);
      
      const centerX = container.clientWidth / 2;
      const centerY = container.clientHeight / 2;
      const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
      springAngle.set(angle);
    }
    
    rays = Array.from({ length: rayCount }, (_, i) => ({
      startX: $springX,
      startY: $springY,
      angle: $springAngle + (Math.PI * 2 * i / rayCount),
      intensity: 1,
      color: rayColor
    }));
    
    const { paths: newPaths, shadows: newShadows } = calculateRayPaths(rays, gridCells, gridSize);
    paths = newPaths;
    shadows = newShadows;
  }

  // Handle mouse movement
  function handleMouseMove(event: MouseEvent) {
    if (!interactive) return;
    const rect = container.getBoundingClientRect();
    updateRays(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  }

  // Setup and cleanup
  onMount(() => {
    const resizeObserver = new ResizeObserver(updateGridCells);
    resizeObserver.observe(container);
    
    // Initial ray position
    updateRays(
      container.clientWidth / 2,
      container.clientHeight / 2
    );
    
    return () => resizeObserver.disconnect();
  });
</script>

<div 
  class="ray-tracer"
  bind:this={container}
  role="presentation"
  onmousemove={handleMouseMove}
>
  <svg class="rays" preserveAspectRatio="none">
    <!-- Shadows -->
    {#each shadows as shadow}
      <path 
        d={shadow} 
        fill="none" 
        stroke={shadowColor}
        stroke-width="1"
        filter="url(#shadow-blur)"
      />
    {/each}
    
    <!-- Light Rays -->
    {#each paths as path, i}
      <path 
        d={path} 
        fill="none" 
        stroke={rayColor}
        stroke-width="2"
        stroke-opacity={rays[i]?.intensity || 1}
        filter="url(#ray-glow)"
      />
    {/each}
    
    <!-- SVG Filters -->
    <defs>
      <filter id="ray-glow">
        <feGaussianBlur stdDeviation="2" />
        <feComposite operator="over" in="SourceGraphic" />
      </filter>
      
      <filter id="shadow-blur">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  </svg>
  
  <slot />
</div>

<style>
  .ray-tracer {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .rays {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }
</style>
