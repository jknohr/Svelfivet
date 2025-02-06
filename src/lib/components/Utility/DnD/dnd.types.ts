// dnd.types.ts

// Spatial position interface for 3D/VR support
export interface SpatialPosition {
    x: number;
    y: number;
    z?: number;
    rotation?: {
        x: number;
        y: number;
        z: number;
    };
}

// Geospatial anchor interface
export interface GeospatialAnchor {
    latitude: number;
    longitude: number;
    altitude?: number;
    radius?: number;  // Area radius in meters
}

// Combined position types
export interface Position {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    spatial?: SpatialPosition;
    geospatial?: GeospatialAnchor;
}

// Core event types
export interface DragEvent {
    item: any;
    source: DragSource;
    target?: DropTarget;
    position: Position;
}

// Source configuration
export interface DragSource {
    id: string;
    data?: any;
    group?: string;
    constraints?: DragConstraints;
}

// Target configuration
export interface DropTarget {
    id: string;
    data?: any;
    group?: string;
    accept?: string[];
    validate?: (event: DragEvent) => boolean;
}

// Zone types - for areas that can be both drag sources and drop targets
export interface DragDropZone extends DragSource, DropTarget {
    mode: 'source' | 'target' | 'both';
}

// Handle configuration
export interface DragHandle {
    selector?: string;  // CSS selector for handle element
    customHandle?: boolean; // If true, only elements with data-drag-handle will work
    disabled?: boolean;
}

// Constraints for dragging
export interface DragConstraints {
    axis?: 'x' | 'y' | 'z' | 'both' | 'all';
    bounds?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
        front?: number;
        back?: number;
    };
    spatialBounds?: {
        minX?: number;
        maxX?: number;
        minY?: number;
        maxY?: number;
        minZ?: number;
        maxZ?: number;
    };
    geospatialBounds?: {
        minLatitude?: number;
        maxLatitude?: number;
        minLongitude?: number;
        maxLongitude?: number;
        minAltitude?: number;
        maxAltitude?: number;
    };
    grid?: [number, number];  // Snap to grid [x, y]
}

// Visual feedback options
export interface DragFeedback {
    preview?: boolean;  // Show drag preview
    previewClass?: string;
    dragClass?: string;
    dropTargetClass?: string;
    animation?: {
        duration: number;
        easing: string;
    };
}

// Combined options interfaces
export interface DraggableOptions {
    source: DragSource;
    handle?: DragHandle;
    constraints?: DragConstraints;
    feedback?: DragFeedback;
}

export interface DroppableOptions {
    target: DropTarget;
    feedback?: DragFeedback;
    onDragEnter?: (event: DragEvent) => void;
    onDragLeave?: (event: DragEvent) => void;
    onDrop?: (event: DragEvent) => void;
}

export interface DragDropZoneOptions extends DraggableOptions, DroppableOptions {
    mode: 'source' | 'target' | 'both';
}