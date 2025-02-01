import type { GraphStateManager } from '../../Svelvet/Svelvet.types';

export function createGraphStateManager(): GraphStateManager {
    return {
        state: {
            scale: 1,
            translation: { x: 0, y: 0 },
            selectedNodes: new Set(),
            theme: 'light',
            drawer: false,
            minimap: false,
            controls: false,
            editing: null,
            activeIntervals: {},
            isDragging: false,
            mounted: false,
            dimensions: { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 },
            nodeBounds: {},
            groupBoxes: new Map(),
            nodes: {
                items: [],
                getAll: () => [],
                map: () => [],
                [Symbol.iterator]: function* () { yield* this.items; }
            },
            groups: {
                selected: new Set(),
                hidden: new Set()
            },
            pinch: {
                distance: 0,
                scale: 1,
                animationFrameId: null
            }
        },
        selection: {
            selectedNodes: new Set(),
            selectedNode: null,
            isEditing: false,
            isSelecting: false,
            isCreating: false,
            isDragging: false
        },
        interaction: {
            cursor: { x: 0, y: 0 },
            anchor: { x: 0, y: 0, top: 0, left: 0 },
            isAdding: false,
            isDragging: false,
            isPinching: false,
            pinch: {
                distance: 0,
                scale: 1,
                animationFrameId: null
            }
        },
        ui: {
            theme: 'light',
            color: '#000000',
            minimapVisible: false,
            controlsVisible: false,
            drawerVisible: false,
            toggleVisible: false,
            contrastVisible: false
        }
    };
} 