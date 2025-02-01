/**
 * Theme Animation System
 * Centralized animation configurations and utilities
 */

// Animation Timing
export interface AnimationTiming {
  duration: string;
  easing: string;
  delay?: string;
}

// Basic Animation Types
export type AnimationType = 
  | 'fade'
  | 'slide'
  | 'scale'
  | 'rotate'
  | 'blur'
  | 'glow'
  | 'bounce'
  | 'elastic'
  | 'spring'
  | 'pulse';

// Animation Direction
export type AnimationDirection = 
  | 'in'
  | 'out'
  | 'up'
  | 'down'
  | 'left'
  | 'right';

// Easing Functions
export const EASING = {
  // Standard
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Custom Bezier Curves
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',

  // Spring Physics
  spring: 'cubic-bezier(0.5, 1.5, 0.8, 0.9)',
  bounce: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;

// Duration Presets
export const DURATION = {
  instant: '0ms',
  ultraFast: '50ms',
  faster: '100ms',
  fast: '150ms',
  normal: '300ms',
  slow: '450ms',
  slower: '600ms',
  ultraSlow: '1000ms'
} as const;

// Animation State
interface AnimationState {
  isAnimating: ReturnType<typeof $state<boolean>>;
  progress: ReturnType<typeof $state<number>>;
  currentPhase: ReturnType<typeof $state<'enter' | 'active' | 'exit' | 'none'>>;
}

// Animation Preset
export interface AnimationPreset {
  timing: AnimationTiming;
  keyframes: Keyframe[];
  options?: KeyframeAnimationOptions;
}

// State Transitions
export interface StateTransitions {
  enter: AnimationPreset;
  exit: AnimationPreset;
  active?: AnimationPreset;
  inactive?: AnimationPreset;
  disabled?: AnimationPreset;
}

// Spatial Animations (AR/VR)
export interface SpatialAnimations {
  appear: AnimationPreset;
  disappear: AnimationPreset;
  hover: AnimationPreset;
  select: AnimationPreset;
  grab: AnimationPreset;
  release: AnimationPreset;
  snap: AnimationPreset;
}

// Animation Controller
export interface AnimationController {
  // State
  state: AnimationState;

  // Methods
  start: (preset: AnimationPreset) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  reverse: () => void;

  // Cleanup
  destroy: () => void;
}

// Create Animation Controller
export function createAnimationController(
  initialPreset: AnimationPreset
): AnimationController {
  // Initialize state
  const state = {
    isAnimating: $state(false),
    progress: $state(0),
    currentPhase: $state<'enter' | 'active' | 'exit' | 'none'>('none')
  };

  // Track current animation
  let currentAnimation: Animation | undefined;

  // Animation control methods
  const controller: AnimationController = {
    state,

    start: (preset: AnimationPreset) => {
      if (currentAnimation) {
        currentAnimation.cancel();
      }

      state.isAnimating = true;
      state.currentPhase = 'enter';
      state.progress = 0;

      const { timing, keyframes, options } = preset;
      currentAnimation = document.createElement('div').animate(keyframes, {
        duration: parseInt(timing.duration),
        easing: timing.easing,
        delay: timing.delay ? parseInt(timing.delay) : undefined,
        ...options
      });

      currentAnimation.onfinish = () => {
        state.isAnimating = false;
        state.progress = 1;
        state.currentPhase = 'none';
      };

      currentAnimation.oncancel = () => {
        state.isAnimating = false;
        state.progress = 0;
        state.currentPhase = 'none';
      };
    },

    stop: () => {
      currentAnimation?.cancel();
      state.isAnimating = false;
      state.progress = 0;
      state.currentPhase = 'none';
    },

    pause: () => {
      currentAnimation?.pause();
      state.isAnimating = false;
    },

    resume: () => {
      currentAnimation?.play();
      state.isAnimating = true;
    },

    reverse: () => {
      if (currentAnimation) {
        currentAnimation.playbackRate *= -1;
        state.currentPhase = state.currentPhase === 'enter' ? 'exit' : 'enter';
      }
    },

    destroy: () => {
      currentAnimation?.cancel();
      currentAnimation = undefined;
    }
  };

  // Start initial animation if provided
  if (initialPreset) {
    controller.start(initialPreset);
  }

  return controller;
}

// Animation Variants
export const ANIMATION_VARIANTS = {
  fade: {
    in: {
      timing: { duration: DURATION.normal, easing: EASING.standard },
      keyframes: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    },
    out: {
      timing: { duration: DURATION.normal, easing: EASING.standard },
      keyframes: [
        { opacity: 1 },
        { opacity: 0 }
      ]
    }
  },
  slide: {
    in: {
      timing: { duration: DURATION.normal, easing: EASING.standard },
      keyframes: [
        { transform: 'translateY(100%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ]
    },
    out: {
      timing: { duration: DURATION.normal, easing: EASING.standard },
      keyframes: [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-100%)', opacity: 0 }
      ]
    }
  },
  scale: {
    in: {
      timing: { duration: DURATION.normal, easing: EASING.spring },
      keyframes: [
        { transform: 'scale(0.95)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ]
    },
    out: {
      timing: { duration: DURATION.normal, easing: EASING.spring },
      keyframes: [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.95)', opacity: 0 }
      ]
    }
  }
} as const;

// Animation Utilities
export interface AnimationUtils {
  createAnimation: (element: HTMLElement, preset: AnimationPreset) => Animation;
  chainAnimations: (animations: Animation[]) => Promise<void>;
  reverseAnimation: (animation: Animation) => Animation;
  pauseAnimation: (animation: Animation) => void;
  resumeAnimation: (animation: Animation) => void;
}

// Theme Animation Configuration
export interface ThemeAnimationConfig {
  timing: {
    duration: typeof DURATION;
    easing: typeof EASING;
  };
  variants: typeof ANIMATION_VARIANTS;
  transitions: {
    default: StateTransitions;
    modal: StateTransitions;
    drawer: StateTransitions;
    tooltip: StateTransitions;
    menu: StateTransitions;
  };
  spatial: SpatialAnimations;
  utils: AnimationUtils;
}

// Animation Factory
export function createAnimation(
  element: HTMLElement,
  preset: AnimationPreset
): Animation {
  const { timing, keyframes, options } = preset;
  return element.animate(keyframes, {
    duration: parseInt(timing.duration),
    easing: timing.easing,
    delay: timing.delay ? parseInt(timing.delay) : undefined,
    ...options
  });
}

// Chain multiple animations
export async function chainAnimations(animations: Animation[]): Promise<void> {
  for (const animation of animations) {
    await animation.finished;
  }
}

// Create reversed animation
export function reverseAnimation(animation: Animation): Animation {
  const { currentTime, playbackRate } = animation;
  animation.playbackRate = -playbackRate;
  if (currentTime === null) {
    animation.currentTime = 0;
  }
  return animation;
}

// Example Usage in a Component:
/*
<script lang="ts">
  import { createAnimationController, ANIMATION_VARIANTS } from './ThemeAnimations';
  
  const animation = createAnimationController(ANIMATION_VARIANTS.fade.in);
  const { isAnimating, progress } = animation.state;
  const { isComplete, currentPhase } = animation.derived;
  
  // Setup animation effects
  animation.effects.setupAnimation();
  
  // Cleanup on destroy
  animation.effects.cleanup();
</script>

<div
  class="animated-element"
  class:animating={isAnimating}
  class:complete={isComplete}
  data-phase={currentPhase}
  style="--animation-progress: {progress}"
>
  <slot />
</div>

<style>
  .animated-element {
    transition: all var(--transition-normal);
    opacity: var(--animation-progress);
    transform: scale(calc(0.95 + (var(--animation-progress) * 0.05)));
  }
</style>
*/ 