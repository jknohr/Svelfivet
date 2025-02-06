<svelte:options runes={true} />

<script lang="ts">
    import type { CSSColorString, Direction } from '$lib/types';
    import { createEventDispatcher } from 'svelte';

    interface Props {
        direction: Direction;
        label?: string;
        color?: CSSColorString;
        size?: number;
        showLabel?: boolean;
    }

    interface Position {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
        transform: string;
    }

    const props = $props();
    const dispatch = createEventDispatcher();

    // State
    let isHovered = $state(false);
    let isConnecting = $state(false);

    // Derived values
    const size = $derived(props.size ?? 8);
    const showLabel = $derived(props.showLabel ?? true);
    const color = $derived(props.color ?? '#4299e1');
    let anchorPosition = $state<Position>({
        transform: 'translate(-50%, -50%)'
    });

    // Update position based on direction
    $effect(() => {
        switch (props.direction) {
            case 'north':
                anchorPosition = {
                    top: '0',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                };
                break;
            case 'south':
                anchorPosition = {
                    bottom: '0',
                    left: '50%',
                    transform: 'translate(-50%, 50%)'
                };
                break;
            case 'east':
                anchorPosition = {
                    right: '0',
                    top: '50%',
                    transform: 'translate(50%, -50%)'
                };
                break;
            case 'west':
                anchorPosition = {
                    left: '0',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                };
                break;
        }
    });

    // Event handlers
    function handleMouseEnter() {
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
        isConnecting = false;
    }

    function handleMouseDown(e: MouseEvent) {
        e.stopPropagation();
        isConnecting = true;
        dispatch('connect', {
            direction: props.direction,
            event: e
        });
    }

    function handleMouseUp() {
        isConnecting = false;
    }
</script>

<div
    class="anchor-point"
    class:hovered={isHovered}
    class:connecting={isConnecting}
    style:width="{size}px"
    style:height="{size}px"
    style:background-color={color}
    style:top={anchorPosition.top}
    style:left={anchorPosition.left}
    style:right={anchorPosition.right}
    style:bottom={anchorPosition.bottom}
    style:transform={anchorPosition.transform}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:mousedown={handleMouseDown}
    on:mouseup={handleMouseUp}
>
    {#if showLabel && props.label && isHovered}
        <div class="label" style:color={color}>
            {props.label}
        </div>
    {/if}
</div>

<style>
    .anchor-point {
        position: absolute;
        border-radius: 50%;
        cursor: crosshair;
        transition: all 0.2s ease-in-out;
        z-index: 10;
    }

    .anchor-point.hovered {
        transform: scale(1.5) !important;
    }

    .anchor-point.connecting {
        transform: scale(1.2) !important;
        filter: brightness(1.2);
    }

    .label {
        position: absolute;
        white-space: nowrap;
        font-size: 12px;
        font-weight: 500;
        pointer-events: none;
        transform: translate(-50%, -100%);
        top: -8px;
        left: 50%;
    }
</style> 
