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

    let theme = $state({
        colors: {
            primary: '#2563eb',
            secondary: '#4f46e5',
            accent: '#06b6d4',
            background: '#ffffff'
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
        children={mainContent}
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
