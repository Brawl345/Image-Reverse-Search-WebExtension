<script lang="ts">
  import Tooltip from 'bootstrap/js/dist/tooltip';
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { getMessage } from '../../utils.js';
  import { alert } from '../stores/alert-store';
  import { options } from '../stores/options-store';
  import Provider from "./Provider.svelte";

  let draggedIndex: number | null = null;
  let dragOverIndex: number | null = null;

  const handleDragStart = (index: number) => {
    draggedIndex = index;
  };

  const handleDragEnd = () => {
    draggedIndex = null;
    dragOverIndex = null;
  };

  const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault();
    dragOverIndex = index;
  };

  const handleDragLeave = () => {
    dragOverIndex = null;
  };

  const handleDrop = (event: DragEvent, dropIndex: number) => {
    event.preventDefault();

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      options.moveProviderToPosition(draggedIndex, dropIndex);
    }

    draggedIndex = null;
    dragOverIndex = null;
  };

  const validateAndSave = () => {
    if (
      $options.storageProviders.length === 0 ||
      $options.storageProviders.filter((provider) => provider.selected)
        .length === 0
    ) {
      alert.error(getMessage('msgAtLeastOneSearchProvider'));
      return false;
    }

    const nameSet = new Set();

    for (let index = 0; index < $options.storageProviders.length; index++) {
      const providerNumber = index + 1;
      const storageProvider = $options.storageProviders[index];

      // For GET requests, %s is required. For POST requests, %s is optional
      const requiresPlaceholder = !storageProvider.method || storageProvider.method === 'GET';
      const urlPattern = requiresPlaceholder
        ? /^https?:\/\/.*%s.*$/
        : /^https?:\/\/.*$/;

      if (!urlPattern.test(storageProvider.url)) {
        const errorKey = requiresPlaceholder
          ? 'providerURLPlaceholderError'
          : 'providerURLPlaceholderErrorPOST';
        alert.error(
          getMessage(errorKey, providerNumber.toString())
        );
        return false;
      }
      if (storageProvider.name.length < 2 || storageProvider.name.length > 15) {
        alert.error(
          getMessage('providerNamePlaceholderError', providerNumber.toString())
        );
        return false;
      }
      nameSet.add(storageProvider.name);
    }

    if (nameSet.size !== $options.storageProviders.length) {
      alert.error(getMessage('msgDuplicatedProviderName'));
      return false;
    }

    chrome.storage.sync
      .set($options)
      .then(() => {
        alert.success(getMessage("msgSuccessSaveOptions"));
        setTimeout(() => alert.hide(), 3000);
      })
      .catch(() => alert.error(getMessage('errorWhileSaving')));

    return true;
  };

  const save = () => {
    validateAndSave();
  };

  const reset = () => {
    options.resetProviders();
    alert.hide();
  };

  onMount(async () => {
    for (const toastNode of document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    ))
      new Tooltip(toastNode);
  });
</script>

<form on:submit|preventDefault={save}>
  <div class="row">
    <label
      class="col-sm-3 col-form-label form-check-label"
      for="openInBackground">{getMessage('openInBackgroundLabel')}</label
    >
    <div class="col-sm-9">
      <input
        id="openInBackground"
        class="form-check-input mt-2"
        name="openInBackground"
        type="checkbox"
        bind:checked={$options.openInBackground}
      />
    </div>
  </div>

  <div class="row">
    <label class="col-sm-3 col-form-label form-check-label" for="showOpenAll"
      >{getMessage('showOpenAll')}</label
    >
    <div class="col-sm-9">
      <input
        id="showOpenAll"
        class="form-check-input mt-2"
        name="showOpenAll"
        type="checkbox"
        bind:checked={$options.showOpenAll}
        disabled={$options.searchAllByDefault === true}
      />
    </div>
  </div>

  <div class="row">
    <label
      class="col-sm-3 col-form-label form-check-label"
      for="showOpenAllAtTop">{getMessage('showOpenAllAtTop')}</label
    >
    <div class="col-sm-9">
      <input
        id="showOpenAllAtTop"
        class="form-check-input mt-2"
        name="showOpenAllAtTop"
        type="checkbox"
        bind:checked={$options.showOpenAllAtTop}
        disabled={$options.searchAllByDefault === true ||
          $options.showOpenAll === false}
      />
    </div>
  </div>

  <div class="row">
    <label
      class="col-sm-3 col-form-label form-check-label"
      for="searchAllByDefault"
      >{getMessage('searchAllByDefault')}
      <button
        class="btn btn-secondary badge rounded-pill"
        title={getMessage('searchAllByDefault_info')}
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="top">i</button
      ></label
    >
    <div class="col-sm-9">
      <input
        id="searchAllByDefault"
        class="form-check-input mt-2"
        name="searchAllByDefault"
        type="checkbox"
        bind:checked={$options.searchAllByDefault}
      />
    </div>
  </div>

  <div class="row">
    <label class="col-sm-3 col-form-label form-check-label" for="openTabAt"
      >{getMessage('openTabAtLabel')}</label
    >
    <div class="col-sm">
      <select
        id="openTabAt"
        class="form-select"
        name="openTabAt"
        bind:value={$options.openTabAt}
      >
        <option value="right">{getMessage('openTabAtRight')}</option>
        <option value="left">{getMessage('openTabAtLeft')}</option>
        <option value="end">{getMessage('openTabAtEnd')}</option>
      </select>
    </div>
  </div>

  <hr />

  {#each $options.storageProviders as provider, index (provider)}
    <div
      class="row mb-2 drop-zone"
      class:drag-over={dragOverIndex === index}
      animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}
      on:dragover={(e) => handleDragOver(e, index)}
      on:dragleave={handleDragLeave}
      on:drop={(e) => handleDrop(e, index)}
      role="listitem"
    >
      <div class="col">
        <Provider
          {index}
          {provider}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
      </div>
    </div>
  {/each}

  <div class="row">
    <div class="col text-center">
      <button
        class="btn btn-primary"
        type="button"
        on:click={options.addProvider}
      >
        {getMessage('addSearchProvider')}
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        on:click|preventDefault={reset}
      >
        {getMessage('restoreDefaultSearchProviders')}
      </button>
    </div>
  </div>

  <hr />

  {#if $alert.variant !== null}
    <div class="row mt-3" transition:fly>
      <div class="col">
        <div
          class={`alert alert-${$alert.variant} alert-dismissible`}
          role="alert"
        >
          {$alert.message}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            on:click={alert.hide}
            >&nbsp;
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="row">
    <div class="col">
      <button class="btn btn-success" type="submit"
        >{getMessage('saveOptions')}</button
      >
    </div>
  </div>
</form>
