<script lang="ts">
    import { $state } from 'svelte/state'; // Update the import path if necessary
    import { on } from 'svelte/event'; // Import the on function for event handling

    // Props
    export let settings: {
        mediaStorageLimit: number;
        allowedMediaTypes: string[];
        maxFileSize: number;
        enableMediaCompression: boolean;
    };
    export let onChange: (updated: Partial<typeof settings>) => void;

    // Local state
    let localSettings = $state({ ...settings });

    // Watch for changes and emit them
    $effect(() => {
        onChange({ mediaSettings: localSettings });
    });
</script>

<section>
    <h2 class="section-title">Media Management</h2>
    <div class="setting-item">
        <label>Storage Limit (MB)</label>
        <input 
            type="number" 
            bind:value={localSettings.mediaStorageLimit}
            min="1024"
            max="10240"
        />
    </div>
    <div class="setting-item">
        <label>Max File Size (MB)</label>
        <input 
            type="number" 
            bind:value={localSettings.maxFileSize}
            min="1"
            max="1000"
        />
    </div>
    <div class="setting-item">
        <label>Enable Media Compression</label>
        <input 
            type="checkbox" 
            bind:checked={localSettings.enableMediaCompression}
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