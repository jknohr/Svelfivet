<!-- lib/services/neuralid/NeuralIDProvider.svelte -->
<script lang="ts">
    import { createIDContext } from './id-context';
    import { initializeRelationManager } from './id-state';
    import type { IDContext } from '../types/id-types';
    import type { SurrealDB } from '../types/surreal-types';

    interface $$Props {
        context: IDContext;
        surreal: SurrealDB;
        onError?: (errors: Record<string, any>) => void;
        class?: string;
    }

    let { context, surreal, onError, class: className = '' } = $props<$$Props>();
    
    // Initialize context and relation manager
    const idStore = createIDContext(context);
    initializeRelationManager(surreal, context.namespace);

    // Error state management
    let errors = $state<Record<string, any>>({});
    let activeIds = $state<string[]>([]);

    // Monitor error states and active IDs
    $effect(() => {
        const unsubscribe = surreal.live(
            `LIVE SELECT * FROM neural_errors WHERE namespace = $namespace`,
            { namespace: context.namespace },
            (data) => {
                errors = data;
                if (Object.keys(data).length > 0 && onError) {
                    onError(data);
                }
            }
        );

        return () => unsubscribe();
    });

    // Monitor active IDs
    $effect(() => {
        const unsubscribe = surreal.live(
            `LIVE SELECT id FROM neural_ids WHERE namespace = $namespace AND status = 'active'`,
            { namespace: context.namespace },
            (data) => {
                activeIds = data.map(item => item.id);
            }
        );

        return () => unsubscribe();
    });

    // Error boundary handler
    function handleError(error: Error) {
        console.error('Neural ID System Error:', error);
        errors = { ...errors, [Date.now()]: error };
        if (onError) onError(errors);
    }
</script>

<svelte:boundary onerror={handleError}>
    <div class="neural-id-provider {className}">
        {#snippet default()}
            <slot />
        {/snippet}

        {#if Object.keys(errors).length > 0}
            <div class="neural-id-error-list">
                {#each Object.entries(errors) as [id, error]}
                    <div class="neural-id-error">
                        {error.message}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</svelte:boundary>

<style>
    .neural-id-provider {
        position: relative;
        width: 100%;
    }

    .neural-id-error-list {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
    }

    .neural-id-error {
        padding: 1rem;
        border-radius: 4px;
        background: #fff3f3;
        border: 1px solid #ff6b6b;
        color: #c92a2a;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
</style>
