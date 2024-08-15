import { get } from 'svelte/store';
import { beforeEach, describe, expect, it } from 'vitest';
import { defaultOptions, newProvider } from '../../storage';
import type { StorageProvider } from '../../types';
import { options } from './options-store';

describe('Options Store', () => {
  const store = options;

  beforeEach(() => {
    store.resetAll();
  });

  const getUpdatedStore = () => get(store);

  const expectProviderCountToBe = (expectedCount: number) => {
    const updatedStore = getUpdatedStore();
    expect(updatedStore.storageProviders.length).toBe(expectedCount);
  };

  const expectFirstProviderToEqual = (expectedProvider: StorageProvider) => {
    const updatedStore = getUpdatedStore();
    expect(updatedStore.storageProviders[0]).toStrictEqual(expectedProvider);
  };

  const expectLastProviderToEqual = (expectedProvider: StorageProvider) => {
    const updatedStore = getUpdatedStore();
    expect(
      updatedStore.storageProviders[updatedStore.storageProviders.length - 1],
    ).toStrictEqual(expectedProvider);
  };

  const expectProviderAtIndexToEqual = (
    index: number,
    expectedProvider: StorageProvider,
  ) => {
    const updatedStore = getUpdatedStore();
    expect(updatedStore.storageProviders[index]).toStrictEqual(
      expectedProvider,
    );
  };

  it('should initialize with default options', () => {
    expect(getUpdatedStore()).toEqual(defaultOptions);
  });

  it('should add a new provider', () => {
    store.addProvider();
    expectProviderCountToBe(defaultOptions.storageProviders.length + 1);
    expectLastProviderToEqual(newProvider);
  });

  it('should remove a provider', () => {
    store.removeProvider(0);
    expectProviderCountToBe(defaultOptions.storageProviders.length - 1);
    expectFirstProviderToEqual(defaultOptions.storageProviders[1]);
  });

  it('should reset providers to default', () => {
    store.addProvider();
    store.resetProviders();
    const updatedStore = getUpdatedStore();
    expect(updatedStore.storageProviders).toStrictEqual(
      defaultOptions.storageProviders,
    );
    expectLastProviderToEqual(
      defaultOptions.storageProviders[
        defaultOptions.storageProviders.length - 1
      ],
    );
  });

  it('should move a provider up', () => {
    store.moveProviderUp(1);
    expectFirstProviderToEqual(defaultOptions.storageProviders[1]);
  });

  it('should move first provider up', () => {
    store.moveProviderUp(0);
    expectLastProviderToEqual(defaultOptions.storageProviders[0]);
  });

  it('should move a provider down', () => {
    store.moveProviderDown(0);
    expectProviderAtIndexToEqual(1, defaultOptions.storageProviders[0]);
  });

  it('should move last provider down', () => {
    store.moveProviderDown(defaultOptions.storageProviders.length - 1);
    expectFirstProviderToEqual(
      defaultOptions.storageProviders[
        defaultOptions.storageProviders.length - 1
      ],
    );
  });
});
