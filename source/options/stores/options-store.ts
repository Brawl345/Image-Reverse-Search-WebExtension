import { writable } from 'svelte/store';
import { defaultOptions, getOptions, newProvider } from '../../storage';
import type { Options } from '../../types';
import { arraymove, getLowerIndex, getUpperIndex } from '../../utils.js';

const createStore = () => {
  const { subscribe, set, update } = writable<Options>(
    structuredClone(defaultOptions),
  );

  return {
    set,
    subscribe,
    addProvider: () =>
      update((previous) => ({
        ...previous,
        storageProviders: [...previous.storageProviders, { ...newProvider }],
      })),
    removeProvider: (indexToRemove: number) =>
      update((previous) => ({
        ...previous,
        storageProviders: previous.storageProviders.filter(
          (_, i) => i !== indexToRemove,
        ),
      })),
    resetProviders: () =>
      update((previous) => ({
        ...previous,
        storageProviders: defaultOptions.storageProviders.map((p) => ({
          ...p,
        })),
      })),
    moveProviderUp: (providerIndex: number) =>
      update((previous) => ({
        ...previous,
        storageProviders: arraymove(
          previous.storageProviders,
          providerIndex,
          getUpperIndex(previous.storageProviders.length, providerIndex),
        ),
      })),
    moveProviderDown: (providerIndex: number) =>
      update((previous) => ({
        ...previous,
        storageProviders: arraymove(
          previous.storageProviders,
          providerIndex,
          getLowerIndex(previous.storageProviders.length, providerIndex),
        ),
      })),
    loadFromStorage: async () => set(await getOptions()),
  };
};

export const options = createStore();
