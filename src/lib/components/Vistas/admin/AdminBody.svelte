<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';
    
    // Import admin pages
    import SystemPage from './pages/SystemPage.svelte';
    import MonitoringPage from './pages/MonitoringPage.svelte';
    import ContentPage from './pages/ContentPage.svelte';
    import AIServicesPage from './pages/AIServicesPage.svelte';
    import AutomationPage from './pages/AutomationPage.svelte';

    // Active page state
    let currentPage = $state('system');
    let pageTitle = $derived(getPageTitle(currentPage));
    
    // Page components mapping
    const pages = {
        system: SystemPage,
        monitoring: MonitoringPage,
        content: ContentPage,
        ai: AIServicesPage,
        automation: AutomationPage
    };

    function getPageTitle(page: string) {
        const titles = {
            system: 'System Administration',
            monitoring: 'System Monitoring',
            content: 'Content Management',
            ai: 'AI Services',
            automation: 'Automation'
        };
        return titles[page] || 'Admin Vista';
    }

    // Main content snippet
    const mainContent: Snippet = () => {
        const PageComponent = pages[currentPage];
        return (
            <div class="admin-content">
                <PageComponent />
            </div>
        )
    }

    // Navigation panel
    const leftPanel: Snippet = () => {
        return (
            <div class="left-panel">
                <h3>Admin Navigation</h3>
                <nav>
                    <ul>
                        <li 
                            class:active={currentPage === 'system'}
                            onclick={() => currentPage = 'system'}
                        >
                            <i class="material-icons">admin_panel_settings</i>
                            System
                        </li>
                        <li 
                            class:active={currentPage === 'monitoring'}
                            onclick={() => currentPage = 'monitoring'}
                        >
                            <i class="material-icons">monitoring</i>
                            Monitoring
                        </li>
                        <li 
                            class:active={currentPage === 'content'}
                            onclick={() => currentPage = 'content'}
                        >
                            <i class="material-icons">article</i>
                            Content
                        </li>
                        <li 
                            class:active={currentPage === 'ai'}
                            onclick={() => currentPage = 'ai'}
                        >
                            <i class="material-icons">smart_toy</i>
                            AI Services
                        </li>
                        <li 
                            class:active={currentPage === 'automation'}
                            onclick={() => currentPage = 'automation'}
                        >
                            <i class="material-icons">auto_fix_high</i>
                            Automation
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
</script>

<BaseContentLayout
    spatialConfig={BASE}
    {mainContent}
    leftComponent={leftPanel}
    dimensions={{
        leftSidebarWidth: '250px',
        mainContentWidth: 'auto'
    }}
/>

<style>
    .admin-content {
        height: 100%;
    }

    :global(.left-panel) {
        padding: var(--spacing-sm);
    }

    :global(.left-panel) nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    :global(.left-panel) nav ul li {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        margin-bottom: var(--spacing-xs);
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: background-color 0.2s ease;
    }

    :global(.left-panel) nav ul li:hover {
        background: var(--surface-hover);
    }

    :global(.left-panel) nav ul li.active {
        background: var(--primary-container);
        color: var(--on-primary-container);
    }

    :global(.left-panel) nav ul li i {
        font-size: 1.25rem;
    }
</style>
