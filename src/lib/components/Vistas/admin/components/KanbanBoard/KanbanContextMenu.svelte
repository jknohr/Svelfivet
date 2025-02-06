<script lang="ts">
    // Types
    type Position = {
        x: number;
        y: number;
    };

    // Export the component
    export { KanbanContextMenu as default };

    // Props with types
    export let position: Position;
    export let onAddPipeline: () => void;
    export let onDeletePipeline: () => void;
    export let onClose: () => void;

    // Local state
    let menuVisible = true;
</script>

{#if menuVisible}
    <div 
        class="context-menu" 
        style="top: {position.y}px; left: {position.x}px"
        onclick={onClose}
    >
        <ul>
            <li onclick={onAddPipeline}>Add New Project Pipeline</li>
            <li onclick={onDeletePipeline}>Delete Project Pipeline</li>
        </ul>
    </div>
{/if}
{#snippet KanbanContextMenu}

<style>
    .context-menu {
        position: absolute;
        background-color: var(--surface);
        border: 1px solid var(--border);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0.5rem 0;
    }

    li {
        padding: 0.5rem 1rem;
        cursor: pointer;
        color: var(--text);
    }

    li:hover {
        background-color: var(--surface-hover);
    }
</style>