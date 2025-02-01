import { writable } from 'svelte/store';
import type { ContextConfig } from '../../types/context';

export interface ContextState {
  items: ContextConfig[];
  active: ContextConfig | null;
}

function createContextStore() {
  const { subscribe, set, update } = writable<ContextState>({
    items: [],
    active: null
  });

  return {
    subscribe,
    setActive: (context: ContextConfig) => update(store => ({ ...store, active: context })),
    setItems: (items: ContextConfig[]) => update(store => ({ ...store, items }))
  };
}

export const contextStore = createContextStore(); 