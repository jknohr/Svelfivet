<script lang="ts">
    import type { Pipeline, Workflow } from './ganntchart';
    import { topologicalSort } from './ganntchart';
    import type { DragEvent } from '$lib/components/Utility/DnD/dnd.types';

    let { 
        startDate = new Date(), 
        endDate = new Date(new Date().setDate(new Date().getDate() + 30)),
        pipelines = [] 
    } = $props<{
        startDate?: Date;
        endDate?: Date;
        pipelines: Pipeline[];
    }>();

    // Function to generate timeline labels
    function generateLabels() {
        const labels = [];
        const current = new Date(startDate);
        while (current <= endDate) {
            labels.push(current.toLocaleDateString());
            current.setDate(current.getDate() + 1);
        }
        return labels;
    }

    const labels = $derived(generateLabels());

    // Function to handle workflow drop
    function handleWorkflowDrop(event: DragEvent) {
        const sourceData = event.source.data;
        const targetData = event.target?.data;
        const movedWorkflow = sourceData.pipeline.workflows.find((wf: Workflow) => wf.id === event.item.id);
        if (movedWorkflow && targetData) {
            movedWorkflow.pipelineId = targetData.pipeline.id;
            pipelines = [...pipelines];
            // After reordering, sort workflows based on dependencies
            pipelines = pipelines.map((pipeline: Pipeline) => {
                return {
                    ...pipeline,
                    workflows: topologicalSort([pipeline])
                };
            });
        }
    }

</script>

<div class="timeline">
    <div class="timeline-labels">
        {#each labels as label}
            <div class="timeline-label">{label}</div>
        {/each}
    </div>
    <div class="timeline-grid">
        {#each labels as label}
            <div class="timeline-grid-item"></div>
        {/each}
    </div>
</div>

<style>
    .timeline {
        position: relative;
        margin-top: 1rem;
    }

    .timeline-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--text-light);
    }

    .timeline-label {
        flex: 1;
        text-align: center;
    }

    .timeline-grid {
        display: flex;
        justify-content: space-between;
        margin-top: 0.5rem;
    }

    .timeline-grid-item {
        flex: 1;
        height: 2px;
        background-color: var(--border);
    }
</style>