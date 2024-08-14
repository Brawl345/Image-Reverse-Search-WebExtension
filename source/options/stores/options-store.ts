import { writable } from 'svelte/store';
import { defaultOptions, getOptions, newProvider } from '../../storage';
import type { Options, StorageProvider } from '../../types';
import { arraymove, getLowerIndex, getUpperIndex } from '../../utils.js';

const cloneProviders = () =>
  defaultOptions.storageProviders.map((p) => ({ ...p }));

const createStore = () => {
  const { subscribe, set, update } = writable<Options>(
    JSON.parse(JSON.stringify(defaultOptions)),
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
        storageProviders: [
          ...previous.storageProviders.filter(
            (_provider: StorageProvider, providerIndex: number) =>
              providerIndex !== indexToRemove,
          ),
        ],
      })),
    resetProviders: () =>
      update((previous) => ({
        ...previous,
        storageProviders: cloneProviders(),
      })),
    moveProviderUp: (providerIndex: number) => {
      update((previous) => ({
        ...previous,
        storageProviders: [
          ...arraymove(
            previous.storageProviders,
            providerIndex,
            getUpperIndex(previous.storageProviders.length, providerIndex),
          ),
        ],
      }));
    },
    moveProviderDown: (providerIndex: number) => {
      update((previous) => ({
        ...previous,
        storageProviders: [
          ...arraymove(
            previous.storageProviders,
            providerIndex,
            getLowerIndex(previous.storageProviders.length, providerIndex),
          ),
        ],
      }));
    },
    loadFromStorage: () => getOptions().then(set),
  };
};

export const options = createStore();
