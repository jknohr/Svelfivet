<script lang="ts">
    import { draggable } from '$lib/components/Utility/DnD/dnd';
    import KanbanEditCardModal from './KanbanEditCardModal.svelte';

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

    let { card, section, onDelete, onUpdate } = $props<{
        card: KanbanCard;
        section: {
            id: string;
            label: string;
            color: string;
        };
        onDelete: (id: string) => void;
        onUpdate: (card: KanbanCard) => void;
    }>();
    let editModalVisible = $state(false);

    // Function to handle card click
    function handleClick() {
        editModalVisible = true;
    }

    // Function to handle card deletion
    function handleDelete() {
        onDelete(card.id);
    }

    // Function to handle card update
    function handleUpdate(updatedCard: KanbanCard) {
        onUpdate(updatedCard);
    }
</script>

<div 
    class="kanban-card" 
    style="border-left: 3px solid {section.color}"
    use:draggable={{
        source: {
            id: card.id,
            data: card,
            group: 'kanban-card'
        },
        handle: {
            selector: '.card-content'
        },
        feedback: {
            dragClass: 'dragging',
            previewClass: 'drag-preview'
        }
    }}
>
    <button 
        type="button" 
        class="card-content" 
        onclick={handleClick}
    >
        <h3>{card.title}</h3>
        {#if card.scheduledTime}
            <p class="scheduled-time">📅 {new Date(card.scheduledTime).toLocaleString()}</p>
        {/if}
        {#if card.description}
            <p class="description">{card.description.split(' ').slice(0, 10).join(' ')}...</p>
        {/if}
        {#if card.goal}
            <p class="goal">🎯 {card.goal}</p>
        {/if}
    </button>
</div>

<KanbanEditCardModal 
    bind:visible={editModalVisible} 
    card={card} 
    onSave={handleUpdate} 
    onDelete={handleDelete} 
    onClose={() => editModalVisible = false} 
/>

<style>
    .kanban-card {
        background-color: var(--surface);
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
    }

    .card-content {
        cursor: grab;
    }

    .kanban-card:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }

    .dragging {
        opacity: 0.5;
        cursor: grabbing;
    }

    .drag-preview {
        transform: rotate(2deg) scale(1.02);
    }

    h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    p {
        margin: 0.25rem 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .scheduled-time {
        font-size: 0.75rem;
        color: var(--text-tertiary);
    }

    .description {
        line-height: 1.4;
    }

    .goal {
        margin-top: 0.5rem;
        font-style: italic;
        color: var(--text-accent);
    }
    

</style>