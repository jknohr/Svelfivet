<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';

    let { 
        title = '',
        description = '',
        mainContent,
        leftComponent,
        rightComponent,
        spatialConfig = BASE,
        dimensions = {
            headerHeight: '60px',
            footerHeight: '60px',
            leftSidebarWidth: '250px',
            rightSidebarWidth: '250px',
            mainContentWidth: 'auto',
            expandedHeaderHeight: '120px',
            expandedSidebarWidth: '300px'
        }
    } = $props<{
        title: string;
        description: string;
        mainContent: Snippet;
        leftComponent?: Snippet;
        rightComponent?: Snippet;
        spatialConfig?: typeof BASE;
        dimensions?: {
            headerHeight?: string;
            footerHeight?: string;
            leftSidebarWidth?: string;
            rightSidebarWidth?: string;
            mainContentWidth?: string;
            expandedHeaderHeight?: string;
            expandedSidebarWidth?: string;
        };
    }>();

    // Create theme composition for the section
    const theme = createThemeComposition({
        colors: {
            primary: '#263238',
            secondary: '#37474F',
            accent: '#FF5722',
            background: '#ECEFF1',
            surface: '#FFFFFF',
            text: '#263238',
            textLight: '#78909C',
            textDark: '#102027',
            border: '#B0BEC5'
        },
        typography: {
            fontFamily: {
                base: 'Roboto, system-ui, sans-serif',
                heading: 'Roboto, system-ui, sans-serif',
                mono: 'Roboto Mono, monospace'
            }
        },
        glass: {
            tint: 'rgba(236, 239, 241, 0.7)',
            border: 'rgba(176, 190, 197, 0.3)',
            glow: 'rgba(255, 87, 34, 0.2)',
            shadow: 'rgba(38, 50, 56, 0.1)',
            highlight: 'rgba(255, 255, 255, 0.1)',
            backdrop: 'rgba(236, 239, 241, 0.5)'
        }
    });
</script>

<section class="admin-section" style:--theme-primary={theme.colors.primary}>
    <header>
        <h1>{title}</h1>
        <p>{description}</p>
    </header>

    <BaseContentLayout
        {spatialConfig}
        {dimensions}
        mainContent={mainContent}
        leftComponent={leftComponent}
        rightComponent={rightComponent}
    />
</section>

<style>
    .admin-section {
        min-height: 100vh;
        padding: var(--spacing-xl) 0;
        scroll-margin-top: var(--spacing-xl);
    }

    header {
        max-width: 1200px;
        margin: 0 auto var(--spacing-xl);
        padding: 0 var(--spacing-md);
    }

    h1 {
        font-size: var(--fontSize-xxl);
        font-weight: var(--fontWeight-bold);
        color: var(--theme-primary);
        margin: 0;
    }

    p {
        color: var(--textLight);
        margin: var(--spacing-xs) 0 0;
    }
</style>
