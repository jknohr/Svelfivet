<script lang="ts">
    // 1. Define card type for TypeScript
    export interface KanbanCard {
        id: string;
        title: string;
        description: string;
        scheduledTime: string | null;
        goal: string;
        linkedPipelines: string[];
        linkToRepo: string | null;
        linkToCode: string | null;
        section: string;
    }

    // 2. Use runes for props and state management
    let { 
        visible = $bindable(false),
        card,
        onSave,
        onDelete,
        onClose 
    } = $props<{
        visible?: boolean;
        card: KanbanCard;
        onSave: (card: KanbanCard) => void;
        onDelete: (id: string) => void;
        onClose: () => void;
    }>();

    // 3. Reactive local card state
    let localCard = $state(structuredClone(card));

    // 4. Derived state for form validation
    const isValid = $derived(
        localCard.title?.trim().length > 0 && 
        localCard.description?.trim().length > 0
    );

    // 5. Effect to reset local card when input card changes
    $effect(() => {
        localCard = structuredClone(card);
    });

    // 6. Event handlers with Svelte 5 runes
    function handleSave(event?: Event) {
        if (event) {
            event.preventDefault();
        }
        if (!isValid) return;
        onSave(localCard);
        onClose();
    }

    function handleDelete() {
        onDelete(card.id);
        onClose();
    }

    // 7. Keyboard event handler for modal
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }
</script>

{#if visible}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <dialog 
        open
        class="modal-overlay" 
        aria-labelledby="modal-title"
        onkeydown={handleKeyDown}
    >
        <div class="modal-container">
            <div class="modal-header">
                <h2 id="modal-title">Edit Card</h2>
                <button 
                    type="button" 
                    class="close-button"
                    aria-label="Close modal"
                    onclick={onClose}
                >
                    ✕
                </button>
            </div>
            <form 
                onsubmit={handleSave}
            >
                <div class="form-group">
                    <label for="title">Title</label>
                    <input 
                        id="title"
                        type="text" 
                        bind:value={localCard.title} 
                        required
                    />
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea 
                        id="description"
                        bind:value={localCard.description}
                        required
                    ></textarea>
                </div>
                <div class="form-group">
                    <label for="scheduledTime">Scheduled Time</label>
                    <input 
                        id="scheduledTime"
                        type="datetime-local" 
                        bind:value={localCard.scheduledTime}
                    />
                </div>
                <div class="form-group">
                    <label for="goal">Goal</label>
                    <input 
                        id="goal"
                        type="text" 
                        bind:value={localCard.goal}
                    />
                </div>
                <div class="form-group">
                    <label for="linkedPipelines">Linked Pipelines</label>
                    <input 
                        id="linkedPipelines"
                        type="text" 
                        bind:value={localCard.linkedPipelines}
                    />
                </div>
                <div class="form-group">
                    <label for="linkToRepo">Link to Repo</label>
                    <input 
                        id="linkToRepo"
                        type="url" 
                        bind:value={localCard.linkToRepo}
                    />
                </div>
                <div class="form-group">
                    <label for="linkToCode">Link to Code</label>
                    <input 
                        id="linkToCode"
                        type="url" 
                        bind:value={localCard.linkToCode}
                    />
                </div>
            
                <div class="form-actions">
                    <button type="submit" disabled={!isValid}>Save Changes</button>
                    <button 
                        type="button" 
                        onclick={handleDelete}
                    >Delete Card</button>
                    <button type="button" onclick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    </dialog>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        border: none;
        padding: 0;
        margin: 0;
        overflow: auto;
    }

    .modal-container {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        position: relative;
        z-index: 1;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    h2 {
        margin: 0;
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

    input, textarea {
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

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>