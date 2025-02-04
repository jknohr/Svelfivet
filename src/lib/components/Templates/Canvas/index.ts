/*
  This index file aggregates exports for the legacy upgraded Svelvet code.
  Routes and other parts of the application can import from here to access relevant Canvas modules.

  Exports:
  - Graph.types (Graph related types and interfaces)
  - GraphRenderer (Svelte component for rendering graphs)
*/

export * from './Graph/Graph.types';
export { default as GraphRenderer } from './renderers/GraphRenderer/GraphRenderer.svelte';
