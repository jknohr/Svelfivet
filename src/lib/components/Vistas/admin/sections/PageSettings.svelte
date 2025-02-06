<script lang="ts">
    import { $state } from 'svelte/state'; // Update the import path if necessary
    import { on } from 'svelte/event'; // Import the on function for event handling

    // Props
    export let settings: {
        defaultPageTemplate: string;
        enableVersioning: boolean;
        maxVersions: number;
        autosaveInterval: number;
    };
    export let onChange: (updated: Partial<typeof settings>) => void;

    // Local state
    let localSettings = $state({ ...settings });

    // Watch for changes and emit them
    $effect(() => {
        onChange({ pageSettings: localSettings });
    });
</script>

<section>
    <h2 class="section-title">Page Management</h2>
    <div class="setting-item">
        <label>Default Template</label>
        <select bind:value={localSettings.defaultPageTemplate}>
            <option value="blank">Blank</option>
            <option value="article">Article</option>
            <option value="landing">Landing Page</option>
            <option value="documentation">Documentation</option>
        </select>
    </div>
    <div class="setting-item">
        <label>Enable Versioning</label>
        <input 
            type="checkbox" 
            bind:checked={localSettings.enableVersioning}
        />
    </div>
    <div class="setting-item">
        <label>Max Versions</label>
        <input 
            type="number" 
            bind:value={localSettings.maxVersions}
            min="1"
            max="100"
        />
    </div>
    <div class="setting-item">
        <label>Autosave Interval (seconds)</label>
        <input 
            type="number" 
            bind:value={localSettings.autosaveInterval}
            min="60"
            max="3600"
        />
    </div>
</section>

<style>
    .setting-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    label {
        width: 200px;
        font-weight: bold;
    }

    input[type="number"], input[type="checkbox"], select {
        flex: 1;
    }
</style>