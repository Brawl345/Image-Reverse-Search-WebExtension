<script>
  import { alert } from '../stores/alert-store.js';
  import { options } from '../stores/options-store.js';
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import Provider from './Provider.svelte';
  import { getMessage } from '../../utils.js';
  import { onMount } from 'svelte';
  import Tooltip from 'bootstrap/js/dist/tooltip';

  const save = () => {
    if (
      $options.storageProviders.length === 0 ||
      $options.storageProviders.filter((provider) => provider.selected)
        .length === 0
    ) {
      alert.error(getMessage('msgAtLeastOneSearchProvider'));
      return;
    }

    const nameSet = new Set();

    for (let index = 0; index < $options.storageProviders.length; index++) {
      const providerNumber = index + 1;
      const storageProvider = $options.storageProviders[index];

      if (!/^https?:\/\/.*%s.*$/.test(storageProvider.url)) {
        alert.error(
          getMessage('providerURLPlaceholderError', providerNumber.toString())
        );
        return;
      }
      if (storageProvider.name.length < 2 || storageProvider.name.length > 15) {
        alert.error(
          getMessage('providerNamePlaceholderError', providerNumber.toString())
        );
        return;
      }
      nameSet.add(storageProvider.name);
    }

    if (nameSet.size !== $options.storageProviders.length) {
      alert.error(getMessage('msgDuplicatedProviderName'));
      return;
    }

    chrome.storage.sync
      .set($options)
      .then(() => alert.success(getMessage('msgSuccessSaveOptions')))
      .catch(() => alert.error(getMessage('errorWhileSaving')));
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
    <div class="row mb-2" animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
      <div class="col">
        <Provider {index} {provider} />
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

  <div class="row">
    <div class="col">
      <button class="btn btn-success" type="submit"
        >{getMessage('saveOptions')}</button
      >
    </div>
  </div>

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
</form>
