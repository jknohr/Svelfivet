<svelte:options runes />

<script lang="ts">
    import GanntWorkFlowBar from './GanntWorkFlowBar.svelte';
    import GanntTimeline from './GanntTimeline.svelte';
    import type { DragEvent } from '$lib/components/Utility/DnD/dnd.types';
    import { draggable, droppable } from '$lib/components/Utility/DnD/dnd';
    import type { Pipeline, Workflow } from './ganntchart';
    import { topologicalSort } from './ganntchart';

    // Define pipeline data
    let pipelines = $state<Pipeline[]>([
        {
            id: '1',
            name: 'Pipeline 1',
            workflows: [
                { id: 'w1', name: 'Workflow A', duration: 3, dependencies: [] },
                { id: 'w2', name: 'Workflow B', duration: 2, dependencies: ['w1'] },
                { id: 'w3', name: 'Workflow C', duration: 4, dependencies: [] },
            ]
        },
        {
            id: '2',
            name: 'Pipeline 2',
            workflows: [
                { id: 'w4', name: 'Workflow D', duration: 5, dependencies: [] },
                { id: 'w5', name: 'Workflow E', duration: 1, dependencies: ['w4'] },
            ]
        }
    ]);

    // Function to handle adding a new workflow
    function addWorkflow(pipelineId: string) {
        const newWorkflow = {
            id: Date.now().toString(),
            name: 'New Workflow',
            duration: 2,
            dependencies: []
        };
        pipelines = pipelines.map(pipeline => {
            if (pipeline.id === pipelineId) {
                return { ...pipeline, workflows: [...pipeline.workflows, newWorkflow] };
            }
            return pipeline;
        });
    }

    // Function to handle deleting a workflow
    function deleteWorkflow(pipelineId: string, workflowId: string) {
        pipelines = pipelines.map(pipeline => {
            if (pipeline.id === pipelineId) {
                return {
                    ...pipeline,
                    workflows: pipeline.workflows.filter(workflow => workflow.id !== workflowId)
                };
            }
            return pipeline;
        });
    }

    // Function to update a workflow
    function updateWorkflow(updatedWorkflow: Workflow) {
        pipelines = pipelines.map(pipeline => {
            if (pipeline.id === updatedWorkflow.pipelineId) {
                return {
                    ...pipeline,
                    workflows: pipeline.workflows.map(workflow => 
                        workflow.id === updatedWorkflow.id ? updatedWorkflow : workflow
                    )
                };
            }
            return pipeline;
        });
    }

    // Function to handle workflow drag and drop
    function handleWorkflowDrop(event: DragEvent) {
        const sourcePipelineId = event.source.id;
        const targetPipelineId = event.target?.id;
        const workflowData = event.item;

        if (!targetPipelineId || !workflowData) return;

        const sourcePipeline = pipelines.find(p => p.id === sourcePipelineId);
        const targetPipeline = pipelines.find(p => p.id === targetPipelineId);

        if (!sourcePipeline || !targetPipeline) return;

        // Remove from source pipeline
        sourcePipeline.workflows = sourcePipeline.workflows.filter(w => w.id !== workflowData.id);
        
        // Add to target pipeline
        const movedWorkflow = { ...workflowData, pipelineId: targetPipelineId };
        targetPipeline.workflows = topologicalSort([{ ...targetPipeline, workflows: [...targetPipeline.workflows, movedWorkflow] }]);
        
        // Trigger reactivity
        pipelines = [...pipelines];
    }</script>

<div class="gantt-chart">
    <h1>Gantt Chart</h1>
    <div class="pipelines-container">
        {#each pipelines as pipeline}
            <div class="pipeline" 
                 use:droppable={{ 
                     target: {
                         id: pipeline.id,
                         accept: ['workflow']
                     },
                     onDrop: handleWorkflowDrop,
                     feedback: {
                         dropTargetClass: 'drop-target-hover'
                     }
                 }}>
                <h2>{pipeline.name}</h2>
                <GanntTimeline pipelines={pipelines} />
                {#each pipeline.workflows as workflow}
                    <div use:draggable={{ 
                            source: {
                                id: pipeline.id,
                                data: workflow,
                                group: 'workflow'
                            },
                            constraints: {
                                axis: 'y'
                            },
                            feedback: {
                                dragClass: 'dragging',
                                previewClass: 'drag-preview'
                            }
                        }}>
                        <GanntWorkFlowBar 
                            workflow={workflow}
                            pipeline={pipeline}
                            onUpdate={updateWorkflow}
                            onDelete={deleteWorkflow}
                        />
                    </div>
                {/each}
                <button class="add-workflow-button" onclick={() => addWorkflow(pipeline.id)}>
                    + Add Workflow
                </button>
            </div>
        {/each}
    </div>
</div>

<style>
    .gantt-chart {
        padding: 1rem;
        background-color: var(--surface);
    }

    h1 {
        text-align: center;
        margin-bottom: 1rem;
        color: var(--text);
    }

    .pipelines-container {
        display: flex;
        gap: 1rem;
        overflow-x: auto;
    }

    .pipeline {
        flex: 0 0 400px;
        background-color: var(--surface-variant);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        transition: background-color 0.2s ease;
    }

    .drop-target-hover {
        background-color: var(--states-hover);
    }

    .dragging {
        opacity: 0.5;
    }

    .drag-preview {
        opacity: 0.8;
        pointer-events: none;
        z-index: 1000;
    }

    h2 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
        color: var(--text);
    }

    .add-workflow-button {
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: var(--primary);
        color: var(--surface);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .add-workflow-button:hover {
        background-color: var(--states-focus);
    }
</style>