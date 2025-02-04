<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import NavigationDivider from '$lib/components/Utility/Navigation/NavigationDivider.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import type { Snippet } from 'svelte';

    let pageTitle = $state('System Administration');
    let activeSection = $state('dashboard');
    let activeSubsection = $state<string | undefined>(undefined);
    let contentElement: HTMLElement;

    // Section definitions with subsections
    const sections = [
        { 
            id: 'dashboard', 
            label: 'Dashboard', 
            icon: 'dashboard',
            subsections: [
                { id: 'overview', label: 'Overview', icon: 'view_quilt' },
                { id: 'analytics', label: 'Analytics', icon: 'analytics' },
                { id: 'reports', label: 'Reports', icon: 'description' }
            ]
        },
        { 
            id: 'users', 
            label: 'Users', 
            icon: 'group',
            subsections: [
                { id: 'management', label: 'Management', icon: 'manage_accounts' },
                { id: 'roles', label: 'Roles', icon: 'admin_panel_settings' },
                { id: 'permissions', label: 'Permissions', icon: 'security' }
            ]
        },
        { 
            id: 'settings', 
            label: 'Settings', 
            icon: 'settings',
            subsections: [
                { id: 'general', label: 'General', icon: 'tune' },
                { id: 'security', label: 'Security', icon: 'security' },
                { id: 'integrations', label: 'Integrations', icon: 'integration_instructions' }
            ]
        },
        { 
            id: 'resources', 
            label: 'Resources', 
            icon: 'memory',
            subsections: [
                { id: 'servers', label: 'Servers', icon: 'dns' },
                { id: 'storage', label: 'Storage', icon: 'storage' },
                { id: 'network', label: 'Network', icon: 'network_check' }
            ]
        }
    ];

    // Scroll to section
    function scrollToSection(sectionId: string, subsectionId?: string) {
        const elementId = subsectionId ? `${sectionId}-${subsectionId}` : sectionId;
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Update active section based on scroll position
    function updateActiveSection() {
        if (!contentElement) return;

        const scrollPosition = contentElement.scrollTop;
        const elements = contentElement.querySelectorAll('[id]');

        for (const element of elements) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollPosition - contentElement.offsetTop;
            
            if (scrollPosition >= elementTop - 100) {
                const [section, subsection] = element.id.split('-');
                activeSection = section;
                activeSubsection = subsection;
            }
        }
    }

    // Effect for scroll tracking
    $effect(() => {
        if (!contentElement) return;
        const handleScroll = () => updateActiveSection();
        contentElement.addEventListener('scroll', handleScroll);
        return () => contentElement.removeEventListener('scroll', handleScroll);
    });
    
    // Main content snippet
    const mainContent: Snippet = () => {
        return (
            <div class="content-wrapper">
                <NavigationDivider 
                    currentSection={activeSection}
                    currentSubsection={activeSubsection}
                    sections={sections}
                    onSectionClick={(id) => scrollToSection(id)}
                    onSubsectionClick={(sectionId, subsectionId) => scrollToSection(sectionId, subsectionId)}
                />
                <div class="system-content" bind:this={contentElement}>
                    {#each sections as { id: sectionId, label, subsections }}
                        <section id={sectionId}>
                            <h2>{label}</h2>
                            {#if subsections}
                                {#each subsections as { id: subsectionId, label: sublabel }}
                                    <div id={`${sectionId}-${subsectionId}`} class="subsection">
                                        <h3>{sublabel}</h3>
                                        <div class="section-content">
                                            <!-- Example content for each subsection -->
                                            <div class="placeholder-content">
                                                <p>This is the {sublabel.toLowerCase()} section under {label}.</p>
                                                {#each Array(3) as _}
                                                    <div class="content-block">
                                                        <p>Sample content for {sublabel}</p>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            {/if}
                        </section>
                    {/each}
                </div>
            </div>
        )
    }

    // Navigation panel
    const leftPanel: Snippet = () => {
        return (
            <div class="left-panel">
                <h3>Quick Navigation</h3>
                <nav>
                    <ul>
                        {#each sections as { id, label, icon, subsections }}
                            <li 
                                class:active={activeSection === id}
                                onclick={() => scrollToSection(id)}
                            >
                                <i class="material-icons">{icon}</i>
                                <span>{label}</span>
                            </li>
                            {#if subsections}
                                <div class="subsection-nav" class:visible={activeSection === id}>
                                    {#each subsections as { id: subId, label: sublabel, icon: subicon }}
                                        <li 
                                            class:active={activeSubsection === subId}
                                            onclick={() => scrollToSection(id, subId)}
                                        >
                                            <i class="material-icons">{subicon}</i>
                                            <span>{sublabel}</span>
                                        </li>
                                    {/each}
                                </div>
                            {/if}
                        {/each}
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
    .content-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .system-content {
        flex: 1;
        overflow-y: auto;
        scroll-behavior: smooth;
        padding: var(--spacing-md);
    }

    section {
        margin-bottom: var(--spacing-xl);
    }

    .subsection {
        margin: var(--spacing-lg) 0;
        padding: var(--spacing-lg);
        background: var(--surface-background);
        border-radius: var(--radius-md);
    }

    .section-content {
        margin-top: var(--spacing-md);
    }

    .content-block {
        margin: var(--spacing-md) 0;
        padding: var(--spacing-md);
        background: var(--surface-variant);
        border-radius: var(--radius-sm);
    }

    :global(.left-panel) {
        padding: var(--spacing-sm);
    }

    :global(.left-panel) nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        position: sticky;
        top: var(--spacing-md);
    }

    :global(.left-panel) nav ul li {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        margin-bottom: var(--spacing-xs);
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
    }

    .subsection-nav {
        margin-left: var(--spacing-md);
        height: 0;
        overflow: hidden;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .subsection-nav.visible {
        height: auto;
        opacity: 1;
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

    @media (prefers-reduced-motion: reduce) {
        .system-content {
            scroll-behavior: auto;
        }
        .subsection-nav {
            transition: none;
        }
    }
</style>
