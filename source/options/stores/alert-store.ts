import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

interface Alert {
  variant: string | null;
  message: string | null;
}

function createStore() {
  const { subscribe, set }: Writable<Alert> = writable({
    variant: null,
    message: null,
  });

  return {
    subscribe,
    success: (message: string) => set({ variant: 'success', message }),
    error: (message: string) => set({ variant: 'danger', message }),
    hide: () => set({ variant: null, message: null }),
  };
}

export const alert = createStore();
