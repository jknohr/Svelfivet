// lib/services/neuralid/id-state.ts
import type { IDNode, IDRelation } from './id-relations';

export interface IDState {
    id: string;
    type: string;
    status: 'active' | 'inactive' | 'pending' | 'error';
    metadata: Record<string, any>;
    lastUpdated: number;
    version: number;
    namespace: string;
    context: string;
}

// Main state store for ID management
let idStates = $state<Record<string, IDState>>({});
let relationManager: IDRelationManager | null = null;

// Active IDs derived state
let activeIds = $derived(
    Object.entries(idStates)
        .filter(([_, state]) => state.status === 'active')
        .map(([id]) => id)
);

// Error states derived
let errorStates = $derived(
    Object.entries(idStates)
        .filter(([_, state]) => state.status === 'error')
        .reduce((acc, [id, state]) => ({ ...acc, [id]: state }), {})
);

import { IDRelationManager } from './id-relations';

// Initialize the relation manager
export function initializeRelationManager(surreal: any, namespace: string) {
    relationManager = new IDRelationManager(surreal, namespace);
    return relationManager;
}

// State management functions
export async function registerID(id: string, type: string, metadata: Record<string, any> = {}) {
    if (!relationManager) {
        throw new Error('RelationManager not initialized');
    }

    const state: IDState = {
        id,
        type,
        status: 'active',
        metadata,
        lastUpdated: Date.now(),
        version: 1,
        namespace: metadata.context?.namespace || 'default',
        context: metadata.context?.context || 'global'
    };

    try {
        await relationManager.createNode(id, type, metadata);
        idStates[id] = state;
    } catch (error) {
        console.error('Failed to register ID:', error);
        markIDError(id, error);
        throw error;
    }

    // Create node in SurrealDB
    if (relationManager) {
        await relationManager.createNode({
            id,
            type,
            namespace: state.namespace,
            context: state.context,
            metadata
        });
    }
}

export async function updateIDState(id: string, updates: Partial<IDState>) {
    if (!idStates[id]) {
        throw new Error(`ID ${id} not found in state management`);
    }

    const newState = {
        ...idStates[id],
        ...updates,
        lastUpdated: Date.now(),
        version: idStates[id].version + 1
    };

    idStates[id] = newState;

    // Update node in SurrealDB
    if (relationManager) {
        await relationManager.createNode({
            id,
            type: newState.type,
            namespace: newState.namespace,
            context: newState.context,
            metadata: newState.metadata
        });
    }
}

export async function relateIDs(fromId: string, toId: string, relation: IDRelation) {
    if (relationManager) {
        await relationManager.relateNodes(fromId, toId, relation);
    }
}

export async function deactivateID(id: string) {
    if (idStates[id]) {
        await updateIDState(id, { status: 'inactive' });
    }
}

export async function markIDError(id: string, error: any) {
    if (idStates[id]) {
        await updateIDState(id, {
            status: 'error',
            metadata: { ...idStates[id].metadata, error }
        });
    }
}

// State cleanup effect
$effect(() => {
    if (!relationManager) return;
    
    // Cleanup old inactive states after 24 hours
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    Object.entries(idStates).forEach(([id, state]) => {
        if (state.status === 'inactive' && (now - state.lastUpdated > dayInMs)) {
            delete idStates[id];
        }
    });
});

// Export state getters
export function getIDState(id: string): IDState | undefined {
    return idStates[id];
}

export function getActiveIDs(): string[] {
    return activeIds;
}

export function getErrorStates(): Record<string, IDState> {
    return errorStates;
}

// Batch operations
export async function batchUpdateStates(updates: Record<string, Partial<IDState>>) {
    for (const [id, update] of Object.entries(updates)) {
        if (idStates[id]) {
            await updateIDState(id, update);
        }
    }
}

// State snapshot for external integrations
export function getStateSnapshot(): Record<string, IDState> {
    return $state.snapshot(idStates);
}

// Prediction functions
export async function predictRelatedIDs(id: string): Promise<IDNode[]> {
    if (relationManager) {
        return relationManager.predictRelatedNodes(id);
    }
    return [];
}

// Get related IDs
export async function getRelatedIDs(id: string, relation: string, direction: 'in' | 'out' = 'out'): Promise<IDNode[]> {
    if (relationManager) {
        return relationManager.getRelatedNodes(id, relation, direction);
    }
    return [];
}
