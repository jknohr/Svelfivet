<script lang="ts">
    import type { PanelPosition } from './types';
    import { getPanels } from './store';

    let position: PanelPosition = $props();
</script>

{#each getPanels(position) as panel (panel.id)}
    <div 
        class="panel" 
        style:width={panel.metadata?.width || '250px'}
    >
        {#if panel.metadata?.title}
            <div class="panel-header">
                {#if panel.metadata.icon}
                    <span class="material-icons">{panel.metadata.icon}</span>
                {/if}
                <h3>{panel.metadata.title}</h3>
            </div>
        {/if}
        <div class="panel-content">
            <svelte:component 
                this={panel.component}
                {...panel.props}
            />
        </div>
    </div>
{/each}

<style>
    .panel {
        height: 100%;
        background: var(--surface-color, white);
        border-right: 1px solid var(--border-color, #ddd);
        display: flex;
        flex-direction: column;
    }

    .panel-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        border-bottom: 1px solid var(--border-color, #ddd);
    }

    .panel-content {
        flex: 1;
        overflow: auto;
    }

    .material-icons {
        font-size: 1.2em;
    }
</style>
