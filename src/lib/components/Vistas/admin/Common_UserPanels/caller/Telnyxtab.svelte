<script lang="ts">
    import { onMount } from 'svelte';
    import { state, updateState } from './callsidehelper';
    import { TelnyxRTC } from '@telnyx/webrtc';
    import type { Call, StateSnapshot } from './callsidetypes';

    let telnyxClient: TelnyxRTC;
    let phoneNumber = '';
    let currentState: StateSnapshot;

    $: currentState = $state;

    onMount(() => {
        initializeTelnyx();
        fetchInitialData();
        return cleanup;
    });

    function cleanup() {
        telnyxClient?.disconnect();
    }

    const initializeTelnyx = async () => {
        try {
            telnyxClient = new TelnyxRTC({
                login_token: currentState.settings.telnyxLogin,
                password: currentState.settings.telnyxPassword
            });
            console.log('Telnyx initialized.');
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to initialize Telnyx' });
        }
    };

    const fetchInitialData = async () => {
        try {
            const telnyxNumbersResponse = await fetch('/api/telnyx/numbers', {
                headers: {
                    Authorization: `Bearer ${$state.settings.telnyxLogin}`
                }
            });
            if (!telnyxNumbersResponse.ok) {
                throw new Error('Failed to fetch Telnyx numbers');
            }
            const numbers = await telnyxNumbersResponse.json();
            updateState({ numbers });
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to fetch numbers' });
        }
    };

    const placeCall = (destinationNumber: string) => {
        try {
            const call = telnyxClient.newCall({
                destinationNumber,
                callerNumber: $state.settings.telnyxLogin
            });

            const telnyxCall = call as unknown as { on: Function, callId: string };
            telnyxCall.on('connected', () => {
                const newCall: Call = {
                    id: telnyxCall.callId,
                    callerId: destinationNumber,
                    duration: 0,
                    status: 'active',
                    connectedToSpeechmatics: false,
                    muted: false,
                    transcription: []
                };
                updateState({ calls: [...$state.calls, newCall] });
            });
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to place call' });
        }
    };

    function handleInput(event: Event & { currentTarget: HTMLInputElement }, key: keyof typeof currentState.settings) {
        const value = event.currentTarget.value;
        updateState({ 
            settings: { 
                ...currentState.settings, 
                [key]: value 
            } 
        });
    }
</script>

<div class="tab-content">
    <h2>Telnyx Management Console</h2>
    <div class="telnyx-settings">
        <h3>Settings</h3>
        <div>
            <label for="telnyx-login">Login:</label>
            <input
                id="telnyx-login"
                type="text"
                value={$state.settings.telnyxLogin}
                on:input={(e) => handleInput(e, 'telnyxLogin')}
            />
        </div>
        <div>
            <label for="telnyx-password">Password:</label>
            <input
                id="telnyx-password"
                type="password"
                value={$state.settings.telnyxPassword}
                on:input={(e) => handleInput(e, 'telnyxPassword')}
            />
        </div>
        <button on:click={initializeTelnyx}>Reconnect</button>
    </div>

    <div class="telnyx-numbers">
        <h3>Phone Numbers</h3>
        {#each $state.numbers as num (num.id)}
            <div class="telnyx-number-item">
                {num.phoneNumber} - {num.status}
            </div>
        {/each}
    </div>

    <div class="telnyx-dialer">
        <h3>Dialer</h3>
        <input type="text" placeholder="Enter a phone number" bind:value={phoneNumber} />
        <button on:click={() => placeCall(phoneNumber)}>Call</button>
    </div>

    <div class="call-logs">
        <h3>Recent Calls</h3>
        {#each $state.calls as call (call.id)}
            {#if call.status === 'ended'}
                <div class="call-log-entry">
                    <span>{call.callerId} (ended)</span>
                    {#if call.transcription.length}
                        <small>Transcription attached</small>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .tab-content {
        padding: 1rem;
    }

    .telnyx-settings,
    .telnyx-numbers,
    .telnyx-dialer,
    .call-logs {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    label {
        display: block;
        margin-bottom: 0.25rem;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        margin: 0.5rem 0;
        padding: 0.5rem 1rem;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    }

    .telnyx-number-item,
    .call-log-entry {
        padding: 0.25rem 0;
    }
</style>
