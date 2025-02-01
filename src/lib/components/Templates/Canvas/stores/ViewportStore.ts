import type { XYPair } from '$lib/components/Templates/Canvas/types';

// Viewport state
let scale = $state(1);
let translation = $state<XYPair>({ x: 0, y: 0 });
let dimensions = $state<{ width: number; height: number }>({ width: 0, height: 0 });
let isDragging = $state(false);
let isPanning = $state(false);

// Derived states
let transform = $derived(`translate(${translation.x}px, ${translation.y}px) scale(${scale})`);
let viewBox = $derived(`0 0 ${dimensions.width} ${dimensions.height}`);
let center = $derived<XYPair>({
    x: dimensions.width / 2,
    y: dimensions.height / 2
});

const isDevelopment = true;

// Viewport management
function setScale(newScale: number) {
    scale = Math.max(0.1, Math.min(2, newScale));
}

function setTranslation(newTranslation: XYPair) {
    translation = newTranslation;
}

function setDimensions(width: number, height: number) {
    dimensions = { width, height };
}

function startDragging() {
    isDragging = true;
}

function stopDragging() {
    isDragging = false;
}

function startPanning() {
    isPanning = true;
}

function stopPanning() {
    isPanning = false;
}

function zoomToFit(bounds: { width: number; height: number }) {
    const scaleX = dimensions.width / bounds.width;
    const scaleY = dimensions.height / bounds.height;
    scale = Math.min(scaleX, scaleY, 2) * 0.9;
    
    translation = {
        x: (dimensions.width - bounds.width * scale) / 2,
        y: (dimensions.height - bounds.height * scale) / 2
    };
}

function screenToViewport(point: XYPair): XYPair {
    return {
        x: (point.x - translation.x) / scale,
        y: (point.y - translation.y) / scale
    };
}

function viewportToScreen(point: XYPair): XYPair {
    return {
        x: point.x * scale + translation.x,
        y: point.y * scale + translation.y
    };
}

// Development mode inspection
if (isDevelopment) {
    $effect.pre(() => {
        $inspect(scale, 'Viewport Scale');
        $inspect(translation, 'Viewport Translation');
        $inspect(dimensions, 'Viewport Dimensions');
    });
}

export {
    scale,
    translation,
    dimensions,
    isDragging,
    isPanning,
    transform,
    viewBox,
    center,
    setScale,
    setTranslation,
    setDimensions,
    startDragging,
    stopDragging,
    startPanning,
    stopPanning,
    zoomToFit,
    screenToViewport,
    viewportToScreen
}; 