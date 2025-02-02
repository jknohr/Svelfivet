<script lang="ts">
    import { state as callState } from './callsidehelper';
    import Telnyxtab from './Telnyxtab.svelte';
    import Surrealtab from './Surrealtab.svelte';
    import Speechomatictab from './Speechomatictab.svelte';
    import ErrorDisplay from './ErrorDisplay.svelte';
    
    // Only keep local UI state
    let activeTab = $state('telnyx');

    $effect(() => {
        console.log('CallsidePanel mounted');
    });
</script>

<div class="callside-panel">
    <div class="tab-navigation">
        <button 
            class:active={activeTab === 'telnyx'}
            onclick={() => activeTab = 'telnyx'}
        >
            Telnyx
        </button>
        <button 
            class:active={activeTab === 'surrealdb'}
            onclick={() => activeTab = 'surrealdb'}
        >
            Database
        </button>
        <button 
            class:active={activeTab === 'speechmatics'}
            onclick={() => activeTab = 'speechmatics'}
        >
            Speechmatics
        </button>
    </div>

    <div class="tab-container">
        {#if activeTab === 'telnyx'}
            <Telnyxtab />
        {:else if activeTab === 'surrealdb'}
            <Surrealtab />
        {:else if activeTab === 'speechmatics'}
            <Speechomatictab />
        {/if}
    </div>
    <ErrorDisplay />
</div>

<style>
    .callside-panel {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: white;
        border-left: 1px solid #ccc;
    }

    .tab-navigation {
        display: flex;
        border-bottom: 1px solid #ccc;
    }

    .tab-navigation button {
        padding: 0.5rem 1rem;
        border: none;
        background: none;
        cursor: pointer;
        border-bottom: 2px solid transparent;
    }

    .tab-navigation button.active {
        border-bottom-color: #4CAF50;
        font-weight: bold;
    }

    .tab-container {
        flex: 1;
        overflow-y: auto;
    }
</style>
