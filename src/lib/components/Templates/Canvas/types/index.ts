import type { Node, Edge, GroupBox, NodeKey, EdgeKey, GroupKey, XYPair, Dimensions, Direction, AnchorKey } from './logic';
import type { CSSColorString } from './theme';

// Re-export types from logic, theme, storage, store, stores, and surrealdb
export * from './logic';
export * from './theme';
export * from './storage';


// Additional types needed for creators
export interface Store<T, K> {
    subscribe: (subscriber: (value: Map<K, T>) => void) => () => void;
    set: (value: Map<K, T>) => void;
    update: (updater: (value: Map<K, T>) => Map<K, T>) => void;
    add: (item: T, key: K) => Map<K, T>;
    get: (key: K) => T | null;
    getAll: () => T[];
    delete: (key: K) => boolean;
    count: () => number;
}

export interface NodeStore extends Store<Node, NodeKey> {}
export interface EdgeStore extends Store<Edge, EdgeKey> {}
export interface GroupStore extends Store<GroupBox, GroupKey> {}

export interface GraphDimensions extends Dimensions {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export interface NodeConfig {
    id: string | number;
    inputs?: number;
    outputs?: number;
    resizable?: boolean;
    dimensions?: Dimensions;
    width?: number;
    height?: number;
    editable?: boolean;
    direction?: Direction;
    zIndex?: number;
    position?: XYPair;
    selectionColor?: CSSColorString | null;
    borderWidth?: number;
    edge?: Edge | null;
    label?: string;
    bgColor?: CSSColorString | null;
    borderColor?: CSSColorString | null;
    rotation?: number;
    borderRadius?: number;
    connections?: Array<{
        source: string;
        target: string;
        edge: string;
    }>;
    textColor?: CSSColorString | null;
    locked?: boolean;
    group?: GroupKey | null;
}

export interface EdgeLabel {
    text: string;
    color: CSSColorString;
    textColor: CSSColorString;
    fontSize: number;
    dimensions: Dimensions;
    borderRadius: number;
}

export interface EdgeConfig {
    type?: string;
    color?: CSSColorString;
    width?: number;
    animated?: boolean;
    disconnect?: boolean;
    start?: string;
    end?: string;
    label?: {
        text: string;
        color?: CSSColorString;
        textColor?: CSSColorString;
        fontSize?: number;
        dimensions?: Dimensions;
        borderRadius?: number;
    };
    metadata?: Record<string, unknown>;
}

export interface WritableEdge extends Omit<Edge, 'label'> {
    rendered: boolean;
    disconnect?: boolean;
    label?: EdgeLabel;
}

export type WrappedWritable<T extends Record<string, unknown>> = {
    [K in keyof T]: {
        subscribe: (subscriber: (value: T[K]) => void) => () => void;
        set: (value: T[K]) => void;
        update: (updater: (value: T[K]) => T[K]) => void;
    };
};

export interface Groups {
    selected: {
        parent: GroupKey | null;
        nodes: Set<Node>;
    };
    hidden: {
        parent: GroupKey | null;
        nodes: Set<Node>;
    };
}

// Update Anchor interface to include needed properties
export interface Anchor {
    id: AnchorKey;
    node: Node;
    type: 'input' | 'output';
    position: XYPair;
    offset: XYPair;
    direction: Direction;
    dynamic: boolean;
    mounted: boolean;
    connected: Set<Anchor>;
    store: Store<unknown, unknown> | null;
    edge: Edge | null;
    inputKey: string | number | null;
    edgeColor: CSSColorString | null;
    rotation: number;
    recalculatePosition: () => void;
}