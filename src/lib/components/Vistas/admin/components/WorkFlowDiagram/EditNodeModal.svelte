<svelte:options runes />

<script lang="ts">
    let { visible = false, node, save, delete: deleteNode, close } = $props<{
        visible: boolean;
        node: { id: string; type: string; name: string; parameters?: string };
        save: (node: { id: string; type: string; name: string; parameters?: string }) => void;
        delete: (nodeId: string) => void;
        close: () => void;
    }>();

    let localNode = $state({ ...node });

    function handleSave() {
        save(localNode);
        close();
    }

    function handleDelete() {
        deleteNode(node.id);
        close();
    }
</script>

{#if visible}
    <dialog 
        class="modal-overlay"
        open={visible}
        aria-labelledby="modal-title"
    >
        <form 
            class="modal-container"
            method="dialog"
            onsubmit={(e) => { e.preventDefault(); handleSave(); }}
        >
            <h2 id="modal-title">Edit Action</h2>
            <div class="form-group">
                <label for="action-type">Action Type</label>
                <select 
                    id="action-type"
                    bind:value={localNode.type}
                >
                    <option value="ApiCall">API Call</option>
                    <option value="DatabaseQuery">Database Query</option>
                    <option value="TauriCommand">Tauri Command</option>
                    <option value="LocalCommand">Local Command</option>
                </select>
            </div>
            <div class="form-group">
                <label for="action-name">Action Name</label>
                <input 
                    id="action-name"
                    type="text" 
                    bind:value={localNode.name}
                    required
                />
            </div>
            <div class="form-group">
                <label for="action-parameters">Parameters</label>
                <textarea 
                    id="action-parameters"
                    bind:value={localNode.parameters}
                    rows="4"
                ></textarea>
            </div>
            <div class="form-actions">
                <button 
                    type="submit"
                    aria-label="Save changes"
                >Save</button>
                <button 
                    type="button" 
                    onclick={handleDelete}
                    onkeydown={(e) => e.key === 'Enter' && handleDelete()}
                    aria-label="Delete node"
                >Delete</button>
                <button 
                    type="button" 
                    onclick={close}
                    onkeydown={(e) => e.key === 'Enter' && close()}
                    aria-label="Cancel and close modal"
                >Cancel</button>
            </div>
        </form>
    </dialog>
{/if}

<style>
    dialog.modal-overlay {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        max-width: 100vw;
        max-height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        border: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    dialog.modal-overlay::backdrop {
        background: rgba(0, 0, 0, 0.5);
    }

    .modal-container {
        background-color: var(--surface);
        padding: 1rem;
        border-radius: 8px;
        width: 500px;
        max-width: 90%;
    }

    h2 {
        margin-top: 0;
        color: var(--text);
    }

    .form-group {
        margin-bottom: 0.5rem;
    }

    label {
        display: block;
        margin-bottom: 0.25rem;
        color: var(--text);
    }

    input, textarea, select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 4px;
    }

    .form-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: var(--primary);
        color: var(--surface);
    }

    button:hover {
        background-color: var(--states-focus);
    }
</style>