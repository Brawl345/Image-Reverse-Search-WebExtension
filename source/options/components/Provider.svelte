<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { StorageProvider } from "../../types";
  import { getMessage } from '../../utils';
  import { options } from '../stores/options-store';

  export let index: number;
  export let provider: StorageProvider;
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
    <img alt="Icon" width="24" height="24" src={`../${provider.icon}`} />
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
    placeholder={getMessage('providerURLPlaceholder')}
    required
    pattern="https?:\/\/.*%s.*"
    bind:value={provider.url}
  />
  <button
    class="btn btn-sm btn-outline-danger"
    type="button"
    on:click={() => options.removeProvider(index)}
  >❌
  </button>
</fieldset>
