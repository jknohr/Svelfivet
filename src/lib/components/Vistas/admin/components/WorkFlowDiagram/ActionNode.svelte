<svelte:options runes />

<script lang="ts">
    
    let { node, options } = $props<{
        node: { id: string; name: string; type: string };
        options: { delete: (id: string) => void };
    }>();

    function handleDelete() {
        options.delete(node.id);
    }
</script>

<div 
    role="button"
    tabindex="0"
    class="action-node"
    aria-label={`${node.type} action node: ${node.name}`}
    onclick={options.onClick}
    onkeydown={(e) => e.key === 'Enter' && options.onClick?.(e)}
>
    <h3>{node.name}</h3>
    <p>{node.type}</p>
    <button 
        type="button"
        class="delete-button" 
        onclick={(e) => { e.stopPropagation(); handleDelete(); }}
        aria-label={`Delete ${node.name} action node`}
    >Delete</button>
</div>

<style>
    .action-node {
        position: relative;
        padding: 0.5rem;
        border: 2px solid #90CAF9;
        border-radius: 8px;
        background-color: #E3F2FD;
        cursor: pointer;
    }

    h3 {
        margin: 0;
        font-size: 1rem;
        color: #0D47A1;
    }

    p {
        margin: 0.25rem 0 0 0;
        color: #1976D2;
        font-size: 0.9rem;
    }

    .delete-button {
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.3);
        border: none;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        cursor: pointer;
        color: #0D47A1;
    }

    .delete-button:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }
</style>