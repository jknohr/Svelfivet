import { writable } from 'svelte/store';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    roles: string[];
  } | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: false,
    user: null
  });

  return {
    subscribe,
    login: async (credentials: { username: string; password: string }) => {
      // Implement login logic here
      update(state => ({ ...state, isAuthenticated: true }));
    },
    logout: () => {
      set({ isAuthenticated: false, user: null });
    },
    setUser: (user: AuthState['user']) => {
      update(state => ({ ...state, user }));
    }
  };
}

export const auth = createAuthStore(); 