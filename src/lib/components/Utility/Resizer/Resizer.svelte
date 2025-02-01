<script lang="ts">
    import { useTheme } from '$lib/components/Theme/theme.state';
    import type { Dimensions } from '$lib/types';

    interface Props {
        width?: boolean;
        height?: boolean;
        rotation?: boolean;
        minHeight?: number;
        minWidth?: number;
        onResize?: (dimensions: Dimensions) => void;
        onRotate?: (angle: number) => void;
    }

    const props = $props<Props>();
    const { colors, transitions } = useTheme();

    let element = $state<HTMLElement | null>(null);
    let direction = $state(1);
    let startingRotation = $state(0);
    let initialClickAngle = $state(0);
    let initialPosition = $state({ x: 0, y: 0 });
    let initialDimensions = $state<Dimensions>({
        width: 0,
        height: 0
    });

    let isResizingWidth = $state(false);
    let isResizingHeight = $state(false);
    let isRotating = $state(false);

    // Derived values
    let currentDimensions = $derived({
        width: initialDimensions.width,
        height: initialDimensions.height
    });

    let centerPoint = $derived({
        x: initialPosition.x + currentDimensions.width / 2,
        y: initialPosition.y + currentDimensions.height / 2
    });

    // Resize handlers
    function resizeHandler(
        node: HTMLElement,
        options: { left?: boolean; right?: boolean; both?: boolean; top?: boolean; bottom?: boolean }
    ) {
        const setResize = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            direction = (options.left || options.top) ? -1 : 1;
            
            if (options.both) {
                isResizingWidth = true;
                isResizingHeight = true;
            } else {
                isResizingWidth = options.left || options.right || false;
                isResizingHeight = options.top || options.bottom || false;
            }

            initialPosition = { x: e.clientX, y: e.clientY };
            initialDimensions = currentDimensions;

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', removeResize);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = (e.clientX - initialPosition.x) * direction;
            const deltaY = (e.clientY - initialPosition.y) * direction;

            if (isResizingWidth) {
                currentDimensions.width = Math.max(props.minWidth ?? 0, initialDimensions.width + deltaX);
            }
            if (isResizingHeight) {
                currentDimensions.height = Math.max(props.minHeight ?? 0, initialDimensions.height + deltaY);
            }

            props.onResize?.(currentDimensions);
        };

        const removeResize = () => {
            isResizingWidth = false;
            isResizingHeight = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', removeResize);
        };

        node.addEventListener('mousedown', setResize);

        return {
            destroy() {
                node.removeEventListener('mousedown', setResize);
            }
        };
    }

    // Rotation handler
    function rotateHandler(node: HTMLElement) {
        const setRotation = (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            startingRotation = 0;
            initialPosition = { x: e.clientX, y: e.clientY };

            const initialDeltaX = initialPosition.x - centerPoint.x;
            const initialDeltaY = initialPosition.y - centerPoint.y;
            initialClickAngle = Math.atan2(initialDeltaY, initialDeltaX);

            isRotating = true;
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', removeRotation);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const currentDeltaX = e.clientX - centerPoint.x;
            const currentDeltaY = e.clientY - centerPoint.y;
            const currentAngle = Math.atan2(currentDeltaY, currentDeltaX);
            const angleDifference = initialClickAngle - currentAngle;
            const newAngle = startingRotation - (angleDifference * 180 / Math.PI);

            props.onRotate?.(newAngle);
        };

        const removeRotation = () => {
            isRotating = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', removeRotation);
        };

        node.addEventListener('mousedown', setRotation);

        return {
            destroy() {
                node.removeEventListener('mousedown', setRotation);
            }
        };
    }
</script>

<div bind:this={element} class="resizer-container">
    {#if props.width}
        <div 
            use:resizeHandler={{ left: true }} 
            class="handle width left"
            role="button"
            aria-label="Resize width from left"
            tabindex="0"
        />
        <div 
            use:resizeHandler={{ right: true }} 
            class="handle width right"
            role="button"
            aria-label="Resize width from right"
            tabindex="0"
        />
    {/if}

    {#if props.height}
        <div 
            use:resizeHandler={{ top: true }} 
            class="handle height top"
            role="button"
            aria-label="Resize height from top"
            tabindex="0"
        />
        <div 
            use:resizeHandler={{ bottom: true }} 
            class="handle height bottom"
            role="button"
            aria-label="Resize height from bottom"
            tabindex="0"
        />
    {/if}

    {#if props.width && props.height}
        <div 
            use:resizeHandler={{ both: true }} 
            class="handle both"
            role="button"
            aria-label="Resize both width and height"
            tabindex="0"
        />
    {/if}

    {#if props.rotation}
        <div 
            use:rotateHandler 
            class="handle rotation"
            role="button"
            aria-label="Rotate element"
            tabindex="0"
        />
    {/if}
</div>

<style>
    .resizer-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .handle {
        position: absolute;
        width: 9px;
        height: 9px;
        background: var(--handle-color, var(--color-primary));
        border-radius: var(--radius-sm);
        pointer-events: auto;
        transition: transform var(--transition-fast);
    }

    .handle:hover {
        transform: scale(1.2);
    }

    .width {
        height: calc(100% - 3px);
        top: -3px;
        cursor: col-resize;
    }

    .left {
        left: -6px;
    }

    .right {
        right: -6px;
    }

    .height {
        width: calc(100% - 3px);
        left: -3px;
        cursor: row-resize;
    }

    .top {
        top: -6px;
    }

    .bottom {
        bottom: -6px;
    }

    .both {
        bottom: -6px;
        right: -6px;
        cursor: nwse-resize;
    }

    .rotation {
        top: -6px;
        left: -6px;
        cursor: crosshair;
    }

    /* Spatial adjustments */
    @media (--ar), (--vr) {
        .handle {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-floating));
        }
    }
</style> 