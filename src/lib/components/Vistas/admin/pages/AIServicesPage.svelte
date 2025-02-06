<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import { fade } from 'svelte/transition';

    // State Management
    let pageTitle = $state('Automation');
    let selectedSection = $state('workflows');
    let visible = $state(true);

    // Data
    let workflows = $state([
        { id: 1, name: 'Workflow 1' },
        { id: 2, name: 'Workflow 2' }
    ]);

    let rules = $state([
        { id: 1, name: 'Rule 1' },
        { id: 2, name: 'Rule 2' }
    ]);

    let schedules = $state([
        { id: 1, name: 'Schedule 1' },
        { id: 2, name: 'Schedule 2' }
    ]);

    // Derived State
    let activeAutomationsCount = $derived(workflows.length + rules.length + schedules.length);

    // Action Handlers
    function selectSection(section: string) {
        pageTitle = `Automation - ${section.charAt(0).toUpperCase() + section.slice(1)}`;
        selectedSection = section;
    }

    function handleError(error: unknown) {
        console.error('Error in Automation component:', error);
    }

    // Debug Effects
    $effect(() => {
        console.log('State Debug:', {
            pageTitle,
            workflowsCount: workflows.length,
            rulesCount: rules.length,
            schedulesCount: schedules.length,
            activeAutomationsCount
        });
    });
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<svelte:boundary onerror={handleError}>
    <BaseContentLayout
        spatialConfig={BASE}
        dimensions={{
            leftSidebarWidth: '250px',
            rightSidebarWidth: '250px',
            mainContentWidth: 'auto'
        }}
        mainContent={null}
        children={null}
    >
        <div slot="left-panel" class="left-panel">
            <h3>Automation Tools</h3>
            <nav>
                <ul role="menu">
                    <li role="none">
                        <button
                            type="button"
                            role="menuitem"
                            class:selected={selectedSection === 'workflows'}
                            onclick={() => selectSection('workflows')}
                            onkeydown={e => e.key === 'Enter' && selectSection('workflows')}
                        >Workflows</button>
                    </li>
                    <li role="none">
                        <button
                            type="button"
                            role="menuitem"
                            class:selected={selectedSection === 'rules'}
                            onclick={() => selectSection('rules')}
                            onkeydown={e => e.key === 'Enter' && selectSection('rules')}
                        >Rules</button>
                    </li>
                    <li role="none">
                        <button
                            type="button"
                            role="menuitem"
                            class:selected={selectedSection === 'triggers'}
                            onclick={() => selectSection('triggers')}
                            onkeydown={e => e.key === 'Enter' && selectSection('triggers')}
                        >Triggers</button>
                    </li>
                    <li role="none">
                        <button
                            type="button"
                            role="menuitem"
                            class:selected={selectedSection === 'actions'}
                            onclick={() => selectSection('actions')}
                            onkeydown={e => e.key === 'Enter' && selectSection('actions')}
                        >Actions</button>
                    </li>
                    <li role="none">
                        <button
                            type="button"
                            role="menuitem"
                            class:selected={selectedSection === 'schedules'}
                            onclick={() => selectSection('schedules')}
                            onkeydown={e => e.key === 'Enter' && selectSection('schedules')}
                        >Schedules</button>
                    </li>
                </ul>
            </nav>
        </div>

        <div slot="main-content" class="automation-content">
            <h1>{pageTitle}</h1>
            <button onclick={() => visible = !visible}>Toggle Workflows</button>

            {#if visible}
                <div transition:fade>
                    <div class="content-area">
                        <section class="workflows-section">
                            <h2>Workflows</h2>
                            {#each workflows as workflow}
                                <p>{workflow.name}</p>
                            {/each}
                        </section>
                        
                        <section class="rules-section">
                            <h2>Rules Engine</h2>
                            {#each rules as rule}
                                <p>{rule.name}</p>
                            {/each}
                        </section>
                        
                        <section class="schedules-section">
                            <h2>Scheduled Tasks</h2>
                            {#each schedules as schedule}
                                <p>{schedule.name}</p>
                            {/each}
                        </section>
                    </div>
                </div>
            {/if}
        </div>

        <div slot="right-panel" class="right-panel">
            <h3>Active Automations</h3>
            <div class="status-info">
                <p>Total Active Automations: {activeAutomationsCount}</p>
            </div>
        </div>
    </BaseContentLayout>
</svelte:boundary>

<style>
    .automation-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .content-area {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    section {
        padding: var(--spacing-md);
        background: var(--surface-background);
        border-radius: var(--radius-md);
    }

    .left-panel {
        padding: var(--spacing-sm);
    }

    .left-panel nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .left-panel nav ul li {
        margin: 0;
        padding: 0;
    }

    .left-panel nav ul li button {
        width: 100%;
        text-align: left;
        cursor: pointer;
        padding: var(--spacing-sm);
        border: none;
        background: none;
        border-radius: var(--radius-sm);
        transition: background-color 0.2s ease;
        color: inherit;
        font: inherit;
    }

    .left-panel nav ul li button:hover {
        background: var(--surface-hover);
    }

    .left-panel nav ul li button.selected {
        background: var(--surface-active);
    }

    .right-panel {
        padding: var(--spacing-sm);
    }
</style>