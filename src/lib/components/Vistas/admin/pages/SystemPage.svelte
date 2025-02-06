<script lang="ts">
    import { $state, $props } from 'svelte';
    import BaseContentLayout from '../../../Layouts/BaseContentLayout.svelte';
    import BaseSection from '../pages/BaseSection.svelte';

    let { title = 'System Settings' } = $props();
    
    let settings = $state({
        maintenance: false,
        debug: false,
        cacheEnabled: true,
        logLevel: 'info',
        maxUploadSize: 10,
        timezone: 'UTC',
        backupEnabled: true,
        backupFrequency: 'daily'
    });

    function saveSettings() {
        // TODO: Implement settings save logic
        console.log('Saving settings:', settings);
    }
</script>

<BaseContentLayout {title}>
    <div class="system-settings">
        <BaseSection title="General Settings">
            <div class="settings-grid">
                <div class="setting-item">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={settings.maintenance}
                            onclick={() => settings.maintenance = !settings.maintenance}
                        >
                        Maintenance Mode
                    </label>
                    <span class="setting-description">
                        Enable maintenance mode to prevent user access during updates
                    </span>
                </div>

                <div class="setting-item">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={settings.debug}
                            onclick={() => settings.debug = !settings.debug}
                        >
                        Debug Mode
                    </label>
                    <span class="setting-description">
                        Enable detailed error messages and logging
                    </span>
                </div>

                <div class="setting-item">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={settings.cacheEnabled}
                            onclick={() => settings.cacheEnabled = !settings.cacheEnabled}
                        >
                        Enable Caching
                    </label>
                    <span class="setting-description">
                        Enable system-wide caching for better performance
                    </span>
                </div>
            </div>
        </BaseSection>

        <BaseSection title="Performance Settings">
            <div class="settings-grid">
                <div class="setting-item">
                    <label>
                        Log Level
                        <select 
                            value={settings.logLevel}
                            onchange={(e) => settings.logLevel = e.target.value}
                        >
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                        </select>
                    </label>
                    <span class="setting-description">
                        Set the system logging level
                    </span>
                </div>

                <div class="setting-item">
                    <label>
                        Max Upload Size (MB)
                        <input 
                            type="number" 
                            value={settings.maxUploadSize}
                            onchange={(e) => settings.maxUploadSize = parseInt(e.target.value)}
                            min="1"
                            max="100"
                        >
                    </label>
                    <span class="setting-description">
                        Maximum allowed file upload size
                    </span>
                </div>
            </div>
        </BaseSection>

        <BaseSection title="Backup Settings">
            <div class="settings-grid">
                <div class="setting-item">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={settings.backupEnabled}
                            onclick={() => settings.backupEnabled = !settings.backupEnabled}
                        >
                        Enable Automatic Backups
                    </label>
                    <span class="setting-description">
                        Enable automated system backups
                    </span>
                </div>

                <div class="setting-item">
                    <label>
                        Backup Frequency
                        <select 
                            value={settings.backupFrequency}
                            onchange={(e) => settings.backupFrequency = e.target.value}
                            disabled={!settings.backupEnabled}
                        >
                            <option value="hourly">Hourly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </label>
                    <span class="setting-description">
                        How often to perform automatic backups
                    </span>
                </div>
            </div>
        </BaseSection>

        <div class="actions">
            <button class="save-button" onclick={saveSettings}>
                Save Settings
            </button>
        </div>
    </div>
</BaseContentLayout>

<style>
    .system-settings {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .settings-grid {
        display: grid;
        gap: 1.5rem;
    }

    .setting-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .setting-item label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    }

    .setting-description {
        font-size: 0.875rem;
        color: var(--text-2);
    }

    input[type="checkbox"] {
        width: 1.25rem;
        height: 1.25rem;
    }

    input[type="number"],
    select {
        padding: 0.5rem;
        border: 1px solid var(--surface-3);
        border-radius: 0.25rem;
        background: var(--surface-1);
        color: var(--text-1);
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        padding-top: 1rem;
    }

    .save-button {
        padding: 0.75rem 1.5rem;
        background: var(--primary);
        color: var(--text-on-primary);
        border: none;
        border-radius: 0.25rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .save-button:hover {
        background: var(--primary-dark);
    }

    .save-button:active {
        transform: translateY(1px);
    }
</style>
