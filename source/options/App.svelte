<script lang="ts">
  import { onMount } from 'svelte';
  import { getMessage } from '../utils';
  import Form from './components/Form.svelte';
  import { options } from './stores/options-store';

  let doneLoading = false;

  onMount(async () => {
    document.title = `${getMessage('extensionName')} | ${getMessage(
      'optionsPageTitle',
    )}`;
    await options.loadFromStorage();
    doneLoading = true;
  });
</script>

<main class="container mt-3">
  {#if doneLoading}
    <h1 class="text-center">{getMessage('extensionName')}</h1>

    <div class="p-3 bg-light">
      <Form />
    </div>
  {:else}
    <p class="h1">...</p>
  {/if}
</main>
