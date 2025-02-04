<!--
@component
Canvas theme provider that integrates with the main theme system and provides
canvas-specific theme values to its children.
-->
<script lang="ts">
    import { useTheme } from '$lib/components/Theme/theme.state';
    import type { UnifiedThemeContext } from '../types/theme';
    import { setContext } from 'svelte';

    interface Props {
        theme?: Partial<UnifiedThemeContext>;
        children?: any;
    }

    const props = $props();
    const theme = useTheme();

    // Effect to update canvas theme when props change
    $effect(() => {
        if (props.theme) {
            // Merge the provided theme with the current theme
            Object.assign(theme, props.theme);
        }
    });

    // Provide canvas theme context to children
    setContext('canvas-theme', theme);
</script>

<div class="canvas-theme-provider">
    {@render props.children?.()}
</div>

<style>
    .canvas-theme-provider {
        /* CSS variables for canvas-specific theme values */
        --canvas-border-color: var(--border-color);
        --canvas-background-color: var(--background-color);
        --canvas-text-color: var(--text-color);
        
        /* Inherit general theme properties */
        color: var(--text-color);
        background: var(--background-color);
        
        /* Full size container */
        width: 100%;
        height: 100%;
        position: relative;
    }
</style> 