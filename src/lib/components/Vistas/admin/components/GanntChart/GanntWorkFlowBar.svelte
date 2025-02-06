<script lang="ts">
    let { workflow, pipeline, onUpdate, onDelete } = $props<{
        workflow: {
            id: string;
            name: string;
            duration: number;
            dependencies: string[];
        };
        pipeline: {
            id: string;
            name: string;
            workflows: any[];
        };
        onUpdate: (workflow: any) => void;
        onDelete: (pipelineId: string, workflowId: string) => void;
    }>();
</script>

<div class="workflow-bar" style="width: {workflow.duration * 50}px;">
    <h3>{workflow.name}</h3>
    <p>Duration: {workflow.duration} days</p>
    <button class="delete-workflow-button" onclick={() => onDelete(pipeline.id, workflow.id)}>Delete</button>
</div>

<style>
    .workflow-bar {
        position: relative;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        border-radius: 4px;
        color: var(--surface);
    }

    h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--surface);
    }

    p {
        margin: 0.25rem 0 0 0;
        color: var(--surface);
        font-size: 0.9rem;
    }

    .delete-workflow-button {
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.3);
        border: none;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        color: var(--surface);
    }

    .delete-workflow-button:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }
</style>