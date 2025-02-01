<svelte:options runes={true} />

<script lang="ts">
    import type { GlassEffect, GlassState } from '$lib/components/Theme/Theme.types';
    import type { ElementType } from '$lib/components/Theme/ThemeElements';
    import type { CSSColorString } from '$lib/types/general';
    import { createElementRunes } from '$lib/components/Theme/ThemeElements';
    import GlassPane from '$lib/components/Theme/GlassPane.svelte';
    import type { Snippet } from 'svelte';

    // Props
    let {
        // Theme props
        variant = 'light' as GlassEffect,
        state = 'default' as GlassState,
        glowOnHover = true,
        componentType = 'anchor' as ElementType,
        // Style props
        size = 'md',
        color = null as CSSColorString | null,
        // Content
        children = undefined as Snippet | undefined
    } = $props();

    // Create element runes
    const element = createElementRunes(componentType);
    const elementState = element.state.create();

    // Compute styles
    let anchorStyle = $derived.by(() => {
        const styles = [];
        if (color) styles.push(`--prop-anchor-color: ${color}`);
        styles.push(`--anchor-size: var(--size-${size})`);
        return styles.join(';');
    });
</script>

<div class="base-anchor" style={anchorStyle}>
    <GlassPane
        {variant}
        {state}
        {glowOnHover}
        {componentType}
    >
        {#if children}
            {@render children()}
        {/if}
    </GlassPane>
</div>

<style>
    .base-anchor {
        width: var(--anchor-size, var(--size-md));
        height: var(--anchor-size, var(--size-md));
        border-radius: var(--radius-full);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        z-index: var(--layer-overlay);
    }
</style> 
