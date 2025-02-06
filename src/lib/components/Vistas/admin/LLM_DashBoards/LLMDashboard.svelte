<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { invoke } from '@tauri-apps/api/tauri';
    import type { RouterStats, RouterConfig, SessionInfo, CacheStats, ModelConfig } from '$lib/types/llm';

    let stats: RouterStats;
    let config: RouterConfig;
    let sessions: SessionInfo[] = [];
    let cacheStats: CacheStats;
    let aliases: string[] = [];
    let updateInterval: number;

    // Load initial data
    onMount(async () => {
        await loadData();
        updateInterval = setInterval(loadData, 5000); // Update every 5 seconds
    });

    onDestroy(() => {
        clearInterval(updateInterval);
    });

    async function loadData() {
        try {
            stats = await invoke('get_router_stats');
            config = await invoke('get_router_config');
            sessions = await invoke('list_active_sessions');
            cacheStats = await invoke('get_cache_stats');
            aliases = await invoke('list_model_aliases');
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async function updateConfig(newConfig: RouterConfig) {
        try {
            await invoke('update_router_config', { config: newConfig });
            await loadData();
        } catch (error) {
            console.error('Failed to update config:', error);
        }
    }

    async function addAlias(name: string, modelConfig: ModelConfig) {
        try {
            await invoke('add_model_alias', { name, config: modelConfig });
            await loadData();
        } catch (error) {
            console.error('Failed to add alias:', error);
        }
    }

    async function removeAlias(name: string) {
        try {
            await invoke('remove_model_alias', { name });
            await loadData();
        } catch (error) {
            console.error('Failed to remove alias:', error);
        }
    }

    async function terminateSession(sessionId: string) {
        try {
            await invoke('terminate_session', { sessionId });
            await loadData();
        } catch (error) {
            console.error('Failed to terminate session:', error);
        }
    }

    async function clearCache() {
        try {
            await invoke('clear_router_cache');
            await loadData();
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    }
</script>

<div class="llm-dashboard">
    <header>
        <h1>LLM Router Dashboard</h1>
        <div class="health-status">
            Status: {stats?.active_sessions ? 'Active' : 'Inactive'}
        </div>
    </header>

    <div class="dashboard-grid">
        <!-- Statistics Panel -->
        <section class="stats-panel">
            <h2>Statistics</h2>
            {#if stats}
                <div class="stats-grid">
                    <div class="stat-item">
                        <h3>Active Sessions</h3>
                        <p>{stats.active_sessions}</p>
                    </div>
                    <div class="stat-item">
                        <h3>Total Requests</h3>
                        <p>{stats.total_requests}</p>
                    </div>
                    <div class="stat-item">
                        <h3>Cache Hit Rate</h3>
                        <p>{(stats.cache_hit_rate * 100).toFixed(2)}%</p>
                    </div>
                </div>
            {/if}
        </section>

        <!-- Model Aliases Panel -->
        <section class="aliases-panel">
            <h2>Model Aliases</h2>
            <div class="aliases-list">
                {#each aliases as alias}
                    <div class="alias-item">
                        <span>{alias}</span>
                        <button on:click={() => removeAlias(alias)}>Remove</button>
                    </div>
                {/each}
                <button class="add-alias-btn">Add New Alias</button>
            </div>
        </section>

        <!-- Active Sessions Panel -->
        <section class="sessions-panel">
            <h2>Active Sessions</h2>
            <div class="sessions-list">
                {#each sessions as session}
                    <div class="session-item">
                        <div class="session-info">
                            <span>ID: {session.session_id}</span>
                            <span>User: {session.user_id || 'Anonymous'}</span>
                            <span>Requests: {session.request_count}</span>
                        </div>
                        <button on:click={() => terminateSession(session.session_id)}>
                            Terminate
                        </button>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Cache Management Panel -->
        <section class="cache-panel">
            <h2>Cache Management</h2>
            {#if cacheStats}
                <div class="cache-stats">
                    <p>Hit Rate: {(cacheStats.hit_rate * 100).toFixed(2)}%</p>
                    <p>Size: {cacheStats.size} entries</p>
                    <button on:click={clearCache}>Clear Cache</button>
                </div>
            {/if}
        </section>

        <!-- Configuration Panel -->
        <section class="config-panel">
            <h2>Router Configuration</h2>
            {#if config}
                <div class="config-form">
                    <label>
                        Max Concurrent Sessions
                        <input
                            type="number"
                            bind:value={config.max_concurrent_sessions}
                            on:change={() => updateConfig(config)}
                        />
                    </label>
                    <label>
                        Default Timeout (seconds)
                        <input
                            type="number"
                            bind:value={config.default_timeout}
                            on:change={() => updateConfig(config)}
                        />
                    </label>
                    <label>
                        Cache TTL (seconds)
                        <input
                            type="number"
                            bind:value={config.cache_ttl}
                            on:change={() => updateConfig(config)}
                        />
                    </label>
                </div>
            {/if}
        </section>
    </div>
</div>

<style>
    .llm-dashboard {
        padding: 2rem;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    section {
        background: var(--surface-2);
        border-radius: 8px;
        padding: 1.5rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }

    .stat-item {
        text-align: center;
        padding: 1rem;
        background: var(--surface-3);
        border-radius: 4px;
    }

    .aliases-list, .sessions-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .alias-item, .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: var(--surface-3);
        border-radius: 4px;
    }

    .config-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        background: var(--surface-1);
        color: var(--text-1);
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        background: var(--primary);
        color: white;
        cursor: pointer;
    }

    button:hover {
        background: var(--primary-hover);
    }

    .add-alias-btn {
        margin-top: 1rem;
        width: 100%;
    }
</style> 
