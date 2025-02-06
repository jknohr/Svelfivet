<script lang="ts">
    import { $state } from 'svelte/state'; // Update the import path if necessary
    import { on } from 'svelte/event'; // Import the on function for event handling

    // Props
    export let settings: {
        enableWorkflow: boolean;
        requireApproval: boolean;
        notifyOnChanges: boolean;
    };
    export let onChange: (updated: Partial<typeof settings>) => void;

    // Local state
    let localSettings = $state({ ...settings });

    // Watch for changes and emit them
    $effect(() => {
        onChange({ workflowSettings: localSettings });
    });
</script>

<section>
    <h2 class="section-title">Workflow Settings</h2>
    <div class="setting-item">
        <label>Enable Content Workflow</label>
        <input 
            type="checkbox"
            bind:checked={localSettings.enableWorkflow}
        />
    </div>
    <div class="setting-item">
        <label>Require Approval</label>
        <input 
            type="checkbox"
            bind:checked={localSettings.requireApproval}
        />
    </div>
    <div class="setting-item">
        <label>Notify on Changes</label>
        <input 
            type="checkbox"
            bind:checked={localSettings.notifyOnChanges}
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

    input[type="checkbox"] {
        flex: 1;
    }
</style>