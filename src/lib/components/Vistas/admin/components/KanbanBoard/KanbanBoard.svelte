<svelte:options runes />

<script lang="ts">
    import type { DragEvent } from '$lib/components/Utility/DnD/dnd.types';
    import KanbanSection from './KanbanSection.svelte';
    import KanbanEditCardModal from './KanbanEditCardModal.svelte';

    // Define section data with colors
    const sections = $state([
        { id: 'conceptualizing', label: 'Conceptualizing', color: '#FFCDD2' },
        { id: 'planning', label: 'Planning', color: '#C8E6C9' },
        { id: 'scheduled', label: 'Scheduled', color: '#BBDEFB' },
        { id: 'in-progress', label: 'In Progress', color: '#FFF9C4' },
        { id: 'done', label: 'Done', color: '#D7CCC8' }
    ]);

    // Import KanbanCard type
    import type { KanbanCard } from './KanbanCard.svelte';

    // Reactive state for cards using deep reactivity
    let cards = $state<KanbanCard[]>([
        {
            id: '1',
            title: 'Initial Project Idea',
            section: 'conceptualizing',
            scheduledTime: null,
            description: 'This is the initial idea for the project.',
            goal: 'Define the project scope.',
            linkedPipelines: [] as string[],
            linkToRepo: null,
            linkToCode: null
        }
    ]);

    // Function to handle adding a new card
    function addCard(sectionId: string) {
        const newCard: KanbanCard = {
            id: `card-${Date.now()}`,
            title: 'New Card',
            section: sectionId,
            scheduledTime: null,
            description: '',
            goal: '',
            linkedPipelines: [] as string[],
            linkToRepo: null,
            linkToCode: null
        };
        cards = [...cards, newCard];
    }

    // Function to handle deleting a card
    function deleteCard(cardId: string) {
        cards = cards.filter(card => card.id !== cardId);
    }

    // Function to update a card
    function updateCard(updatedCard: typeof cards[0]) {
        cards = cards.map(card => card.id === updatedCard.id ? updatedCard : card);
    }

    // Handle card drop
    function handleDrop(event: DragEvent) {
        const cardId = event.item.id;
        const targetSectionId = event.target?.id;
        
        if (!cardId || !targetSectionId) return;

        const cardToMove = cards.find(card => card.id === cardId);
        if (cardToMove && cardToMove.section !== targetSectionId) {
            cardToMove.section = targetSectionId;
            cards = [...cards];
        }
    }
</script>

<div class="kanban-board">
    {#each sections as section}
        <KanbanSection 
            {section} 
            {cards} 
            onAddCard={() => addCard(section.id)} 
            onDeleteCard={deleteCard} 
            onUpdateCard={updateCard} 
            droppableType="kanban-card" 
            onDrop={handleDrop} 
        />
    {/each}
</div>

<style>
    .kanban-board {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        overflow-x: auto;
        min-height: calc(100vh - 2rem);
        background-color: var(--surface-background);
        align-items: flex-start;
    }

    /* Scrollbar Styling */
    .kanban-board::-webkit-scrollbar {
        height: 8px;
    }

    .kanban-board::-webkit-scrollbar-track {
        background: var(--surface-variant);
        border-radius: 4px;
    }

    .kanban-board::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 4px;
    }

    .kanban-board::-webkit-scrollbar-thumb:hover {
        background: var(--primary-hover);
    }
</style>