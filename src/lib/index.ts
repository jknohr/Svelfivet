// Main Components
export { default as Svelvet } from './components/Templates/Canvas/Svelvet/Svelvet.svelte';
export { default as Node } from './components/Organisms/Node/Node.svelte';
export { default as Anchor } from './components/Atoms/Anchor/Anchor.svelte';
export { default as IDSnippetContainer } from './services/neuralid/IDSnippetContainer.svelte';

// Core Types
export type { Node as NodeType } from './components/Organisms/Node/Node.types';
export type { 
    EdgeProps,
    EdgeStyle,
    EndStyle,
    EdgeMetadata,
    EdgeLabel,
    EdgeConfig,

} from './components/Organisms/Edge/Edge.types';
export type { Graph as GraphType } from './components/Templates/Canvas/Graph/Graph.types';
export type { Anchor as AnchorType } from './components/Atoms/Anchor/Anchor.types';

// Storage and State Management
export { GroupStore, NodeStore } from './components/Templates/Canvas/types/stores';
export type { InputStore, OutputStore, GraphDimensions } from './components/Templates/Canvas/types/storage';

// Utility Components and Types
export { default as Group } from './components/Utility/Group/CanvasGroup.svelte';
export type { GroupBox } from './components/Templates/Canvas/Graph/Graph.types';
export type { Dimensions } from './components/Organisms/FlowChart/FlowChart.types';

// Canvas Logic Types
export type {
    Graph,
    GraphKey,
    XYPair,
    Direction,
    ElementType,
    ActionType,
    NodeKey,
    EdgeKey,
    AnchorKey,
    GroupKey,
    GroupBox as LogicGroupBox,
    GroupEvent,
    GroupProps,
    Viewport,
    ViewportEvent,
    Selection,
    Anchor as CanvasLogicAnchor,
    Node as CanvasLogicNode,
    Edge as CanvasLogicEdge
} from './components/Templates/Canvas/types/logic';

// Theme Types
export type { UnifiedThemeContext as ThemeProvider } from './components/Templates/Canvas/types/theme';
export type { CSSColorString } from './components/Templates/Canvas/types/theme';

// Re-exports with Consistent Naming
export { 
    GroupBox as StorageGroupBox,
    InputStore as StorageInputStore,
    OutputStore as StorageOutputStore
} from './components/Templates/Canvas/types/storage';
