<svelte:options runes={true} />

<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let show = false;
    export let onClose: () => void;
    export let title: string;
    export let width = '400px';

    // Close on escape key
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }

    // Close on backdrop click
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if show}
    <div 
        class="modal-backdrop" 
        onclick={handleBackdropClick}
        transition:fade={{ duration: 200 }}
    >
        <div 
            class="modal-content"
            style="width: {width}"
            transition:scale={{ duration: 200, easing: quintOut }}
        >
            <div class="modal-header">
                <h2>{title}</h2>
                <button class="close-button" onclick={onClose}>
                    <i class="material-icons">close</i>
                </button>
            </div>
            <div class="modal-body">
                <slot />
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background: var(--surface-background);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .modal-header {
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--on-surface);
    }

    .modal-body {
        padding: var(--spacing-lg);
    }

    .close-button {
        background: none;
        border: none;
        padding: var(--spacing-xs);
        cursor: pointer;
        color: var(--on-surface-variant);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }

    .close-button:hover {
        background: var(--surface-hover);
        color: var(--on-surface);
    }

    @media (prefers-reduced-motion: reduce) {
        .modal-backdrop, .modal-content {
            transition: none;
        }
    }
</style>
