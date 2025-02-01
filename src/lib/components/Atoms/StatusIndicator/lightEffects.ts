import { spring, tweened } from 'svelte/motion';
import { cubicOut, elasticOut } from 'svelte/easing';
import type { Spring, Tweened } from 'svelte/motion';

export type LightMotion = {
  opacity: Spring<number> | Tweened<number>;
  scale: Spring<number>;
  x: Spring<number>;
  y: Spring<number>;
};

export function createLightMotion(type: 'spring' | 'tween' = 'spring'): LightMotion {
  return {
    opacity: type === 'spring' 
      ? spring(0.5, { stiffness: 0.1, damping: 0.4 })
      : tweened(0.5, { duration: 400, easing: cubicOut }),
    scale: spring(1, { stiffness: 0.1, damping: 0.6 }),
    x: spring(50, { stiffness: 0.2, damping: 0.7 }),
    y: spring(50, { stiffness: 0.2, damping: 0.7 })
  };
}