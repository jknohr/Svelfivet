import { getContext, setContext, hasContext } from 'svelte';
import type { Writable } from 'svelte/store';

// Use Symbol for guaranteed uniqueness
const CONTENT_CONTEXT_KEY = Symbol('content-context');

export interface ContextConfig {
    id: string;
    type: 'node' | 'edge' | 'group';
    data: unknown;
}

export interface ContextState {
    items: ContextConfig[];
    active: ContextConfig | null;
}

export interface ContentContext extends ContextState {
    setActive: (context: ContextConfig) => void;
    setItems: (items: ContextConfig[]) => void;
}

/**
 * Sets the content context for a component and its children
 * @param context The context state and methods to be shared
 */
export function setContentContext(context: ContentContext): void {
    setContext(CONTENT_CONTEXT_KEY, context);
}

/**
 * Gets the content context from a parent component
 * @throws Error if used outside of a component with content context
 */
export function getContentContext(): ContentContext {
    if (!hasContext(CONTENT_CONTEXT_KEY)) {
        throw new Error('Content context must be used within a component that has set content context');
    }
    return getContext(CONTENT_CONTEXT_KEY);
}

/**
 * Creates a new content context state with reactive properties
 * @returns A content context object with state and methods
 */
export function createContentContext(): ContentContext {
    const state = $state<ContextState>({
        items: [],
        active: null
    });

    return {
        get items() { return state.items; },
        get active() { return state.active; },
        setActive(context: ContextConfig) {
            try {
                state.active = context;
            } catch (error) {
                console.error('Failed to set active context:', error);
                throw error;
            }
        },
        setItems(items: ContextConfig[]) {
            try {
                state.items = items;
            } catch (error) {
                console.error('Failed to set context items:', error);
                throw error;
            }
        }
    };
} 