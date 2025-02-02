<script lang="ts">
    import { state, updateState } from './callsidehelper';
    
    let currentState = $state;

    function dismissError() {
        updateState({ error: null });
    }
</script>

{#if currentState.error}
    <div class="error-message" role="alert">
        <p>{currentState.error}</p>
        <button on:click={dismissError}>Dismiss</button>
    </div>
{/if}

<style>
    .error-message {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background: #f44336;
        color: white;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        gap: 1rem;
        align-items: center;
        z-index: 1000;
    }

    button {
        background: white;
        color: #f44336;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
