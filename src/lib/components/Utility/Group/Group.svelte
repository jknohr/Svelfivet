<script lang="ts">
    import { useTheme } from '$lib/components/Theme/theme.state';
    import GlassPane from '$lib/components/Theme/GlassPane.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        width?: number;
        height?: number;
        position?: { x: number; y: number } | null;
        color?: string;
        label?: string;
        glassPaneOpacity?: number;
        allowNesting?: boolean;
        children?: Snippet;
    }

    const props = $props<Props>();
    const { colors } = useTheme();

    // State
    let dimensions = $state({
        width: props.width ?? 0,
        height: props.height ?? 0
    });
    let position = $state(props.position);
    let color = $state(props.color ?? colors.border);
    let isHovered = $state(false);
    let isDragging = $state(false);

    // Derived values
    let glassOpacity = $derived(props.glassPaneOpacity ?? (isHovered ? 0.15 : 0.1));
    let borderWidth = $derived(isHovered ? '3px' : '2px');
    let borderStyle = $derived(isDragging ? 'dashed' : 'solid');

    // Effects
    $effect(() => {
        if (props.width !== undefined) dimensions.width = props.width;
        if (props.height !== undefined) dimensions.height = props.height;
    });

    // Event handlers
    function handleMouseEnter() {
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
    }

    function handleMouseDown() {
        isDragging = true;
    }

    function handleMouseUp() {
        isDragging = false;
    }
</script>

<div
    class="group-container"
    style:width="{dimensions.width}px"
    style:height="{dimensions.height}px"
    style:transform="translate({position?.x ?? 0}px, {position?.y ?? 0}px)"
    style:border="{borderWidth} {borderStyle} {color}"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onmousedown={handleMouseDown}
    onmouseup={handleMouseUp}
>
    <GlassPane
        opacity={glassOpacity}
        color={colors.background}
        blur={2}
    />
    
    {#if props.label}
        <div class="group-label" style:color={colors.text}>
            {props.label}
        </div>
    {/if}

    {@render props.children?.()}
</div>

<style>
    .group-container {
        position: relative;
        border-radius: var(--radius-lg);
        transition: var(--transition-normal);
        overflow: visible;
        touch-action: none;
        user-select: none;
    }

    .group-label {
        position: absolute;
        top: -24px;
        left: 8px;
        font-size: 14px;
        font-weight: 500;
        pointer-events: none;
    }

    @media (--ar), (--vr) {
        .group-container {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-floating));
        }
    }
</style> 