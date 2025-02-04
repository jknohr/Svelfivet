import { writable } from 'svelte/store';
import type { VistaType, VistaState } from '$lib/types/vista';

function createVistaStore() {
  const { subscribe, set, update } = writable<VistaState>({
    current: null,
    switchVista: async (vista: VistaType) => {
      update(state => ({ ...state, current: vista }));
    }
  });

  return {
    subscribe,
    switchVista: async (vista: VistaType) => {
      update(state => ({ ...state, current: vista }));
    }
  };
}

export const currentVista = createVistaStore();
