import { writable } from 'svelte/store';
import defaultOptions from '../../default-options.json';
import { arraymove, getLowerIndex, getUpperIndex } from '../utils.js';

const cloneProviders = () =>
  defaultOptions.storageProviders.map((p) => ({ ...p }));

const { subscribe, set, update } = writable(
  JSON.parse(JSON.stringify(defaultOptions))
);

const addProvider = () =>
  update((previous) => ({
    ...previous,
    storageProviders: [
      ...previous.storageProviders,
      {
        i: previous.storageProviders.length,
        name: '',
        icon: 'icons/other.png',
        url: '',
        selected: true,
      },
    ],
  }));

const removeProvider = (indexToRemove) =>
  update((previous) => ({
    ...previous,
    storageProviders: [
      ...previous.storageProviders.filter(
        (_, providerIndex) => providerIndex !== indexToRemove
      ),
    ],
  }));

const resetProviders = () =>
  update((previous) => ({
    ...previous,
    storageProviders: cloneProviders(),
  }));

const moveProviderUp = (providerIndex) => {
  update((previous) => ({
    ...previous,
    storageProviders: [
      ...arraymove(
        previous.storageProviders,
        providerIndex,
        getUpperIndex(previous.storageProviders.length, providerIndex)
      ),
    ],
  }));
};

const moveProviderDown = (providerIndex) => {
  update((previous) => ({
    ...previous,
    storageProviders: [
      ...arraymove(
        previous.storageProviders,
        providerIndex,
        getLowerIndex(previous.storageProviders.length, providerIndex)
      ),
    ],
  }));
};

const loadFromStorage = () =>
  chrome.storage.sync.get(defaultOptions).then((data) => set(data));

export const options = {
  set,
  subscribe,
  update,
  addProvider,
  removeProvider,
  resetProviders,
  moveProviderUp,
  moveProviderDown,
  loadFromStorage,
};
