/* Localization */
document.title = browser.i18n.getMessage("optionsPageTitle");
document.getElementById("navbarTitle").textContent = browser.i18n.getMessage("extensionName");
document.getElementById("openTabAtLabel").textContent = browser.i18n.getMessage("openTabAtLabel");
document.getElementById("right").textContent = browser.i18n.getMessage("openAtRight");
document.getElementById("left").textContent = browser.i18n.getMessage("openAtLeft");
document.getElementById("end").textContent = browser.i18n.getMessage("openAtEnd");
document.getElementById("openInBackgroundLabel").textContent = browser.i18n.getMessage("openInBackground");
document.getElementById("searchProviderLabel").textContent = browser.i18n.getMessage("searchProviderLabel");
document.getElementById("save-button").textContent = browser.i18n.getMessage("saveOptions");
document.getElementById('status').textContent = browser.i18n.getMessage("saved");

/* Store the currently selected settings using browser.storage.sync. */
function storeSettings() {
    
  function getOpenTabAt() {
    const openTabAt = document.querySelector("#openTabAt");
    return openTabAt.value
  }
  
  function getSearchProvider() {
    const searchProvider = document.querySelector("#searchProvider");
    return searchProvider.value
  }

  const openInBackground = document.getElementById('openInBackground').checked;
  const openTabAt = getOpenTabAt();
  const searchProvider = getSearchProvider();

  browser.storage.sync.set({
    openInBackground,
    openTabAt,
    searchProvider
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.style.display = 'block';
    status.style.fontWeight = 'bold';
    setTimeout(function() {
      status.style.display = 'none';
    }, 1800);
  });
}

/* Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty. */
function updateUI(restoredSettings) {
  document.getElementById('openInBackground').checked = restoredSettings.openInBackground;

  const tabAtSelectList = document.querySelector("#openTabAt");
  tabAtSelectList.value = restoredSettings.openTabAt;
  
  const searchProviderSelectList = document.querySelector("#searchProvider");
  searchProviderSelectList.value = restoredSettings.searchProvider;
}

function onError(e) {
  console.error(e);
}

/* On opening the options page, fetch stored settings and update the UI with them. */
const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(updateUI, onError);

/* On clicking the save button, save the currently selected settings. */
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
