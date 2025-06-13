<script lang="ts">
  import { fly, slide } from 'svelte/transition';
  import type { StorageProvider } from '../../types';
  import { base64EncodeIcon, getMessage, isFirefox } from "../../utils";
  import { options } from '../stores/options-store';

  export let index: number;
  export let provider: StorageProvider;

  const advancedOptionsChanged = provider.stripProtocol || provider.doNotEncodeUrl || provider.method === 'POST'

  let showAdvanced = advancedOptionsChanged;
  let errorMsg: string | null = null;

  const hideAlert = () => {
    errorMsg = null;
  }

  const getIcon = (icon: string) => {
    if (icon.startsWith('icons/')) {
      return chrome.runtime.getURL(icon);
    }
    return icon;
  }

  $: iconUrl = getIcon(provider.icon);

  const uploadIcon = () => {
    if (!isFirefox) {
      errorMsg = getMessage("msgIconUploadNotSupported");
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', () => {
      if (!fileInput.files || fileInput.files.length === 0) {
        return;
      }
      errorMsg = null;

      const file = fileInput.files[0];
      if (!file.type.startsWith('image/')) {
        errorMsg = getMessage('msgIconUploadNotImage');
        return;
      }

      const tmpImg = new Image();

      tmpImg.addEventListener('error', () => {
        errorMsg = getMessage('msgIconUploadNotImage');
      });

      tmpImg.addEventListener('load', () => {
        if (tmpImg.naturalHeight !== tmpImg.naturalWidth) {
          errorMsg = getMessage('msgIconUploadNotSquareImage');
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          errorMsg = getMessage('msgIconUploadNotImage');
          return;
        }
        ctx.drawImage(tmpImg, 0, 0, 24, 24);

        provider.icon = base64EncodeIcon(ctx);
      });

      tmpImg.src = URL.createObjectURL(file);
    });
    
    fileInput.click();
  }

</script>


<fieldset class="input-group" name="storageProviders" transition:fly>
  <button
    class="btn btn-sm btn-secondary"
    type="button"
    on:click={() => options.moveProviderUp(index)}
  >▲
  </button>
  <button
    class="btn btn-sm btn-secondary"
    type="button"
    on:click={() => options.moveProviderDown(index)}
  >▼
  </button>
  <div class="input-group-text">
    <input
      class="form-check-input"
      type="checkbox"
      name="selected"
      bind:checked={provider.selected}
    />
  </div>
  <div class="input-group-text">
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
    <img class="pointer" alt="Icon" width="24" height="24" src={iconUrl} on:click={uploadIcon} />
  </div>
  <input
    class="form-control"
    type="text"
    name="name"
    placeholder={getMessage('providerNamePlaceholder')}
    required
    minlength="2"
    maxlength="15"
    bind:value={provider.name}
  />
  <input
    class="form-control w-50"
    type="url"
    name="url"
    placeholder={provider.method === 'POST' ? getMessage('providerURLPlaceholderPOST') : getMessage('providerURLPlaceholder')}
    required
    pattern={provider.method === 'POST' ? 'https?:\/\/.*' : 'https?:\/\/.*%s.*'}
    bind:value={provider.url}
  />
  <button
    class="btn btn-sm"
    class:btn-outline-secondary={!showAdvanced}
    class:btn-secondary={showAdvanced}
    type="button"
    on:click={() => showAdvanced = !showAdvanced}
  >⚙
  </button>
  <button
    class="btn btn-sm btn-outline-danger"
    type="button"
    on:click={() => options.removeProvider(index)}
  >❌
  </button>
</fieldset>

<div class:mt-2={showAdvanced}>
  {#if showAdvanced}
    <div class="row" transition:slide>
      <div class="col">
        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input bind:checked={provider.doNotEncodeUrl} class="form-check-input" type="checkbox" name="doNotEncodeUrl">
            {getMessage('doNotEncodeUrlLabel')}
          </label>
        </div>

        <div class="form-check form-check-inline">
          <label class="form-check-label">
            <input bind:checked={provider.stripProtocol} class="form-check-input" type="checkbox" name="stripProtocol">
            {getMessage('stripProtocolLabel')}
          </label>
        </div>
      </div>
    </div>

    <div class="row mt-2" transition:slide>
      <div class="col-md-3">
        <label class="form-label" for="method-{index}">
          {getMessage('httpMethodLabel')}
        </label>
        <select
          id="method-{index}"
          class="form-select form-select-sm"
          bind:value={provider.method}
          name="method"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>

      {#if provider.method === 'POST'}
        <div class="col-md-4">
          <label class="form-label" for="postFieldName-{index}">
            {getMessage('postFieldNameLabel')}
          </label>
          <input
            id="postFieldName-{index}"
            class="form-control form-control-sm"
            type="text"
            name="postFieldName"
            placeholder={getMessage('postFieldNamePlaceholder')}
            bind:value={provider.postFieldName}
          />
        </div>

        <div class="col-md-5">
          <label class="form-label" for="contentType-{index}">
            {getMessage('contentTypeLabel')}
          </label>
          <select
            id="contentType-{index}"
            class="form-select form-select-sm"
            bind:value={provider.contentType}
            name="contentType"
          >
            <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
            <option value="multipart/form-data">multipart/form-data</option>
          </select>
        </div>
      {/if}
    </div>
  {/if}
</div>

{#if errorMsg !== null}
  <div class="row mt-3" transition:fly>
    <div class="col">
      <div
        class="alert alert-danger alert-dismissible"
        role="alert"
      >
        {errorMsg}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          on:click={hideAlert}
        >&nbsp;
        </button>
      </div>
    </div>
  </div>
{/if}
