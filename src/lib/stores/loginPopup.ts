import { writable } from 'svelte/store';

interface LoginPopupState {
  isOpen: boolean;
  redirectPath: string | null;
}

function createLoginPopupStore() {
  const { subscribe, set, update } = writable<LoginPopupState>({
    isOpen: false,
    redirectPath: null
  });

  return {
    subscribe,
    open: (redirectPath: string | null = null) => {
      set({ isOpen: true, redirectPath });
    },
    close: () => {
      set({ isOpen: false, redirectPath: null });
    }
  };
}

export const loginPopup = createLoginPopupStore(); 