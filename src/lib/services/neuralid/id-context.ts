// lib/stores/id-context.ts
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const ID_CONTEXT_KEY = 'id-context';

export function createIDContext(initialContext: IDContext) {
    const store = writable<IDContext>(initialContext);
    setContext(ID_CONTEXT_KEY, store);
    return store;
}

export function useIDContext(): Writable<IDContext> {
    return getContext(ID_CONTEXT_KEY);
}
