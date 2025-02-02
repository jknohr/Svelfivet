import { writable } from 'svelte/store';
import type { ContextType, ContextState } from '$lib/types/context';

function createContextStore() {
  const { subscribe, set, update } = writable<ContextState>({
    current: null,
    switchContext: async (context: ContextType) => {
      update(state => ({ ...state, current: context }));
    }
  });

  return {
    subscribe,
    switchContext: async (context: ContextType) => {
      update(state => ({ ...state, current: context }));
    }
  };
}

export const currentContext = createContextStore(); 