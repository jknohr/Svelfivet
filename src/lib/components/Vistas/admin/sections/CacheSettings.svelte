<script lang="ts">
    import { $state } from 'svelte/state'; // Update the import path if necessary
    import { on } from 'svelte/event'; // Import the on function for event handling

    // Props
    export let settings: {
        enablePageCache: boolean;
        pageCacheDuration: number;
        enableMediaCache: boolean;
        mediaCacheDuration: number;
    };
    export let onChange: (updated: Partial<typeof settings>) => void;

    // Local state
    let localSettings = $state({ ...settings });

    // Watch for changes and emit them
    $effect(() => {
        onChange({ cacheSettings: localSettings });
    });
</script>

<section>
    <h2 class="section-title">Cache Settings</h2>
    <div class="setting-item">
        <label>Enable Page Cache</label>
        <input 
            type="checkbox" 
            bind:checked={localSettings.enablePageCache}
        />
    </div>
    <div class="setting-item">
        <label>Page Cache Duration (seconds)</label>
        <input 
            type="number"
            bind:value={localSettings.pageCacheDuration}
            min="300"
            max="86400"
        />
    </div>
    <div class="setting-item">
        <label>Enable Media Cache</label>
        <input 
            type="checkbox" 
            bind:checked={localSettings.enableMediaCache}
        />
    </div>
    <div class="setting-item">
        <label>Media Cache Duration (seconds)</label>
        <input 
            type="number"
            bind:value={localSettings.mediaCacheDuration}
            min="300"
            max="604800"
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

    input[type="number"], input[type="checkbox"] {
        flex: 1;
    }
</style>