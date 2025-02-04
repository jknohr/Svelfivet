<script lang="ts">
    import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';

    let { type = 'cpu' } = $props<{
        type: 'cpu' | 'memory' | 'network' | 'disk'
    }>();

    let data = $state([]);
    let isLoading = $state(true);
    let error = $state<string | null>(null);
    let updateInterval = $state(5000); // 5 seconds

    const theme = createThemeComposition({
        colors: {
            cpu: '#2196F3',
            memory: '#4CAF50',
            network: '#FF9800',
            disk: '#9C27B0'
        }
    });

    async function fetchMetrics() {
        isLoading = true;
        error = null;
        try {
            const query = `
                SELECT * 
                FROM system_metrics 
                WHERE type = $type 
                ORDER BY timestamp DESC 
                LIMIT 60
            `;
            const result = await db.query(query, { type });
            data = result;
        } catch (err) {
            error = 'Failed to fetch metrics';
            console.error(`Error fetching ${type} metrics:`, err);
        } finally {
            isLoading = false;
        }
    }

    // Update metrics periodically
    $effect(() => {
        fetchMetrics();
        const interval = setInterval(fetchMetrics, updateInterval);
        return () => clearInterval(interval);
    });

    // Compute current value
    const currentValue = $derived(() => {
        if (data.length === 0) return 0;
        return data[0].value;
    });

    // Compute trend (percentage change)
    const trend = $derived(() => {
        if (data.length < 2) return 0;
        const current = data[0].value;
        const previous = data[1].value;
        return ((current - previous) / previous) * 100;
    });
</script>

<div class="performance-monitor" style:--metric-color={theme.colors[type]}>
    {#if isLoading && data.length === 0}
        <div class="loading">Loading metrics...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        <div class="metric-value">
            <span class="value">{currentValue.toFixed(1)}%</span>
            <span class="trend" class:up={trend > 0} class:down={trend < 0}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </span>
        </div>
        <div class="chart">
            {#each data as point}
                <div 
                    class="bar" 
                    style:height="{point.value}%"
                    title="{point.value}% at {new Date(point.timestamp).toLocaleTimeString()}"
                />
            {/each}
        </div>
        <div class="controls">
            <select bind:value={updateInterval}>
                <option value={1000}>1s</option>
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
            </select>
            <button onclick={fetchMetrics}>
                Refresh
            </button>
        </div>
    {/if}
</div>

<style>
    .performance-monitor {
        height: 200px;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .metric-value {
        display: flex;
        align-items: baseline;
        gap: var(--spacing-sm);
    }

    .value {
        font-size: var(--fontSize-xxl);
        font-weight: var(--fontWeight-bold);
        color: var(--metric-color);
    }

    .trend {
        font-size: var(--fontSize-sm);
    }

    .trend.up {
        color: var(--states-success);
    }

    .trend.down {
        color: var(--states-error);
    }

    .chart {
        flex: 1;
        display: flex;
        align-items: flex-end;
        gap: 2px;
        padding: var(--spacing-sm);
        background: var(--glass-tint);
        border-radius: var(--borderRadius-sm);
    }

    .bar {
        flex: 1;
        background: var(--metric-color);
        opacity: 0.7;
        transition: height var(--duration-fast) var(--easing-standard);
        border-radius: var(--borderRadius-sm) var(--borderRadius-sm) 0 0;
    }

    .bar:hover {
        opacity: 1;
    }

    .controls {
        display: flex;
        gap: var(--spacing-sm);
    }

    select, button {
        padding: var(--spacing-xs) var(--spacing-sm);
        border: 1px solid var(--border);
        border-radius: var(--borderRadius-sm);
        background: var(--surface);
        color: var(--text);
        cursor: pointer;
    }

    button {
        background: var(--metric-color);
        color: var(--surface);
        border: none;
    }

    .loading, .error {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--textLight);
    }

    .error {
        color: var(--states-error);
    }
</style>
