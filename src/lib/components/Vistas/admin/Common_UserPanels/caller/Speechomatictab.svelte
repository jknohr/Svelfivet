<script lang="ts">
	import { onMount } from 'svelte';
	import { state, updateState } from './callsidehelper';
	import type { FlowConfig, TranscriptionConfig, Call, SpeechmaticsFlowConfig, SpeechmaticsClient } from './callsidetypes';
	import type { TelnyxRTC } from '@telnyx/webrtc';

	// Subscribe to store
	let currentState = $state;

	// Add available flows
	const availableFlows: FlowConfig[] = [
		{ id: 'demo1', name: 'Demo Flow 1', type: 'demo' },
		{ id: 'demo2', name: 'Demo Flow 2', type: 'demo' }
	];

	onMount(() => {
		initializeSpeechmatics();
		return cleanup;
	});

	function cleanup() {
		const speechmatics = currentState.clients.speechmatics;
		if (speechmatics) {
			// Close any active connections
			speechmatics.endSession().catch(console.error);
		}
	}

	async function initializeSpeechmatics() {
		try {
			const speechmatics = currentState.clients.speechmatics;
			if (!speechmatics) {
				throw new Error('Speechmatics client not initialized');
			}

			const config: TranscriptionConfig = {
				language: currentState.settings.speechmaticsLanguage,
				model: currentState.settings.speechmaticsModel
			};

			await speechmatics.startSession(config);
			console.log('Speechmatics initialized');
		} catch (error) {
			updateState({
				error: error instanceof Error ? error.message : 'Failed to initialize Speechmatics'
			});
		}
	}

	function setSpeechmaticsFlowConfig(flowConfig: FlowConfig) {
		const speechmaticsConfig: SpeechmaticsFlowConfig = {
			flowId: flowConfig.id,
			flowName: flowConfig.name,
			apiKey: currentState.settings.speechmaticsApiKey
		};
		updateState({ config: speechmaticsConfig });
		console.log('Flow config updated:', speechmaticsConfig);
	}

	function connectCallToSpeechmatics(callId: string) {
		try {
			const updatedCalls = currentState.calls.map((call: Call) => {
				if (call.id === callId) {
					return { ...call, connectedToSpeechmatics: true, status: 'active' as const };
				}
				return call;
			});
			updateState({ calls: updatedCalls });
			console.log('Call connected to Speechmatics:', callId);
		} catch (error) {
			updateState({
				error: error instanceof Error ? error.message : 'Failed to connect call to Speechmatics'
			});
		}
	}
</script>

<div class="tab-content">
	<h2>Speechmatics Control Panel</h2>

	<div class="speechmatics-settings">
		<h3>Settings</h3>
		<div>
			<label for="speechmatics-api-key">API Key:</label>
			<input
				id="speechmatics-api-key"
				type="password"
				value={currentState.settings.speechmaticsApiKey}
				oninput={(e) =>
					updateState({
						settings: {
							...currentState.settings,
							speechmaticsApiKey: (e.target as HTMLInputElement).value
						}
					})}
			/>
		</div>
		<div>
			<label for="speechmatics-language">Language:</label>
			<select id="speechmatics-language" bind:value={currentState.settings.speechmaticsLanguage}>
				<option value="en">English</option>
				<option value="es">Spanish</option>
				<option value="fr">French</option>
			</select>
		</div>
		<div>
			<label for="speechmatics-model">Model:</label>
			<select id="speechmatics-model" bind:value={currentState.settings.speechmaticsModel}>
				<option value="base">Base</option>
				<option value="enhanced">Enhanced</option>
			</select>
		</div>
		<button onclick={initializeSpeechmatics}>Reconnect</button>
	</div>

	<div class="flow-management">
		<h3>Flow Management</h3>
		<div class="flow-list">
			{#each availableFlows as flow (flow.id)}
				<button class="flow-item" onclick={() => setSpeechmaticsFlowConfig(flow)}>
					Load: {flow.name}
				</button>
			{/each}
		</div>

		<p>
			Current Flow:
			{#if currentState.config}
				<strong>{currentState.config.flowName}</strong>
			{:else}
				<em>No flow selected</em>
			{/if}
		</p>
	</div>

	<div class="active-calls">
		<h3>Active Calls</h3>
		{#each currentState.calls as call (call.id)}
			{#if call.status === 'active'}
				<div class="call-item">
					<span>{call.callerId}</span>
					{#if !call.connectedToSpeechmatics}
						<button onclick={() => connectCallToSpeechmatics(call.id)}>
							Connect to Speechmatics
						</button>
					{:else}
						<span class="connected-badge">Connected</span>
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

	.speechmatics-settings,
	.flow-management,
	.active-calls {
		margin: 1rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.flow-list {
		display: flex;
		gap: 0.5rem;
		margin: 1rem 0;
	}

	.flow-item {
		padding: 0.5rem 1rem;
		background: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
	}

	.call-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		margin: 0.5rem 0;
		background: #f5f5f5;
		border-radius: 4px;
	}

	.connected-badge {
		background: #4caf50;
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
	}

	input,
	select {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 0.5rem 1rem;
		background: #f0f0f0;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background: #e0e0e0;
	}
</style>
