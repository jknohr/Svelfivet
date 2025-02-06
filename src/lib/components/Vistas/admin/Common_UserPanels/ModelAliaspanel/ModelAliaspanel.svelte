// src/lib/components/admin/ModelAliasPanel.svelte

<script lang="ts">
    import type { ModelAlias } from '$lib/types/llm';
    import { onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api/tauri';

    let aliases: ModelAlias[] = [];
    let providers = ['openai', 'anthropic', 'minimax', 'google', 'cerebras'];
    let selectedProvider = 'all';

    async function loadAliases() {
        aliases = await invoke('list_aliases');
    }

    $: filteredAliases = selectedProvider === 'all' 
        ? aliases 
        : aliases.filter(a => a.config.model.toLowerCase().includes(selectedProvider));

    onMount(loadAliases);
</script>

<div class="model-alias-panel">
    <div class="provider-filter">
        <select bind:value={selectedProvider}>
            <option value="all">All Providers</option>
            {#each providers as provider}
                <option value={provider}>{provider}</option>
            {/each}
        </select>
    </div>

    <div class="aliases-grid">
        {#each filteredAliases as alias}
            <div class="alias-card">
                <h3>{alias.name}</h3>
                <div class="model-info">
                    <p>Model: {alias.config.model}</p>
                    <p>Context Length: {alias.capabilities.context_length}</p>
                    <p>Cost per 1k tokens: ${alias.cost_per_1k_tokens}</p>
                </div>
                <div class="capabilities">
                    {#if alias.capabilities.vision}
                        <span class="tag">Vision</span>
                    {/if}
                    {#if alias.capabilities.function_calling}
                        <span class="tag">Function Calling</span>
                    {/if}
                    {#if alias.capabilities.streaming}
                        <span class="tag">Streaming</span>
                    {/if}
                </div>
                <div class="tags">
                    {#each alias.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .model-alias-panel {
        padding: 1rem;
    }

    .provider-filter {
        margin-bottom: 1rem;
    }

    .aliases-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }

    .alias-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 1rem;
        background: white;
    }

    .tag {
        display: inline-block;
        background: #e9ecef;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        margin: 0.2rem;
        font-size: 0.8rem;
    }

    .capabilities {
        margin: 0.5rem 0;
    }

    .tags {
        margin-top: 0.5rem;
    }
</style>
