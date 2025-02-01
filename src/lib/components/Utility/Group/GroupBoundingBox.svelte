<!--
@component
Base bounding box component for groups. Provides the core functionality for
showing boundaries and handling resize/move operations.
-->
<script lang="ts">
    import { useTheme } from '$lib/components/Theme/theme.state';
    import type { BaseComponentProps } from '../types';
    import type { Dimensions } from '../types';

    interface Props extends BaseComponentProps {
        dimensions?: Dimensions;
        borderStyle?: string;
        borderWidth?: string;
        borderColor?: string;
        backgroundColor?: string;
        opacity?: number;
        interactive?: boolean;
    }

    const props = $props<Props>();
    const { colors } = useTheme();

    // State
    let element = $state<HTMLElement | null>(null);
    let isHovered = $state(false);

    // Computed styles
    const styles = $derived({
        border: `${props.borderWidth || '1px'} ${props.borderStyle || 'solid'} ${props.borderColor || colors.border}`,
        background: props.backgroundColor || 'transparent',
        opacity: isHovered ? (props.opacity || 0.2) + 0.1 : props.opacity || 0.2,
        width: props.dimensions?.width ? `${props.dimensions.width}px` : '100%',
        height: props.dimensions?.height ? `${props.dimensions.height}px` : '100%',
        transition: 'opacity 0.2s ease'
    });
</script>

<div
    bind:this={element}
    class="bounding-box"
    class:interactive={props.interactive}
    style={Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join(';')}
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
>
    <slot />
</div>

<style>
    .bounding-box {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        box-sizing: border-box;
    }

    .interactive {
        pointer-events: auto;
        cursor: pointer;
    }
</style> 