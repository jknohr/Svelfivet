import type { Graph, XYPair, Dimensions } from '../../types';
import type { Readable } from 'svelte/store';
import { get } from 'svelte/store';

interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

interface ExtendedDimensions extends Dimensions {
    top: number;
    left: number;
}

export interface VectorPlusPosition extends XYPair {
    direction: XYPair;
}

/**
 * Calculates the center point of the viewport based on graph dimensions and transforms
 * Used in: Graph.svelte, createGraph.ts
 */
export function calculateViewportCenter(
    dimensions: ExtendedDimensions,
    translation: XYPair,
    scale: number
): XYPair {
    const { width, height, top, left } = dimensions;
    const viewportCenter = { clientX: width / 2, clientY: height / 2 };
    return calculateRelativeCursor(viewportCenter, top, left, width, height, scale, translation);
}

/**
 * Calculates the zoom level based on scale and delta
 * Used in: Graph.svelte, zoomAndTranslate.ts
 */
export function calculateZoom(scale: number, delta: number): number {
    return Math.max(0.1, Math.min(2, scale + delta * 0.001));
}

/**
 * Calculates the fit content dimensions of an element
 * Used in: Node.svelte, Group.svelte
 */
export function calculateFitContent(element: HTMLElement): [number, number] {
    const previousWidth = element.style.width;
    const previousHeight = element.style.height;
    element.style.width = 'fit-content';
    element.style.height = 'fit-content';
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    element.style.width = previousWidth;
    element.style.height = previousHeight;
    return [width, height];
}

/**
 * Calculates the radius for circular elements
 * Used in: Node.svelte, Anchor.svelte
 */
export function calculateRadius(size: number): number {
    return size / 2;
}

/**
 * Calculates the relative cursor position within the graph, accounting for scale and translation
 * Used in: Graph.svelte, CursorStore.ts
 */
export const calculateRelativeCursor = (
    e: { clientX: number; clientY: number },
    top: number,
    left: number,
    width: number,
    height: number,
    scale: number,
    translation: { x: number; y: number }
) => {
    const { clientX, clientY } = e;
    const scaleCapture = scale;

    const xRelativeToWrapper = clientX - left;
    const yRelativeToWrapper = clientY - top;

    const xOffsetDueToTranslation = translation.x;
    const yOffsetDueToTranslation = translation.y;

    const xOffsetDuetToScale = (width * (1 - scale)) / 2;
    const yOffsetDuetToScale = (height * (1 - scale)) / 2;

    const newX = xRelativeToWrapper - xOffsetDueToTranslation - xOffsetDuetToScale;
    const newY = yRelativeToWrapper - yOffsetDueToTranslation - yOffsetDuetToScale;

    const newCursorX = newX / scaleCapture;
    const newCursorY = newY / scaleCapture;

    return { x: newCursorX, y: newCursorY };
};

/**
 * Calculates relative position with store handling
 * Used in: Graph.svelte, CursorStore.ts
 */
export function calculateRelativePosition(
    dimensions: Readable<ExtendedDimensions>,
    transforms: {
        scale: Readable<number>;
        translation: Readable<XYPair>;
    },
    position: { x: number; y: number }
) {
    const { top, left, width, height } = get(dimensions);
    const scale = get(transforms.scale);
    const translation = get(transforms.translation);
    const scaled = calculateRelativeCursor(
        { clientX: position.x, clientY: position.y },
        top,
        left,
        width,
        height,
        scale,
        translation
    );
    return { scaled, scale };
}

/**
 * Updates translation based on cursor movement and scale
 * Used in: Graph.svelte, moveNodes.ts
 */
export function updateTranslation(
    initialClickPosition: XYPair,
    currentCursorPosition: XYPair,
    transforms: {
        scale: Readable<number>;
        translation: Readable<XYPair>;
    }
): XYPair {
    const { scale, translation } = transforms;
    const scaleValue = get(scale);
    const graphTranslation = get(translation);

    const deltaX = currentCursorPosition.x - initialClickPosition.x;
    const deltaY = currentCursorPosition.y - initialClickPosition.y;

    const newTranslationX = graphTranslation.x + deltaX * scaleValue;
    const newTranslationY = graphTranslation.y + deltaY * scaleValue;

    return { x: newTranslationX, y: newTranslationY };
}

/**
 * Calculates translation for zoom operations
 * Used in: Graph.svelte, zoomAndTranslate.ts
 */
export function calculateTranslation(
    oldScale: number,
    newScale: number,
    currentTranslation: XYPair,
    pointerPosition: XYPair,
    dimensions: ExtendedDimensions
) {
    const newTranslation = { x: 0, y: 0 };
    const pointerXRelativeToWrapper = pointerPosition.x - dimensions.left - dimensions.width / 2;
    const pointerYRelativeToWrapper = pointerPosition.y - dimensions.top - dimensions.height / 2;

    const pointerXRelativeToContent = (pointerXRelativeToWrapper - currentTranslation.x) / oldScale;
    const pointerYRelativeToContent = (pointerYRelativeToWrapper - currentTranslation.y) / oldScale;

    newTranslation.x = pointerXRelativeToWrapper - pointerXRelativeToContent * newScale;
    newTranslation.y = pointerYRelativeToWrapper - pointerYRelativeToContent * newScale;

    return newTranslation;
}

/**
 * Calculates fit view parameters for the graph
 * Used in: Graph.svelte, FitViewButton.svelte
 */
export function calculateFitView(
    dimensions: ExtendedDimensions,
    bounds: { top: number; left: number; right: number; bottom: number }
) {
    const { width, height } = dimensions;
    const { top, left, right, bottom } = bounds;
    const boundsWidth = right - left;
    const boundsHeight = bottom - top;

    if (!boundsWidth || !boundsHeight) return { x: null, y: null, scale: null };

    const centerX = left + boundsWidth / 2;
    const centerY = top + boundsHeight / 2;

    const scale = Math.min(width / boundsWidth, height / boundsHeight) * 0.8;

    const viewportCenterX = width / 2;
    const viewportCenterY = height / 2;

    const translateX = viewportCenterX - centerX;
    const translateY = viewportCenterY - centerY;

    return {
        x: translateX * scale,
        y: translateY * scale,
        scale: scale
    };
}

// Helper functions for calculateStepPath
function calculateDotProduct(vector1: XYPair, vector2: XYPair) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
}

function multiply(vector: XYPair, deltaX: number, deltaY: number) {
    return { x: vector.x * deltaX, y: vector.y * deltaY };
}

function areVectorsEqual(vector1: XYPair, vector2: XYPair): boolean {
    return vector1.x === vector2.x && vector1.y === vector2.y;
}

export function areCrossing(vec1: VectorPlusPosition, vec2: VectorPlusPosition) {
    const { x: dx1, y: dy1 } = vec1.direction;
    const { x: dx2, y: dy2 } = vec2.direction;
    const deltaX = vec2.x - vec1.x;
    const deltaY = vec2.y - vec1.y;

    if (dx1 * dy2 === dx2 * dy1) return false;
    return (
        (Math.sign(deltaY) === Math.sign(dy1 + dy2)) !== (Math.sign(deltaX) === Math.sign(dx1 + dx2))
    );
}

/**
 * Calculates the step path for edges with vector directions
 * Used in: Edge.svelte, EdgeRenderer.svelte
 */
export function calculateStepPath(
    source: VectorPlusPosition,
    target: VectorPlusPosition,
    buffer: number
) {
    const steps = [];

    const deltaX = target.x - source.x;
    const deltaY = target.y - source.y;

    const sameDirection = areVectorsEqual(source.direction, target.direction);
    const orthogonal = calculateDotProduct(source.direction, target.direction) === 0;
    const crossing = areCrossing(source, target);

    const oppositeSource = multiply(source.direction, -1, -1);
    const oppositeTarget = multiply(target.direction, -1, -1);
    const perpendicularSource = { x: Math.abs(source.direction.y), y: Math.abs(source.direction.x) };

    const sourceDirectionDelta = multiply(
        source.direction,
        deltaX - buffer * source.direction.x * (orthogonal ? 1 : sameDirection ? 0 : 2),
        deltaY - buffer * source.direction.y * (orthogonal ? 1 : sameDirection ? 0 : 2)
    );
    const targetDirectionDelta = multiply(
        target.direction,
        deltaX + buffer * target.direction.x * (orthogonal ? 1 : sameDirection ? 0 : 2),
        deltaY + buffer * target.direction.y * (orthogonal ? 1 : sameDirection ? 0 : 2)
    );

    const sourceReaching =
        Math.sign(sourceDirectionDelta.x) === -1 || Math.sign(sourceDirectionDelta.y) === -1;
    const targetReaching =
        Math.sign(targetDirectionDelta.x) === 1 || Math.sign(targetDirectionDelta.y) === 1;
    const absoluteX = Math.abs(deltaX);
    const absoluteY = Math.abs(deltaY);
    const sourceBuffer = multiply(source.direction, buffer, buffer);
    const oppositeTargetBuffer = multiply(oppositeTarget, buffer, buffer);
    const targetBuffer = multiply(target.direction, buffer, buffer);

    const fullSource = multiply(source.direction, absoluteX, absoluteY);
    const fullTarget = multiply(oppositeTarget, absoluteX, absoluteY);

    const halfSource = multiply(source.direction, absoluteX / 2, absoluteY / 2);
    const halfTarget = multiply(oppositeTarget, absoluteX / 2, absoluteY / 2);

    const fullDelta = multiply(perpendicularSource, deltaX, deltaY);

    const sourceFacingTarget = !crossing && !targetReaching && !sourceReaching;

    const sourceToXBuffer = source.x + sourceBuffer.x;
    const sourceToYBuffer = source.y + sourceBuffer.y;
    const targetToXBuffer = target.x + targetBuffer.x;
    const targetToYBuffer = target.y + targetBuffer.y;

    if (sourceReaching) steps.push(sourceBuffer);

    if (crossing && !targetReaching && !sourceReaching) {
        steps.push(fullSource);
        steps.push(fullTarget);
    } else if (sameDirection) {
        if (!sourceReaching) {
            steps.push(multiply(source.direction, buffer + absoluteX, buffer + absoluteY));
        }
        steps.push(fullDelta);
        if (!targetReaching) {
            steps.push(multiply(oppositeTarget, buffer + absoluteX, buffer + absoluteY));
        }
    } else if (sourceFacingTarget) {
        steps.push(halfSource);
        steps.push(fullDelta);
        steps.push(halfTarget);
    } else if (sourceReaching && targetReaching) {
        if (orthogonal) {
            const xReach = Math.abs(sourceToXBuffer - targetToXBuffer);
            const yReach = Math.abs(sourceToYBuffer - targetToYBuffer);
            steps.push(
                multiply(
                    target.direction,
                    absoluteX < buffer * 2
                        ? target.direction.x * (deltaX + target.direction.x * buffer)
                        : absoluteX + buffer,
                    absoluteY < buffer * 2
                        ? target.direction.y * (deltaY + target.direction.y * buffer)
                        : absoluteY + buffer
                )
            );
            steps.push(multiply(oppositeSource, xReach, yReach));
        } else {
            const xReach = Math.abs(sourceToXBuffer - targetToXBuffer);
            const yReach = Math.abs(sourceToYBuffer - targetToYBuffer);
            steps.push(multiply(perpendicularSource, deltaX / 2, deltaY / 2));
            steps.push(multiply(target.direction, xReach, yReach));
            steps.push(multiply(perpendicularSource, deltaX / 2, deltaY / 2));
        }
    } else if (sourceReaching) {
        const xReach = Math.abs(sourceToXBuffer - target.x);
        const yReach = Math.abs(sourceToYBuffer - target.y);
        steps.push(
            multiply(
                oppositeTarget,
                absoluteX < buffer * 2 ? absoluteX - buffer : absoluteX / 2,
                absoluteY < buffer * 2 ? absoluteY - buffer : absoluteY / 2
            )
        );
        steps.push(multiply(oppositeSource, xReach, yReach));
        steps.push(
            multiply(oppositeTarget, Math.max(buffer, absoluteX / 2), Math.max(buffer, absoluteY / 2))
        );
    } else if (targetReaching) {
        const xReach = Math.abs(targetToXBuffer - source.x);
        const yReach = Math.abs(targetToYBuffer - source.y);
        steps.push(
            multiply(source.direction, Math.max(buffer, absoluteX / 2), Math.max(buffer, absoluteY / 2))
        );
        steps.push(multiply(target.direction, xReach, yReach));
        steps.push(
            multiply(
                source.direction,
                absoluteX < buffer * 2 ? absoluteX - buffer : absoluteX / 2,
                absoluteY < buffer * 2 ? absoluteY - buffer : absoluteY / 2
            )
        );
    }

    if (targetReaching) {
        steps.push(oppositeTargetBuffer);
    }

    return steps;
}

/**
 * Calculates a point along an SVG path
 * Used in: Edge.svelte, EdgeRenderer.svelte
 */
export function calculatePath(path: SVGPathElement, position: number) {
    const pathLength = path.getTotalLength();
    const halfLength = pathLength * position;
    return path.getPointAtLength(halfLength);
}
