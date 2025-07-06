<script lang="ts">
  import { getMessage } from '../../utils';
  import { options } from '../stores/options-store';

  const handleAccept = async () => {
    options.giveConsent();
    await chrome.storage.sync.set($options);
  };

  const handleDecline = async () => {
    await chrome.management.uninstallSelf({ showConfirmDialog: true });
  };
</script>

<h2>{getMessage('consentDialogTitle')}</h2>
<div class="alert alert-info">
  <h6>{getMessage('consentDataCollectionTitle')}</h6>
  <p>{getMessage('consentDataCollectionDescription')}</p>

  <h6>{getMessage('consentWhatDataTitle')}</h6>
  <ul>
    <li>{getMessage('consentDataImageUrls')}</li>
    <li>{getMessage('consentDataSearchServices')}</li>
  </ul>

  <h6>{getMessage('consentHowDataUsedTitle')}</h6>
  <p>{getMessage('consentHowDataUsedDescription')}</p>

  <p class="mb-0">
    <a
      href="https://p.nyanya.de/reverse-image-search-privacy-policy.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      {getMessage('privacyPolicy')}
    </a>
  </p>
</div>

<div class="d-flex flex-column flex-md-row gap-2">
  <button type="button" class="btn btn-danger" on:click={handleDecline}>
    {getMessage('consentDeclineAndUninstall')}
  </button>
  <button type="button" class="btn btn-secondary" on:click={handleAccept}>
    {getMessage('consentAccept')}
  </button>
</div>
