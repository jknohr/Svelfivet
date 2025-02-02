import type { SvelteComponent } from 'svelte';
import type { EdgeStyle } from '$lib/components/Organisms/Edge/Edge.types';
import type { XYPair, Node, Dimensions, CSSColorString } from '$lib/components/Templates/Canvas/types';
import type { EndStyle } from '$lib/components/Organisms/Edge/Edge.types';
import type { Snippet } from 'svelte';

// State types
export interface AnchorState extends XYPair {
    top: number;
    left: number;
}

export interface PinchState {
    distance: number;
    scale: number;
    animationFrameId: number | null;
}

export interface GraphNodes {
    items: Node[];
    getAll(): Node[];
    map<T>(callbackfn: (value: Node, index: number, array: Node[]) => T): T[];
    [Symbol.iterator](): Iterator<Node>;
}

export interface DimensionsMap {
    [key: string]: Dimensions & { id?: string };
}

export interface GraphDimensions extends Dimensions {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface GraphState {
    scale: number;
    translation: XYPair;
    selectedNodes: Set<Node>;
    theme: string;
    drawer: boolean;
    minimap: boolean;
    controls: boolean;
    editing: Node | null;
    activeIntervals: Record<string, number>;
    isDragging: boolean;
    mounted: boolean;
    dimensions: GraphDimensions;
    nodeBounds: DimensionsMap;
    groupBoxes: Map<string, Dimensions>;
    nodes: GraphNodes;
    groups: {
        [key: `${string}/${string}`]: Set<Node>;
        selected?: Set<Node>;
        hidden?: Set<Node>;
    };
    pinch: PinchState;
}

export interface GraphStateManager {
    state: GraphState;
    selection: {
        selectedNodes: Set<Node>;
        selectedNode: Node | null;
        isEditing: boolean;
        isSelecting: boolean;
        isCreating: boolean;
        isDragging: boolean;
    };
    interaction: {
        cursor: XYPair;
        anchor: AnchorState;
        isAdding: boolean;
        isDragging: boolean;
        isPinching: boolean;
        pinch: PinchState;
    };
    ui: {
        theme: string;
        color: CSSColorString;
        minimapVisible: boolean;
        controlsVisible: boolean;
        drawerVisible: boolean;
        toggleVisible: boolean;
        contrastVisible: boolean;
    };
}

export interface SvelvetProps {
    children?: Snippet;
    background?: Snippet;
    drawer?: Snippet;
    selectionBox?: Snippet;
    themeToggle?: Snippet;
    contrastTheme?: Snippet;
    width?: number;
    height?: number;
    pannable?: boolean;
    theme?: string;
    title?: string;
    backgroundExists?: boolean;
    graph?: any;
    graphDOMElement?: HTMLElement;
    fitView?: boolean;
    disableSelection?: boolean;
    selectionColor?: string;
    PAN_INCREMENT?: number;
    PAN_TIME?: number;
    onEdgeDrop?: (data: any) => void;
    minimap?: boolean;
    controls?: boolean;
    endStyles?: [EndStyle | null, EndStyle | null];
    id?: number | string;
    snapTo?: number;
    zoom?: number;
    direction?: 'TD' | 'LR';
    editable?: boolean;
    locked?: boolean;
    toggle?: boolean;
    contrast?: boolean;
    edgeStyle?: EdgeStyle;
    edge?: typeof SvelteComponent | null;
    mermaidConfig?: Record<string, unknown>;
    translation?: XYPair;
    trackpadPan?: boolean;
    modifier?: string;
    raiseEdgesOnSelect?: boolean;
    edgesAboveNode?: boolean;
    fixedZoom?: boolean;
    nodeTemplate?: (node: any) => { component: any; props: any };
} 