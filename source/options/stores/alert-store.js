import { writable } from 'svelte/store';

function createStore() {
  const { subscribe, set } = writable({
    variant: null,
    message: null,
  });

  return {
    subscribe,
    success: (message) => set({ variant: 'success', message }),
    error: (message) => set({ variant: 'danger', message }),
    hide: () => set({ variant: null, message: null }),
  };
}

export const alert = createStore();
