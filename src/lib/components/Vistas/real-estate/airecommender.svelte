<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { aiService } from '$lib/components/stores/api';
    import { propertiesStore } from '$lib/stores/properties';
    import PropertyCard from '$lib/components/context/real-estate/cards/PropertyCard.svelte';
    import LoadingSpinner from '$lib/components/common/atomic/loading-spinner.svelte';
    import ErrorMessage from '$lib/components/common/atomic/error-message.svelte';

    let { onSelect } = $props();

    interface PropertyRecommendation {
        id: string;
        title: string;
        price: number;
        location: {
            address: string;
            coordinates: [number, number];
        };
        image: string;
        matchScore: number;
        reasonForRecommendation: string;
    }

    let recommendations = $state<PropertyRecommendation[]>([]);
    let loading = $state(false);
    let error = $state(null);
    let expanded = $state(false);
    let isVisible = $state(false);

    onMount(async () => {
        try {
            loading = true;
            const properties = get(propertiesStore);
            recommendations = await aiService.getRecommendations(properties.data);
        } catch (e: any) {
            error = e.message || 'Failed to load recommendations';
        } finally {
            loading = false;
        }
    });

    function handleRecommendationClick(recommendation: PropertyRecommendation) {
        onSelect?.(recommendation);
    }

    function handleMouseEnter() {
        expanded = true;
        setTimeout(() => {
            isVisible = true;
        }, 150);
    }

    function handleMouseLeave() {
        isVisible = false;
        setTimeout(() => {
            expanded = false;
        }, 300);
    }
</script>

<div 
    class="ai-assistant"
    class:expanded
    class:visible={isVisible}
    role="complementary"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
>
    <header class="assistant-header">
        <h3>AI Recommendations</h3>
        {#if loading}
            <LoadingSpinner size="small" />
        {/if}
    </header>

    {#if error}
        <ErrorMessage message={error} />
    {:else}
        <div class="recommendations" class:visible={isVisible}>
            {#each recommendations as recommendation (recommendation.id)}
                <PropertyCard
                    card={{
                        content: {
                            images: [recommendation.image],
                            title: recommendation.title,
                            price: recommendation.price,
                            location: { address: recommendation.location.address },
                            features: [recommendation.reasonForRecommendation]
                        }
                    }}
                    onEdit={() => {}}
                    onAnalytics={() => {}}
                />
            {/each}
        </div>
    {/if}
</div>

<style>
    .ai-assistant {
    position: fixed;
    top: 6rem;
    right: 1rem;
    width: 2.5%;
    height: calc(100vh - 8rem);
    padding: 1rem;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    z-index: 1000;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

    .ai-assistant.expanded {
    width: 25%;
}

    .assistant-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

    .ai-assistant.visible .assistant-header {
    opacity: 1;
}

    .recommendations {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    max-height: calc(100vh - 12rem);
    overflow-y: auto;
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.3s ease-in-out;
}

    .recommendations.visible {
    opacity: 1;
    transform: translateX(0);
}

    /* Scrollbar styling */
    .recommendations::-webkit-scrollbar {
        width: 6px;
    }

    .recommendations::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
    }

    .recommendations::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }

/* Responsive adjustments */
@media(max-width: 768px) {
        .ai-assistant {
        display: none;
    }
}
</style>
