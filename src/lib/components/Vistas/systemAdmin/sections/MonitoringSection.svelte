<script lang="ts">
    import BaseSection from './BaseSection.svelte';
    import { createThemeComposition } from '$lib/components/Theme/ThemeComposition';
    import PerformanceMonitor from '../components/monitoring/PerformanceMonitor.svelte';
    import LogViewer from '../components/monitoring/LogViewer.svelte';
    import AlertManager from '../components/monitoring/AlertManager.svelte';
    import Analytics from '../components/monitoring/Analytics.svelte';
    import Reports from '../components/monitoring/Reports.svelte';

    let activeSubSection = $state('performance');
    let showSettings = $state(false);

    const theme = createThemeComposition({
        colors: {
            primary: '#1976D2',
            secondary: '#0D47A1',
            accent: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            error: '#F44336',
            info: '#03A9F4'
        }
    });

    const mainContent = #snippet {
        <div class="subsection-nav">
            <button 
                class:active={activeSubSection === 'performance'}
                onclick={() => activeSubSection = 'performance'}
            >
                Performance
            </button>
            <button 
                class:active={activeSubSection === 'logs'}
                onclick={() => activeSubSection = 'logs'}
            >
                Logs
            </button>
            <button 
                class:active={activeSubSection === 'alerts'}
                onclick={() => activeSubSection = 'alerts'}
            >
                Alerts
            </button>
            <button 
                class:active={activeSubSection === 'analytics'}
                onclick={() => activeSubSection = 'analytics'}
            >
                Analytics
            </button>
            <button 
                class:active={activeSubSection === 'reports'}
                onclick={() => activeSubSection = 'reports'}
            >
                Reports
            </button>
            <button 
                class:active={activeSubSection === 'settings'}
                onclick={() => activeSubSection = 'settings'}
            >
                Section Settings
            </button>
        </div>

        <div class="subsection-content">
            {#if activeSubSection === 'performance'}
                <div class="monitoring-grid">
                    <div class="metric-card">
                        <h3>CPU Usage</h3>
                        <PerformanceMonitor type="cpu" />
                    </div>
                    <div class="metric-card">
                        <h3>Memory Usage</h3>
                        <PerformanceMonitor type="memory" />
                    </div>
                    <div class="metric-card">
                        <h3>Network Traffic</h3>
                        <PerformanceMonitor type="network" />
                    </div>
                    <div class="metric-card">
                        <h3>Disk Usage</h3>
                        <PerformanceMonitor type="disk" />
                    </div>
                </div>
            {:else if activeSubSection === 'logs'}
                <LogViewer />
            {:else if activeSubSection === 'alerts'}
                <AlertManager />
            {:else if activeSubSection === 'analytics'}
                <Analytics />
            {:else if activeSubSection === 'reports'}
                <Reports />
            {:else if activeSubSection === 'settings'}
                <div class="settings-panel">
                    <h3>Monitoring Settings</h3>
                    <div class="setting-group">
                        <h4>Performance Monitoring</h4>
                        <div class="setting-item">
                            <label>Update Interval</label>
                            <select>
                                <option value="1000">1 second</option>
                                <option value="5000">5 seconds</option>
                                <option value="10000">10 seconds</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Metrics History</label>
                            <select>
                                <option value="60">1 hour</option>
                                <option value="360">6 hours</option>
                                <option value="1440">24 hours</option>
                            </select>
                        </div>
                    </div>
                    <div class="setting-group">
                        <h4>Log Management</h4>
                        <div class="setting-item">
                            <label>Log Retention Period</label>
                            <select>
                                <option value="7">7 days</option>
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>Log Level</label>
                            <select>
                                <option value="debug">Debug</option>
                                <option value="info">Info</option>
                                <option value="warn">Warning</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                    </div>
                    <div class="setting-group">
                        <h4>Alert Configuration</h4>
                        <div class="setting-item">
                            <label>Alert Notifications</label>
                            <input type="checkbox" checked />
                        </div>
                        <div class="setting-item">
                            <label>Email Alerts</label>
                            <input type="checkbox" checked />
                        </div>
                    </div>
                    <div class="actions">
                        <button onclick={() => console.log('Saving monitoring settings...')}>Save Settings</button>
                    </div>
                </div>
            {/if}
        </div>
    };
</script>

<BaseSection
    title="System Monitoring"
    description="Monitor system performance, logs, alerts, and analytics"
    mainContent={mainContent}
/>

<style>
    .subsection-nav {
        display: flex;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-xl);
        padding: var(--spacing-sm);
        background: var(--glass-tint);
        border-radius: var(--borderRadius-md);
        backdrop-filter: blur(var(--glass-blur));
    }

    .subsection-nav button {
        padding: var(--spacing-sm) var(--spacing-md);
        border: none;
        background: none;
        color: var(--text);
        cursor: pointer;
        border-radius: var(--borderRadius-sm);
        transition: all var(--duration-fast) var(--easing-standard);
    }

    .subsection-nav button:hover {
        background: var(--glass-highlight);
    }

    .subsection-nav button.active {
        background: var(--surface);
        color: var(--primary);
        box-shadow: var(--elevation-low);
    }

    .monitoring-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-md);
    }

    .metric-card {
        background: var(--surface);
        border-radius: var(--borderRadius-md);
        padding: var(--spacing-md);
        box-shadow: var(--elevation-low);
    }

    .metric-card h3 {
        margin: 0 0 var(--spacing-md);
        color: var(--textDark);
        font-size: var(--fontSize-lg);
    }
</style>
