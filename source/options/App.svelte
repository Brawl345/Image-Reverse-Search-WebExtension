<script lang="ts">
  import { onMount } from 'svelte';
  import { getMessage } from '../utils';
  import Form from './components/Form.svelte';
  import ConsentDialog from './components/ConsentDialog.svelte';
  import { options } from './stores/options-store';

  let doneLoading = false;
  let extensionVersion = '';

  onMount(async () => {
    document.title = `${getMessage('extensionName')} | ${getMessage(
      'optionsPageTitle',
    )}`;
    extensionVersion = chrome.runtime.getManifest().version;
    await options.loadFromStorage();
    doneLoading = true;
  });

  $: needsConsent = doneLoading && options.checkConsentNeeded($options);
</script>

<main class="container mt-3">
  <h1 class="text-center">{getMessage('extensionName')}</h1>
  {#if doneLoading}
    <div class="p-3 bg-light">
      {#if needsConsent}
        <ConsentDialog />
      {:else}
        <Form />
      {/if}
    </div>
  {:else}
    <p class="h1">...</p>
  {/if}

  <p class="text-end small">
    <small
      ><a
        href="https://p.nyanya.de/reverse-image-search-privacy-policy.html"
        target="_blank"
        rel="noopener noreferrer">{getMessage('privacyPolicy')}</a
      ></small
    >
    -
    <small>{getMessage('version', [extensionVersion])}</small>
  </p>
</main>
