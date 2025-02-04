<script lang="ts">
    import { page } from '$app/stores';
    import SystemSection from './sections/SystemSection.svelte';
    import MonitoringSection from './sections/MonitoringSection.svelte';
    import ContentSection from './sections/ContentSection.svelte';
    import AISection from './sections/AISection.svelte';
    import AutomationSection from './sections/AutomationSection.svelte';
    import IntegrationSection from './sections/IntegrationSection.svelte';

    let activeSection = $state('system');
    let scrollContainer;

    function scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Update active section based on scroll position
    function handleScroll(e) {
        const sections = document.querySelectorAll('.admin-section');
        let current = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100) {
                current = section.id;
            }
        });

        if (current) {
            activeSection = current;
            // Update URL without triggering navigation
            history.replaceState(null, '', `/admin/${current}`);
        }
    }
</script>

<div class="admin-body" bind:this={scrollContainer} onscroll={handleScroll}>
    <nav class="section-nav">
        <button 
            class:active={activeSection === 'system'}
            onclick={() => scrollToSection('system')}
        >
            System
        </button>
        <button 
            class:active={activeSection === 'monitoring'}
            onclick={() => scrollToSection('monitoring')}
        >
            Monitoring
        </button>
        <button 
            class:active={activeSection === 'content'}
            onclick={() => scrollToSection('content')}
        >
            Content
        </button>
        <button 
            class:active={activeSection === 'ai'}
            onclick={() => scrollToSection('ai')}
        >
            AI Services
        </button>
        <button 
            class:active={activeSection === 'automation'}
            onclick={() => scrollToSection('automation')}
        >
            Automation
        </button>
        <button 
            class:active={activeSection === 'integration'}
            onclick={() => scrollToSection('integration')}
        >
            Integration
        </button>
    </nav>

    <div class="sections-container">
        <section id="system" class="admin-section">
            <SystemSection />
        </section>

        <section id="monitoring" class="admin-section">
            <MonitoringSection />
        </section>

        <section id="content" class="admin-section">
            <ContentSection />
        </section>

        <section id="ai" class="admin-section">
            <AISection />
        </section>

        <section id="automation" class="admin-section">
            <AutomationSection />
        </section>

        <section id="integration" class="admin-section">
            <IntegrationSection />
        </section>
    </div>
</div>

<style>
    .admin-body {
        height: 100%;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--spacing-md);
        background: var(--background);
        color: var(--text);
    }

    .section-nav {
        position: sticky;
        top: 0;
        height: 100vh;
        padding: var(--spacing-md);
        background: var(--surface);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .section-nav button {
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        background: none;
        color: var(--text);
        text-align: left;
        cursor: pointer;
        border-radius: var(--borderRadius-sm);
        transition: all var(--duration-fast) var(--easing-standard);
    }

    .section-nav button:hover {
        background: var(--glass-tint);
    }

    .section-nav button.active {
        background: var(--primary);
        color: var(--surface);
    }

    .sections-container {
        padding: var(--spacing-md);
        overflow-y: auto;
    }

    .admin-section {
        min-height: 100vh;
        padding: var(--spacing-xl) 0;
        scroll-margin-top: var(--spacing-xl);
    }

    .admin-section:not(:last-child) {
        border-bottom: 1px solid var(--border);
    }
</style>
