/*
  Aggregated exports for legacy/upgraded Svelvet code
  
  This file centralizes exports from various modules so that routes and other parts
  of the application can import everything from a single location.
  
  Note: Some exports are renamed to avoid naming conflicts and clarify their origin.
*/

// Organisms
export { Node as OrganismNode } from '$lib/components/Organisms/Node/Node.types';
export { Edge as OrganismEdge } from '$lib/components/Organisms/Edge/Edge.types';

// Canvas Graph Types
export { Graph } from '$lib/components/Templates/Canvas/Graph/Graph.types';

// Utility
export { Group, GroupBox } from '$lib/components/Utility/Group/CanvasGroup.svelte';

// Atoms
export type { Anchor as AtomAnchor } from '$lib/components/Atoms/Anchor/Anchor.types';
export type { Input } from '$lib/components/Atoms/Input/Input.types';
export type { Text } from '$lib/components/Atoms/Text/Text.types';

// Canvas Storage and Stores
export type { InputStore, OutputStore } from '$lib/components/Templates/Canvas/types/storage';
export { GroupStore, EdgeStore, NodeStore } from '$lib/components/Templates/Canvas/types/stores';

// Canvas Logic Types
export type {
  GraphTransforms,
  GraphKey,
  XYPair,
  GroupKey,
  Anchor as CanvasLogicAnchor,
  Node as CanvasLogicNode,
  Edge as CanvasLogicEdge
} from '$lib/components/Templates/Canvas/types/logic';

// Re-export from Canvas storage with renaming to avoid conflicts
export { 
  GroupBox as StorageGroupBox,
  InputStore as StorageInputStore,
  OutputStore as StorageOutputStore
} from '$lib/components/Templates/Canvas/types/storage';

export type { GraphDimensions } from '$lib/components/Templates/Canvas/types/storage';

// Theme
export type { ThemeProvider as CanvasThemeProvider } from '$lib/components/Templates/Canvas/Theme/CanvasThemeProvider';
export type { CSSColorString as AtomCSSColorString } from '$lib/components/Templates/Canvas/types/theme';

// FlowChart
export type { Dimensions } from '$lib/components/Organisms/FlowChart/FlowChart.types';

// Utility Creator
export type { createBoundsStore } from '$lib/components/Templates/Canvas/utils/creators/createBoundsStore';
