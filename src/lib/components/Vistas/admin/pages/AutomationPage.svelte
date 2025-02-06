<svelte:options runes={true} />

<script lang="ts">
    import BaseContentLayout from '$lib/components/Layouts/Body/Content/BaseContentLayout.svelte';
    import { fade } from 'svelte/transition';
    import { BASE } from '$lib/components/Theme/SpatialDesign';
    import KanbanBoard from '../components/KanbanBoard/KanbanBoard.svelte';
    import GanntChart from '../components/GanntChart/GanntChart.svelte';
    import WorkFlowDiagram from '../components/WorkFlowDiagram/WorkFlowDiagram.svelte';
    import type { Pipeline, Workflow } from '../components/GanntChart/ganntchart';

    // State Management
    let pageTitle = $state('Automation Dashboard');
    let selectedSection = $state('kanban');
    let selectedWorkflow = $state<string | null>(null);
    let selectedPipeline = $state<string | null>(null);

    // Kanban Board State
    let kanbanCards = $state([
        {
            id: '1',
            title: 'New Pipeline Project',
            section: 'conceptualizing',
            scheduledTime: null,
            description: 'Create a new pipeline for data processing',
            goal: 'Define pipeline architecture',
            linkedPipelines: [],
            linkToRepo: null,
            linkToCode: null
        }
    ]);

    // Gantt Chart State
    let pipelines = $state<Pipeline[]>([
        {
            id: '1',
            name: 'Data Processing Pipeline',
            workflows: [
                { id: 'w1', name: 'Data Collection', duration: 3, dependencies: [] },
                { id: 'w2', name: 'Data Cleaning', duration: 2, dependencies: ['w1'] },
                { id: 'w3', name: 'Data Analysis', duration: 4, dependencies: ['w2'] },
            ]
        }
    ]);

    // Workflow Diagram State
    let currentWorkflow = $state({
        nodes: [
            { id: 'n1', type: 'action', name: 'Start', x: 100, y: 100 },
            { id: 'n2', type: 'action', name: 'Process', x: 300, y: 100 },
            { id: 'n3', type: 'action', name: 'End', x: 500, y: 100 }
        ],
        edges: [
            { id: 'e1', source: 'n1', target: 'n2', label: 'Next', edgeStyle: 'success' },
            { id: 'e2', source: 'n2', target: 'n3', label: 'Complete', edgeStyle: 'success' }
        ]
    });

    // Event Handlers
    function handleKanbanCardMove(event: CustomEvent) {
        const { cardId, newSection } = event.detail;
        const card = kanbanCards.find(c => c.id === cardId);
        if (card) {
            card.section = newSection;
            if (newSection === 'scheduled') {
                card.scheduledTime = new Date();
            }
        }
    }

    function handlePipelineSelect(event: CustomEvent) {
        const { pipelineId } = event.detail;
        selectedPipeline = pipelineId;
    }

    function handleWorkflowSelect(event: CustomEvent) {
        const { workflowId } = event.detail;
        selectedWorkflow = workflowId;
        // Load workflow diagram for the selected workflow
        // This would typically fetch the workflow configuration from your backend
    }

    function selectSection(section: string) {
        selectedSection = section;
    }

    // Error handling
    function handleError(error: unknown) {
        console.error('An error occurred:', error);
    }
</script>

{#snippet mainContent}
    <div class="automation-content">
        <h1>{pageTitle}</h1>
        <div class="content-area" transition:fade>
            {#if selectedSection === 'kanban'}
                <section class="kanban-section">
                    <h2>Project Pipeline Management</h2>
                    <KanbanBoard 
                        cards={kanbanCards}
                        oncardmove={handleKanbanCardMove}
                    >
                </section>
            {:else if selectedSection === 'gantt'}
                <section class="gantt-section">
                    <h2>Pipeline Timeline</h2>
                    <GanntChart
                        pipelines={pipelines}
                        onselectpipeline={handlePipelineSelect}
                        onselectworkflow={handleWorkflowSelect}
                    >
                </section>
            {:else if selectedSection === 'workflow'}
                <section class="workflow-section">
                    <h2>Workflow Designer</h2>
                    <WorkFlowDiagram
                        workflow={currentWorkflow}
                    >
                </section>
            {/if}
        </div>
    </div>
{/snippet}

{#snippet leftPanel}
    <div class="left-panel">
        <h3>Automation Tools</h3>
        <nav>
            <div class="nav-items">
                <button 
                    class:selected={selectedSection === 'kanban'}
                    onclick={() => selectSection('kanban')}
                >Pipeline Projects</button>
                <button 
                    class:selected={selectedSection === 'gantt'}
                    onclick={() => selectSection('gantt')}
                >Timeline View</button>
                <button 
                    class:selected={selectedSection === 'workflow'}
                    onclick={() => selectSection('workflow')}
                >Workflow Editor</button>
            </div>
        </nav>
    </div>
{/snippet}

{#snippet rightPanel}
    <div class="right-panel">
        <h3>Project Details</h3>
        <div class="details-panel">
            {#if selectedPipeline}
                <div class="pipeline-details">
                    <h4>Selected Pipeline</h4>
                    {#if const pipeline = pipelines.find(p => p.id === selectedPipeline)}
                        <p>Name: {pipeline.name}</p>
                        <p>Workflows: {pipeline.workflows.length}</p>
                    {/if}
                </div>
            {/if}
            {#if selectedWorkflow}
                <div class="workflow-details">
                    <h4>Selected Workflow</h4>
                    {#if const workflow = pipelines.flatMap(p => p.workflows).find(w => w.id === selectedWorkflow)}
                        <p>Name: {workflow.name}</p>
                        <p>Duration: {workflow.duration} days</p>
                        <p>Dependencies: {workflow.dependencies.length}</p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
{/snippet}

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
    >
        {@render mainContent()}
        {@render leftPanel()}
        {@render rightPanel()}
    </BaseContentLayout>
</svelte:boundary>

<style>
    .automation-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: var(--spacing-md);
    }

    .nav-items {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: var(--spacing-md);
    }

    .nav-item {
        background: none;
        border: none;
        padding: 0.5rem 1rem;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s;
        color: var(--text-color);
        font-size: 1rem;
    }

    .nav-item:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .nav-item.selected {
        background-color: rgba(0, 0, 0, 0.1);
        font-weight: 500;
    }

    .content-area {
        margin-top: var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    section {
        padding: var(--spacing-md);
        background: var(--surface-background);
        border-radius: var(--radius-md);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    section h2 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--heading-color);
    }

    .left-panel {
        padding: var(--spacing-md);
        border-right: 1px solid var(--border-color);
    }

    .left-panel h3 {
        margin: 0;
        color: var(--heading-color);
    }

    .right-panel {
        padding: var(--spacing-md);
        border-left: 1px solid var(--border-color);
    }

    .right-panel h3 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--heading-color);
    }

    .status-info {
        padding: var(--spacing-sm);
        background: var(--surface-background);
        border-radius: var(--radius-sm);
    }

    .background {
        background: var(--surface-selected);
        border-radius: var(--radius-sm);
    }

    :global(.left-panel) nav ul li.selected {
        background: var(--surface-selected);
        border-radius: var(--radius-sm);
    }

    :global(.left-panel) nav ul li:hover {
        background: var(--surface-hover);
        border-radius: var(--radius-sm);
    }

    :global(.right-panel) {
        padding: var(--spacing-sm);
    }
</style>
