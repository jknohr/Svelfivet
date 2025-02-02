import { writable } from 'svelte/store';
import type { ContextType } from '$lib/types/context';

interface ContextState {
  current: ContextType;
  previous?: ContextType;
}

export const currentContext = writable<ContextState>({
  current: 'real-estate'
}); 