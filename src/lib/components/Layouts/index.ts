// Component exports
export { default as BaseLayout } from './Body/BaseBodyLayout.svelte';
export { default as HeaderLayout } from './Header/HeaderLayout.svelte';
export { default as LayoutFooter } from './Footer/LayoutFooter.svelte';
export { default as LayoutManager } from './LayoutManager.svelte';

// Type exports
export * from './types';

// Default configuration exports
export {
  defaultLayoutConfig,
  defaultDimensions,
  defaultAccessibility
} from './types';