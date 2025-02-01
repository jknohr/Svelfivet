import type { SvelteComponent } from 'svelte';

// Basic types this component needs
export type NodeId = string;
export type Position = { x: number; y: number };
export type Dimensions = { width: number; height: number };

// Node configuration for mermaid
export interface MermaidNodeConfig {
    label?: string;
    style?: Record<string, string>;
    [key: string]: any;
}

// Props specific to FlowChart
export interface FlowChartProps {
    mermaid: string;
    theme?: 'light' | 'dark';
    translation?: boolean;
    trackpadPan?: boolean;
    modifier?: string;
    raiseEdgesOnSelect?: boolean;
    edgesAboveNode?: boolean;
    title?: string;
    fixedZoom?: boolean;
    pannable?: boolean;
    controls?: boolean;
    toggle?: boolean;
    drawer?: boolean;
    contrast?: boolean;
    fitView?: boolean;
    selectionColor?: string;
    edgeStyle?: Record<string, string>;
    endStyles?: Record<string, string>;
    edge?: boolean;
    disableSelection?: boolean;
    direction?: 'TD' | 'LR';
    mermaidConfig?: Record<NodeId, MermaidNodeConfig>;
    nodeTemplate?: (node: {
        id: NodeId;
        label?: string;
        children: NodeId[];
        ignore?: boolean;
    }) => {
        component: typeof SvelteComponent;
        props: Record<string, any>;
    };
    snapTo?: number;
    zoom?: number;
    editable?: boolean;
    locked?: boolean;
    width?: number;
    height?: number;
    minimap?: boolean;
} 