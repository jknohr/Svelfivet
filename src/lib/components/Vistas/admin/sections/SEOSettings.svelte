<script lang="ts">
    import { $state } from 'svelte/state'; // Update the import path if necessary
    import { on } from 'svelte/event'; // Import the on function for event handling

    // Props
    export let settings: {
        enableSEO: boolean;
        defaultMetaTags: { [key: string]: string };
    };
    export let onChange: (updated: Partial<typeof settings>) => void;

    // Local state
    let localSettings = $state({ ...settings });

    // Watch for changes and emit them
    $effect(() => {
        onChange({ seoSettings: localSettings });
    });
</script>

<section>
    <h2 class="section-title">SEO Settings</h2>
    <div class="setting-item">
        <label>Enable SEO Features</label>
        <input 
            type="checkbox" 
            bind:checked={localSettings.enableSEO}
        />
    </div>
    <div class="setting-item">
        <label>Default Meta Tags</label>
        <textarea 
            rows="4"
            bind:value={JSON.stringify(localSettings.defaultMetaTags)}
        ></textarea>
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

    textarea {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>