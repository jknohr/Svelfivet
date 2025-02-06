<svelte:options runes={true} />

<script lang="ts">
    import type { CSSColorString, Dimensions, XYPair } from '$lib/types';
    import type { UnifiedThemeContext } from '$lib/components/Templates/Canvas/types/theme';
    import { getContext } from 'svelte';
    import GlassPane from '$lib/components/Theme/GlassPane.svelte';
    import type { Snippet } from 'svelte';
    interface Props {
        dimensions: Dimensions;
        position: XYPair;
        color?: CSSColorString;
        groupName?: string;
        label?: string;
        glassPaneOpacity?: number;
        onclick?: (e: MouseEvent) => void;
        onhover?: (isHovered: boolean) => void;
        ondrag?: (isDragging: boolean) => void;
        children?: Snippet;
    }

    const props = $props();
    const theme = getContext<UnifiedThemeContext>('theme');
    
    // State
    let isHovered = $state(false);
    let isDragging = $state(false);
    
    // Derived values
    const id = $derived(`${props.groupName ?? 'default'}-bounding-box`);
    const ariaLabel = $derived(`Group ${props.groupName ?? 'default'}`);
    const color = $derived(props.color ?? theme.group.border);
    const glassOpacity = $derived(props.glassPaneOpacity ?? (isHovered ? 0.15 : 0.1));
    const borderWidth = $derived(isHovered ? '3px' : '2px');
    const borderStyle = $derived(isDragging ? 'dashed' : 'solid');

    // Effects for event handling
    $effect(() => {
        if (props.onhover) {
            props.onhover(isHovered);
        }
    });

    $effect(() => {
        if (props.ondrag) {
            props.ondrag(isDragging);
        }
    });

    // Event handlers
    function handleClick(e: MouseEvent) {
        if (props.onclick) {
            props.onclick(e);
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (props.onclick) {
                props.onclick(new MouseEvent('click'));
            }
        }
    }
</script>

<div
    role="button"
    tabindex="0"
    {id}
    aria-label={ariaLabel}
    style:top="{props.position.y}px"
    style:left="{props.position.x}px"
    style:width="{props.dimensions.width}px"
    style:height="{props.dimensions.height}px"
    style:border="{borderWidth} {borderStyle} {color}"
    class="bounding-box-container"
    onclick={handleClick}
    onkeydown={handleKeyDown}
    onmouseenter={() => isHovered = true}
    onmouseleave={() => {
        isHovered = false;
        isDragging = false;
    }}
    onmousedown={() => isDragging = true}
    onmouseup={() => isDragging = false}
>
    <GlassPane
        opacity={glassOpacity}
        color={theme.group.background}
        blur={2}
    />

    {#if props.label}
        <div class="group-label" style:color={theme.group.text}>
            {props.label}
        </div>
    {/if}

    {@render props.children?.()}
</div>

<style>
    .bounding-box-container {
        position: absolute;
        border-radius: 8px;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        overflow: visible;
    }

    .group-label {
        position: absolute;
        top: -24px;
        left: 8px;
        font-size: 14px;
        font-weight: 500;
        pointer-events: none;
        z-index: 1;
    }

    .bounding-box-container:focus-visible {
        outline: 2px solid var(--focus-color, #4299e1);
        outline-offset: 2px;
    }

    .bounding-box-container:hover {
        transform: scale(1.002);
    }

    /* Spatial adjustments */
    @media (--ar) {
        .bounding-box-container {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-floating));
        }
    }

    @media (--vr) {
        .bounding-box-container {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-ui));
        }
    }
</style>
