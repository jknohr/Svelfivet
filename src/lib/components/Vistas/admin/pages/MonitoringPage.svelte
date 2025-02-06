<script lang="ts">
    import { $state, $props } from 'svelte';
    import BaseContentLayout from '../../../Layouts/BaseContentLayout.svelte';
    import BaseSection from '../pages/BaseSection.svelte';

    let { title = 'System Monitoring' } = $props();
    
    let metrics = $state({
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0
    });

    let alerts = $state([]);
    
    // Simulated monitoring updates
    function updateMetrics() {
        metrics = {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
        };
    }

    // Update metrics every 5 seconds
    setInterval(updateMetrics, 5000);
</script>

<BaseContentLayout {title}>
    <div class="monitoring-dashboard">
        <div class="metrics-grid">
            <BaseSection title="CPU Usage">
                <div class="metric">
                    <div class="metric-value">{metrics.cpu.toFixed(1)}%</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: {metrics.cpu}%"></div>
                    </div>
                </div>
            </BaseSection>

            <BaseSection title="Memory Usage">
                <div class="metric">
                    <div class="metric-value">{metrics.memory.toFixed(1)}%</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: {metrics.memory}%"></div>
                    </div>
                </div>
            </BaseSection>

            <BaseSection title="Disk Usage">
                <div class="metric">
                    <div class="metric-value">{metrics.disk.toFixed(1)}%</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: {metrics.disk}%"></div>
                    </div>
                </div>
            </BaseSection>

            <BaseSection title="Network Usage">
                <div class="metric">
                    <div class="metric-value">{metrics.network.toFixed(1)}%</div>
                    <div class="metric-bar">
                        <div class="metric-fill" style="width: {metrics.network}%"></div>
                    </div>
                </div>
            </BaseSection>
        </div>

        <BaseSection title="System Alerts">
            {#if alerts.length === 0}
                <p class="no-alerts">No active alerts</p>
            {:else}
                <ul class="alerts-list">
                    {#each alerts as alert}
                        <li class="alert-item">
                            <span class="alert-severity">{alert.severity}</span>
                            <span class="alert-message">{alert.message}</span>
                            <span class="alert-time">{alert.time}</span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </BaseSection>
    </div>
</BaseContentLayout>

<style>
    .monitoring-dashboard {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
    }

    .metric {
        padding: 1rem;
    }

    .metric-value {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    .metric-bar {
        height: 0.5rem;
        background: var(--surface-3);
        border-radius: 0.25rem;
        overflow: hidden;
    }

    .metric-fill {
        height: 100%;
        background: var(--primary);
        transition: width 0.3s ease;
    }

    .no-alerts {
        color: var(--text-2);
        text-align: center;
        padding: 1rem;
    }

    .alerts-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .alert-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem;
        border-bottom: 1px solid var(--surface-3);
    }

    .alert-severity {
        font-weight: bold;
        text-transform: uppercase;
    }

    .alert-time {
        color: var(--text-2);
        margin-left: auto;
    }
</style>
