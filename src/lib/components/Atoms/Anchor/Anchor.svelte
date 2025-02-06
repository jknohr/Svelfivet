<svelte:options runes={true} />

<script lang="ts">
    import { getContext } from 'svelte';
    import type { GlassEffect, GlassState, UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
    import type { ElementType, ElementRunes } from '$lib/components/Theme/ThemeElements';
    import GlassPane from '$lib/components/Theme/GlassPane.svelte';
    import { createElementRunes } from '$lib/components/Theme/ThemeElements';
    import type { AnchorMode, AnchorTarget, AnchorThemeConfig, AnchorPositionConfig } from './Anchor.types';
    import type { CSSColorString } from '$lib/types/general';
    import DefaultAnchor from './DefaultAnchor.svelte';
    import type { AnchorProps } from './Anchor.types';

    interface $$Props extends AnchorProps {}
    
    let props = $props<$$Props>();

    // Theme context
    const themeContext = getContext<UnifiedThemeContext>('theme');

    // Local state
    let isConnecting = $state(false);
    let isConnected = $state(false);
    let isHovering = $state(false);
    let position = $state({ x: 0, y: 0 });

    // Derived values
    let isActive = $derived(isConnecting || isHovering);
    let currentState = $derived.by(() => {
        if (isConnecting) return 'connecting' as GlassState;
        if (isHovering) return 'hovering' as GlassState;
        if (isConnected) return 'connected' as GlassState;
        return props.state || 'default' as GlassState;
    });

    // Element runes
    const elementRunes = createElementRunes(props.componentType || 'button' as ElementType);

    // Computed styles
    let anchorStyle = $derived.by(() => {
        return `
            position: absolute;
            left: ${position.x}px;
            top: ${position.y}px;
            transform: translate(-50%, -50%);
        `;
    });

    // Calculate position based on mode
    function calculatePosition() {
        if (props.mode === 'diagram') {
            return position;
        }

        if (!props.targetNode && !props.targetElement) return position;

        let targetRect: DOMRect;
        if (props.targetElement) {
            targetRect = props.targetElement.getBoundingClientRect();
        } else if (props.targetNode) {
            const nodeElement = document.querySelector(`[data-node="${props.targetNode.id}"]`);
            if (!nodeElement) return position;
            targetRect = nodeElement.getBoundingClientRect();
        } else {
            return position;
        }

        if (props.targetType === 'input' && props.targetId) {
            const inputElement = document.querySelector(`[data-input="${props.targetId}"]`);
            if (inputElement) {
                const inputRect = inputElement.getBoundingClientRect();
                const center = {
                    x: inputRect.left + inputRect.width / 2,
                    y: inputRect.top + inputRect.height / 2
                };
                return {
                    x: center.x + props.offset.x,
                    y: center.y + props.offset.y
                };
            }
        }

        const center = {
            x: targetRect.left + targetRect.width / 2,
            y: targetRect.top + targetRect.height / 2
        };

        const newPosition = {
            x: center.x + props.offset.x,
            y: center.y + props.offset.y
        };

        if (props.snapToGrid) {
            newPosition.x = Math.round(newPosition.x / props.snapThreshold) * props.snapThreshold;
            newPosition.y = Math.round(newPosition.y / props.snapThreshold) * props.snapThreshold;
        }

        return newPosition;
    }

    // Update position
    $effect(() => {
        if (props.autoPosition) {
            position = calculatePosition();
        }
    });
</script>

{#snippet content()}
    <GlassPane
        variant={props.variant || 'primary'}
        state={currentState}
        {props.glowOnHover}
        {props.componentType}
        style={anchorStyle}
        on:mouseenter={() => isHovering = true}
        on:mouseleave={() => isHovering = false}
    >
        <div class="anchor" style={anchorStyle} {...props}>
            <slot />
        </div>
    </GlassPane>
{/snippet}

<style>
    .anchor {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        cursor: pointer;
        user-select: none;
    }

    .invisible {
        opacity: 0;
        pointer-events: none;
    }

    /* Direction-based rotations */
    .anchor[data-direction="north"] { transform: rotate(0deg); }
    .anchor[data-direction="east"] { transform: rotate(90deg); }
    .anchor[data-direction="south"] { transform: rotate(180deg); }
    .anchor[data-direction="west"] { transform: rotate(270deg); }

    /* Spatial adjustments */
    @media (--ar) {
        .anchor {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-floating));
        }
    }

    @media (--vr) {
        .anchor {
            transform-style: preserve-3d;
            transform: translateZ(var(--depth-ui));
        }
    }
</style>
