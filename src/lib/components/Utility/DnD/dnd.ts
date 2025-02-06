import type { 
    DragEvent as CustomDragEvent, 
    DraggableOptions, 
    DroppableOptions,
    DragDropZoneOptions,
    DragHandle,
    DragFeedback,
    Position,
    GeospatialAnchor,
    DragConstraints
} from './dnd.types';

interface DragState {
    isDragging: boolean;
    currentItem: any;
    sourceZone: string;
    targetZone: string | null;
    position: Position;
    geospatial?: GeospatialAnchor;
    preview: HTMLElement | null;
}

const dragState = $state<DragState>({
    isDragging: false,
    currentItem: null,
    sourceZone: '',
    targetZone: null,
    position: {
        x: 0, y: 0,
        clientX: 0, clientY: 0,
        offsetX: 0, offsetY: 0
    },
    preview: null,
    geospatial: undefined
});

// Utility function to check if an element is or contains a drag handle
// Check if position is within constraints
function isWithinConstraints(position: Position, constraints?: DragConstraints): boolean {
    if (!constraints) return true;

    // Check spatial bounds
    if (position.spatial) {
        const { x, y, z } = position.spatial;
        const { spatialBounds } = constraints;

        if (spatialBounds) {
            if (spatialBounds.minX !== undefined && x < spatialBounds.minX) return false;
            if (spatialBounds.maxX !== undefined && x > spatialBounds.maxX) return false;
            if (spatialBounds.minY !== undefined && y < spatialBounds.minY) return false;
            if (spatialBounds.maxY !== undefined && y > spatialBounds.maxY) return false;
            if (z !== undefined) {
                if (spatialBounds.minZ !== undefined && z < spatialBounds.minZ) return false;
                if (spatialBounds.maxZ !== undefined && z > spatialBounds.maxZ) return false;
            }
        }
    }

    // Check geospatial bounds
    if (position.geospatial) {
        const { latitude, longitude, altitude } = position.geospatial;
        const { geospatialBounds } = constraints;

        if (geospatialBounds) {
            if (geospatialBounds.minLatitude !== undefined && latitude < geospatialBounds.minLatitude) return false;
            if (geospatialBounds.maxLatitude !== undefined && latitude > geospatialBounds.maxLatitude) return false;
            if (geospatialBounds.minLongitude !== undefined && longitude < geospatialBounds.minLongitude) return false;
            if (geospatialBounds.maxLongitude !== undefined && longitude > geospatialBounds.maxLongitude) return false;
            if (altitude !== undefined) {
                if (geospatialBounds.minAltitude !== undefined && altitude < geospatialBounds.minAltitude) return false;
                if (geospatialBounds.maxAltitude !== undefined && altitude > geospatialBounds.maxAltitude) return false;
            }
        }
    }

    // Check 2D bounds
    const { bounds } = constraints;
    if (bounds) {
        if (bounds.left !== undefined && position.x < bounds.left) return false;
        if (bounds.right !== undefined && position.x > bounds.right) return false;
        if (bounds.top !== undefined && position.y < bounds.top) return false;
        if (bounds.bottom !== undefined && position.y > bounds.bottom) return false;
    }

    return true;
}

// Apply grid snapping to position
function applyGridSnapping(position: Position, grid?: [number, number]): Position {
    if (!grid) return position;
    const [gridX, gridY] = grid;
    
    return {
        ...position,
        x: Math.round(position.x / gridX) * gridX,
        y: Math.round(position.y / gridY) * gridY,
        clientX: Math.round(position.clientX / gridX) * gridX,
        clientY: Math.round(position.clientY / gridY) * gridY
    };
}

function isValidHandle(element: HTMLElement, handle?: DragHandle): boolean {
    if (!handle) return true;
    if (handle.disabled) return false;
    
    if (handle.customHandle) {
        return !!element.closest('[data-drag-handle]');
    }
    
    if (handle.selector) {
        return !!element.closest(handle.selector);
    }
    
    return true;
}

// Utility function to create and position drag preview
function createDragPreview(element: HTMLElement, feedback?: DragFeedback): HTMLElement {
    const preview = element.cloneNode(true) as HTMLElement;
    preview.style.position = 'fixed';
    preview.style.pointerEvents = 'none';
    preview.style.zIndex = '9999';
    preview.style.opacity = '0.8';
    
    if (feedback?.previewClass) {
        preview.classList.add(feedback.previewClass);
    }
    
    document.body.appendChild(preview);
    return preview;
}



// Main draggable action
export function draggable(node: HTMLElement, options: DraggableOptions) {
    const { source, handle, constraints, feedback } = options;
    
    // Handle configuration
    if (handle?.customHandle && !node.hasAttribute('data-drag-handle')) {
        return;
    }

    // Setup drag handlers
    const handleDragStart = (event: globalThis.DragEvent) => {
        event.stopPropagation();
        
        // Set drag state
        dragState.isDragging = true;
        dragState.currentItem = source.data;
        dragState.sourceZone = source.id;

        // Get current position
        let newPosition = {
            x: event.clientX,
            y: event.clientY,
            clientX: event.clientX,
            clientY: event.clientY,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };

        // Apply constraints and grid snapping if specified
        if (constraints) {
            if (constraints.grid) {
                newPosition = applyGridSnapping(newPosition, constraints.grid);
            }
            if (!isWithinConstraints(newPosition, constraints)) {
                event.preventDefault();
                return;
            }
        }

        // Update drag state with the new position
        dragState.position = newPosition;

        // Update geospatial position if available
        if ('geolocation' in navigator && constraints?.geospatialBounds) {
            navigator.geolocation.getCurrentPosition(
                (geoPosition) => {
                    dragState.geospatial = {
                        latitude: geoPosition.coords.latitude,
                        longitude: geoPosition.coords.longitude,
                        altitude: geoPosition.coords.altitude || undefined
                    };
                },
                (error) => console.warn('Geolocation error:', error)
            );
        }

        // Apply drag feedback
        if (feedback?.dragClass) {
            node.classList.add(feedback.dragClass);
        }

        // Create drag preview if enabled
        if (feedback?.preview) {
            const preview = node.cloneNode(true) as HTMLElement;
            preview.classList.add('drag-preview');
            if (feedback.previewClass) {
                preview.classList.add(feedback.previewClass);
            }
            
            // Position the preview
            preview.style.position = 'fixed';
            preview.style.pointerEvents = 'none';
            preview.style.zIndex = '9999';
            preview.style.opacity = '0.8';
            preview.style.transform = `translate(${(event as globalThis.DragEvent & globalThis.MouseEvent).clientX}px, ${(event as globalThis.DragEvent & globalThis.MouseEvent).clientY}px)`;
            
            document.body.appendChild(preview);
        }

        // Apply constraints
        if (constraints?.axis && event.dataTransfer) {
            event.dataTransfer.effectAllowed = constraints.axis === 'x' ? 'move' : 'copy';
        }
    };

    const handleDrag = (event: globalThis.DragEvent) => {
        if (!dragState.isDragging) return;

        // Get current position
        let newPosition = {
            x: event.clientX,
            y: event.clientY,
            clientX: event.clientX,
            clientY: event.clientY,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };

        // Apply constraints and grid snapping
        if (constraints) {
            if (constraints.grid) {
                newPosition = applyGridSnapping(newPosition, constraints.grid);
            }
            if (!isWithinConstraints(newPosition, constraints)) {
                return;
            }
        }

        // Update position
        dragState.position = newPosition;

        // Update geospatial position if needed
        if ('geolocation' in navigator && constraints?.geospatialBounds) {
            navigator.geolocation.getCurrentPosition(
                (geoPosition) => {
                    dragState.geospatial = {
                        latitude: geoPosition.coords.latitude,
                        longitude: geoPosition.coords.longitude,
                        altitude: geoPosition.coords.altitude || undefined
                    };
                },
                (error) => console.warn('Geolocation error:', error)
            );
        }

        // Update preview position if enabled
        if (feedback?.preview) {
            const preview = document.querySelector('.drag-preview') as HTMLElement;
            if (preview) {
                // Apply axis constraints if specified
                if (constraints?.axis === 'x') {
                    preview.style.transform = `translateX(${(event as globalThis.DragEvent & globalThis.MouseEvent).clientX}px)`;
                } else if (constraints?.axis === 'y') {
                    preview.style.transform = `translateY(${(event as globalThis.DragEvent & globalThis.MouseEvent).clientY}px)`;
                } else {
                    preview.style.transform = `translate(${(event as globalThis.DragEvent & globalThis.MouseEvent).clientX}px, ${(event as globalThis.DragEvent & globalThis.MouseEvent).clientY}px)`;
                }
            }
        }
    };

    const handleDragEnd = () => {
        dragState.isDragging = false;
        dragState.currentItem = null;
        dragState.sourceZone = '';
        dragState.position = { 
            x: 0, y: 0, 
            clientX: 0, clientY: 0, 
            offsetX: 0, offsetY: 0 
        };

        // Remove feedback classes
        if (feedback?.dragClass) {
            node.classList.remove(feedback.dragClass);
        }

        // Remove preview
        document.querySelectorAll('.drag-preview').forEach(el => el.remove());
    };

    // Add event listeners
    node.setAttribute('draggable', 'true');
    node.addEventListener('dragstart', handleDragStart);
    node.addEventListener('drag', handleDrag);
    node.addEventListener('dragend', handleDragEnd);

    // Cleanup function
    return {
        destroy() {
            node.removeAttribute('draggable');
            node.removeEventListener('dragstart', handleDragStart);
            node.removeEventListener('drag', handleDrag);
            node.removeEventListener('dragend', handleDragEnd);
        }
    };
}

// Main droppable action
export function droppable(node: HTMLElement, options: DroppableOptions) {
    const { target, feedback, onDragEnter, onDragLeave, onDrop } = options;

    // Add drop target styling class if specified
    if (feedback?.dropTargetClass) {
        node.classList.add(feedback.dropTargetClass);
    }

    const handleDragEnter = (event: globalThis.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!dragState.isDragging) return;

        // Update target zone
        dragState.targetZone = target.id;

        // Validate drop if validation function exists
        if (target.validate) {
            const dragEvent: CustomDragEvent = {
                item: dragState.currentItem,
                source: { id: dragState.sourceZone },
                target: { id: target.id },
                position: dragState.position
            };
            
            if (!target.validate(dragEvent)) {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = 'none';
                }
                return;
            }
        }

        // Check group compatibility
        if (target.accept?.length) {
            const sourceGroup = dragState.currentItem?.group;
            if (!sourceGroup || !target.accept.includes(sourceGroup)) {
                if (event.dataTransfer) {
                    event.dataTransfer.dropEffect = 'none';
                }
                return;
            }
        }

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }

        // Call onDragEnter callback if provided
        if (onDragEnter) {
            const dragEvent: CustomDragEvent = {
                item: dragState.currentItem,
                source: { id: dragState.sourceZone },
                target: { id: target.id },
                position: dragState.position
            };
            onDragEnter(dragEvent);
        }
    };

    const handleDragOver = (event: globalThis.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!dragState.isDragging) return;

        // Update position
        dragState.position = {
            x: event.clientX,
            y: event.clientY,
            clientX: event.clientX,
            clientY: event.clientY,
            offsetX: event.offsetX,
            offsetY: event.offsetY
        };

        // Update preview position if it exists
        if (dragState.preview) {
            dragState.preview.style.transform = 
                `translate(${event.clientX}px, ${event.clientY}px)`;
        }
    };

    const handleDragLeave = (event: globalThis.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!dragState.isDragging) return;

        // Reset target zone
        dragState.targetZone = null;

        // Call onDragLeave callback if provided
        if (onDragLeave) {
            const dragEvent: CustomDragEvent = {
                item: dragState.currentItem,
                source: { id: dragState.sourceZone },
                target: { id: target.id },
                position: dragState.position
            };
            onDragLeave(dragEvent);
        }
    };

    const handleDrop = (event: globalThis.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (!dragState.isDragging) return;

        // Call onDrop callback if provided
        if (onDrop) {
            const dragEvent: CustomDragEvent = {
                item: dragState.currentItem,
                source: { id: dragState.sourceZone },
                target: { id: target.id },
                position: dragState.position
            };
            onDrop(dragEvent);
        }

        // Reset drag state
        dragState.isDragging = false;
        dragState.currentItem = null;
        dragState.sourceZone = '';
        dragState.targetZone = null;

        // Remove preview if it exists
        if (dragState.preview) {
            dragState.preview.remove();
            dragState.preview = null;
        }
    };

    // Add event listeners
    node.addEventListener('dragenter', handleDragEnter);
    node.addEventListener('dragover', handleDragOver);
    node.addEventListener('dragleave', handleDragLeave);
    node.addEventListener('drop', handleDrop);

    // Return cleanup function
    return {
        destroy() {
            node.removeEventListener('dragenter', handleDragEnter);
            node.removeEventListener('dragover', handleDragOver);
            node.removeEventListener('dragleave', handleDragLeave);
            node.removeEventListener('drop', handleDrop);

            // Remove drop target styling class if it was added
            if (feedback?.dropTargetClass) {
                node.classList.remove(feedback.dropTargetClass);
            }
        }
    };
}

// Combined drag-drop zone
export function dragDropZone(node: HTMLElement, options: DragDropZoneOptions) {
    const { mode, source, target, handle, constraints, feedback } = options;
    
    let draggableCleanup: { destroy: () => void } | null | undefined = null;
    let droppableCleanup: { destroy: () => void } | null | undefined = null;

    // Setup draggable if mode is 'source' or 'both'
    if (mode === 'source' || mode === 'both') {
        draggableCleanup = draggable(node, {
            source,
            handle,
            constraints,
            feedback
        });
    }

    // Setup droppable if mode is 'target' or 'both'
    if (mode === 'target' || mode === 'both') {
        droppableCleanup = droppable(node, {
            target,
            feedback,
            onDragEnter: options.onDragEnter,
            onDragLeave: options.onDragLeave,
            onDrop: options.onDrop
        });
    }

    // Return cleanup function
    return {
        destroy() {
            if (draggableCleanup) {
                draggableCleanup.destroy();
            }
            if (droppableCleanup) {
                droppableCleanup.destroy();
            }
        }
    };
}

// Drag handle action
export function dragHandle(node: HTMLElement) {
    node.setAttribute('data-drag-handle', 'true');
    return {
        destroy() {
            node.removeAttribute('data-drag-handle');
        }
    };
}