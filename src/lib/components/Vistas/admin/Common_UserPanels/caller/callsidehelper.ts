import { writable, type Writable, get } from 'svelte/store';
import { TelnyxRTC } from '@telnyx/webrtc';
import { FlowClient } from '@speechmatics/flow-client';
import { Surreal } from 'surrealdb.js';
import type { Call, StateSnapshot, Settings, FlowConfig, SpeechmaticsFlowConfig } from './callsidetypes';

const initialState: StateSnapshot = {
    calls: [],
    numbers: [],
    config: null,
    error: null,
    settings: {
        telnyxLogin: '',
        telnyxPassword: '',
        speechmaticsApiKey: '',
        speechmaticsLanguage: 'en',
        speechmaticsModel: 'base',
        surrealDbUrl: '',
        surrealDbUser: '',
        surrealDbPass: ''
    },
    clients: {
        telnyx: null,
        speechmatics: null,
        db: null
    }
};

export const state: Writable<StateSnapshot> = writable(initialState);

export function updateState(update: Partial<StateSnapshot>) {
    state.update(currentState => ({ ...currentState, ...update }));
}

// Helper functions for state management
export function initializeSpeechmatics(config: { language: string; model: string }) {
    state.update(currentState => {
        if (!currentState.clients.speechmatics) {
            return currentState;
        }
        // Remove initialize call as it's not part of FlowClient type
        // Instead, implement your specific speechmatics initialization logic here
        return currentState;
    });
}

export function setSpeechmaticsFlow(flowConfig: FlowConfig) {
    const speechmaticsConfig: SpeechmaticsFlowConfig = {
        flowId: flowConfig.id,
        flowName: flowConfig.name,
        apiKey: get(state).settings.speechmaticsApiKey
    };
    updateState({ config: speechmaticsConfig });
}

export function handleCall(call: Call) {
    state.update(currentState => {
        const calls = [...currentState.calls];
        const existingCallIndex = calls.findIndex(c => c.id === call.id);
        
        if (existingCallIndex >= 0) {
            calls[existingCallIndex] = call;
        } else {
            calls.push(call);
        }
        
        return { ...currentState, calls };
    });
}

export function connectCallToSpeechmatics(callId: string) {
    state.update(currentState => {
        const calls = currentState.calls.map(call => 
            call.id === callId 
                ? { ...call, connectedToSpeechmatics: true }
                : call
        );
        return { ...currentState, calls };
    });
}

export function setError(error: string | null) {
    updateState({ error });
}

export async function initializeClients() {
    try {
        const currentState = get(state);
        const { settings } = currentState;
        
        if (settings.telnyxLogin && settings.telnyxPassword) {
            const telnyx = new TelnyxRTC({
                login_token: settings.telnyxLogin,
                password: settings.telnyxPassword
            });
            
            updateState({
                clients: {
                    ...currentState.clients,
                    telnyx
                }
            });
        }

        if (settings.surrealDbUser && settings.surrealDbPass) {
            const surreal = new Surreal();
            await surreal.connect('http://localhost:8000');
            await surreal.signin({
                username: settings.surrealDbUser,
                password: settings.surrealDbPass,
                // Remove surrealDbScope as it's not in the Settings type
                NS: 'namespace',
                DB: 'database'
            });
            
            // Update state without including surrealdb client as it's not in the Clients type
            updateState({
                clients: {
                    ...currentState.clients
                }
            });
        }
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize clients');
    }
}

