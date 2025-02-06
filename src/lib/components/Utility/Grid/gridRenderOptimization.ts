// /src/lib/utils/renderOptimization.ts
import { writable } from 'svelte/store';

/**
 * Render optimization utilities for DynamicGrid component
 */

type RenderTask = () => void;

export interface RenderOptimizationConfig {
  debounce?: number;
  batchSize?: number;
}

/**
 * Creates a render optimization manager that batches and debounces updates
 */
export function optimizeGridRenders(config: RenderOptimizationConfig = {}) {
  const { 
    debounce = 16, // Default to roughly one frame
    batchSize = 10 
  } = config;

  let batch: RenderTask[] = [];
  let timeoutId: number | null = null;

  function enqueue(task: RenderTask): void {
    batch.push(task);
    
    if (batch.length >= batchSize) {
      flush();
    } else if (!timeoutId) {
      timeoutId = window.setTimeout(flush, debounce);
    }
  }

  function flush(): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    const tasks = [...batch];
    batch = [];

    // Execute all tasks in the current batch
    tasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.error('Error executing render task:', error);
      }
    });
  }

  function clear(): void {
    batch = [];
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  return {
    enqueue,
    flush,
    clear
  };
}