import type { SpatialEnvironment } from '$lib/types/spatial';
import type { 
    SpatialAnchorConfig,
    SpatialConstraints
} from '$lib/types/spatial';
import type { 
    EnvironmentSpatialConfig,
    SpatialUnderstandingConfig,
    RoomBoundaryConfig
} from '$lib/components/Theme/configs/spatialAnchor';
import type { Snippet } from 'svelte';

export interface GridItem {
    id: string | number;
    [key: string]: any;
}

export type GridTemplateColumns = string | number | (string | number)[];
export type GridGap = string | number;
export type GridDensity = 'compact' | 'comfortable' | 'spacious';
export type GridMode = 'auto' | 'fixed' | 'masonry';

export interface VirtualizationOptions {
    enabled: boolean;
    overscan: number;
    chunkSize: number;
    scrollThreshold: number;
    measureTimeout: number;
}

export interface DynamicGridProps {
    // Core props
    items: GridItem[];
    templateColumns?: GridTemplateColumns;
    templateRows?: string;
    gap?: GridGap;
    density?: GridDensity;
    mode?: GridMode;
    
    // Sizing constraints
    minItemWidth?: string;
    maxItemWidth?: string;
    minItemHeight?: string;
    maxItemHeight?: string;
    fixedColumns?: number;
    fixedRows?: number;
    
    // Nesting and environment
    nested?: boolean;
    environment?: SpatialEnvironment;
    spatialConfig?: Partial<EnvironmentSpatialConfig>;
    spatialAnchor?: SpatialAnchorConfig;
    spatialUnderstanding?: SpatialUnderstandingConfig;
    roomBoundary?: RoomBoundaryConfig;
    spatialConstraints?: SpatialConstraints;
    
    // Performance optimizations
    lazy?: boolean;
    virtualization?: VirtualizationOptions;
    
    // Event handlers
    onItemClick?: (event: GridItemClickEvent) => void;
    
    // Render function
    children?: Snippet<[GridItem]>;
}

// Virtualization types
export interface VirtualListOptions {
    items: GridItem[];
    itemHeight: number;
    overscan?: number;
}

export interface VirtualListState {
    visibleItems: GridItem[];
    scrollTop: number;
    viewportHeight: number;
    totalHeight: number;
    itemHeight: number;
    itemsPerRow: number;
    bufferRows: number;
    lastMeasuredIndex: number;
    spatialData?: {
        meshes?: Array<{
            id: string;
            confidence: number;
            bounds: {
                width: number;
                height: number;
                depth: number;
            };
        }>;
        boundary?: {
            center: { x: number; y: number; z: number };
            dimensions: { width: number; height: number; depth: number };
            confidence: number;
        };
    };
    chunks: Array<{
        startRow: number;
        endRow: number;
        items: GridItem[];
        measured: boolean;
        height: number;
        depth?: number;
        angle?: number;
        distance?: number;
    }>;
}

// Grid layout types
export interface GridLayout {
    columns: number;
    rows: number;
    itemWidth: number;
    itemHeight: number;
    gap: number;
    mode: GridMode;
    containerWidth: number;
    containerHeight: number;
}

// Grid events
export interface GridItemClickEvent {
    item: GridItem;
    index: number;
    event: MouseEvent;
}
