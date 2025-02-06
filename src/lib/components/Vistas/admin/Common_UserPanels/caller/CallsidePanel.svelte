<svelte:options runes={true} />

<script lang="ts">
    import { state as callState } from './callsidehelper';
    import Telnyxtab from './Telnyxtab.svelte';
    import Surrealtab from './Surrealtab.svelte';
    import Speechomatictab from './Speechomatictab.svelte';
    import ErrorDisplay from './ErrorDisplay.svelte';
    import BaseControlPanel from '$lib/components/Layouts/Body/UserControlPanel/BaseControlPanel.svelte';
    import Icon from '$lib/components/Atoms/Icon/Icon.svelte';
    
    // State management using $state
    let activeTab = $state('telnyx');

    // Define controls for the BaseControlPanel
    const controls = [
        {
            id: 'tab-selector',
            type: 'select',
            label: 'Service',
            value: activeTab,
            options: ['telnyx', 'surrealdb', 'speechmatics'],
            icon: 'sync_alt'
        }
    ];

    // Handle tab changes
    $effect(() => {
        const tabControl = controls.find(c => c.id === 'tab-selector');
        if (tabControl) {
            activeTab = tabControl.value as string;
        }
    });

    // Icon mapping for tabs
    const tabIcons = {
        telnyx: 'phone_in_talk',
        surrealdb: 'database',
        speechmatics: 'record_voice_over'
    };
</script>

<BaseControlPanel
    controls={controls}
    title="Call Services"
    accessibility={{
        aria: {
            role: 'region',
            label: 'Call Services Panel'
        }
    }}
>
    <svelte:fragment slot="icon">
        <Icon name="call" size="24px" weight="medium" />
    </svelte:fragment>
    
    <div class="tab-content">
        {#if activeTab === 'telnyx'}
            <div class="tab-header">
                <Icon name={tabIcons.telnyx} size="20px" />
                <Telnyxtab />
            </div>
        {:else if activeTab === 'surrealdb'}
            <div class="tab-header">
                <Icon name={tabIcons.surrealdb} size="20px" />
                <Surrealtab />
            </div>
        {:else if activeTab === 'speechmatics'}
            <div class="tab-header">
                <Icon name={tabIcons.speechmatics} size="20px" />
                <Speechomatictab />
            </div>
        {/if}
        <ErrorDisplay />
    </div>
</BaseControlPanel>

<style>
    .tab-content {
        height: 100%;
        overflow-y: auto;
        padding: 1rem;
    }

    .tab-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
</style>
