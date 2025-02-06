<script lang="ts">
    import type { DragEvent } from '$lib/components/Utility/DnD/dnd.types';
    import { draggable, droppable } from '$lib/components/Utility/DnD/dnd';
    import KanbanCard from './KanbanCard.svelte';
    import type { KanbanCard as Card } from './KanbanCard.svelte';

    let { section, cards, onAddCard, onDeleteCard, onUpdateCard, droppableType, onDrop } = $props<{
        section: {
            id: string;
            label: string;
            color: string;
        };
        cards: Card[];
        onAddCard: () => void;
        onDeleteCard: (id: string) => void;
        onUpdateCard: (card: Card) => void;
        droppableType: string;
        onDrop: (event: DragEvent) => void;
    }>();

    // Sort cards by scheduled time if available
    let sortedCards = $derived(cards
        .filter((card: Card) => card.section === section.id)
        .sort((a: Card, b: Card) => {
            if (a.scheduledTime && b.scheduledTime) {
                return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
            }
            return a.scheduledTime ? -1 : b.scheduledTime ? 1 : 0;
        }));

    // Function to handle adding a new card
    function handleAddCard(): void {
        onAddCard();
    }

    // Function to handle deleting a card
    function handleDeleteCard(cardId: string): void {
        onDeleteCard(cardId);
    }

    // Function to handle updating a card
    function handleUpdateCard(updatedCard: Card): void {
        onUpdateCard(updatedCard);
    }
</script>

<section 
    class="kanban-section" 
    style="border-top: 4px solid {section.color}" 
    use:droppable={{ 
        target: {
            id: section.id,
            accept: [droppableType],
            validate: (event) => {
                const sourceSection = event.source.id;
                return sourceSection !== section.id; // Prevent dropping in same section
            }
        },
        feedback: {
            dropTargetClass: 'drop-target-hover'
        },
        onDrop
    }}
>
    <h2>{section.label}</h2>
    <div class="cards-container">
        {#each sortedCards as card}
            <KanbanCard 
                {card} 
                {section}
                onDelete={handleDeleteCard} 
                onUpdate={handleUpdateCard}
            />
        {/each}
    </div>
    <button 
        class="add-card-button" 
        onclick={handleAddCard}
    >
        + Add Card
    </button>
</section>

<style>
    .kanban-section {
        flex: 0 0 300px;
        background-color: var(--surface-variant);
        border-radius: 8px;
        padding: 1rem;
        margin: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 200px;
        max-height: calc(100vh - 2rem);
        overflow-y: auto;
    }

    h2 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
        color: var(--text);
    }

    .cards-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .add-card-button {
        margin-top: 1rem;
        padding: 0.5rem;
        background-color: var(--primary);
        color: var(--surface);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .add-card-button:hover {
        background-color: var(--states-focus);
    }
</style>