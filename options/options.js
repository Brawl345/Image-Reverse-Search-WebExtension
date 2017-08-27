/* Localization */
document.title = chrome.i18n.getMessage("extensionName") + " | " + chrome.i18n.getMessage("optionsPageTitle");
document.getElementById("navbarTitle").textContent = chrome.i18n.getMessage("extensionName");
document.getElementById("openTabAtLabel").textContent = chrome.i18n.getMessage("openTabAtLabel");
document.getElementById("right").textContent = chrome.i18n.getMessage("openAtRight");
document.getElementById("left").textContent = chrome.i18n.getMessage("openAtLeft");
document.getElementById("end").textContent = chrome.i18n.getMessage("openAtEnd");
document.getElementById("openInBackgroundLabel").textContent = chrome.i18n.getMessage("openInBackground");
document.getElementById("searchProviderLabel").textContent = chrome.i18n.getMessage("searchProviderLabel");
document.getElementById("otherCSE").textContent = chrome.i18n.getMessage("customSearchProviderLabel");
document.getElementById("customSearchProviderLabel").textContent = chrome.i18n.getMessage("customSearchProviderLabel");
document.getElementById("searchProvidersError").textContent = chrome.i18n.getMessage("searchProvidersError");
document.getElementById("customSearchProvider").placeholder = chrome.i18n.getMessage("customSearchProviderPlaceholder");
document.getElementById("cseError").textContent = chrome.i18n.getMessage("cseError");
document.getElementById("save-button").textContent = chrome.i18n.getMessage("saveOptions");

/* Store the currently selected settings using chrome.storage.sync. */
function storeSettings() {
    
  function getOpenTabAt() {
    const openTabAt = document.querySelector("#openTabAt");
    return openTabAt.value
  }
  
  /* Returns an array with all checked search providers */
  function getSearchProviders() {
    const chosenSearchProviders = new Array()
    for (let searchProvider of allSearchProviders) { 
      if (document.getElementById(searchProvider).checked) {
          chosenSearchProviders.push(searchProvider)
      }
    }
    return chosenSearchProviders
  }
  
  /* Toggles the CSE form error warning */
  function toggleCSEform(tovalid) {
      const cseForm = document.getElementById("customSearchProvider");
      if (tovalid) {
        cseForm.classList.remove("form-control-danger");
        document.getElementById("customSearchProviderForm").classList.remove("has-danger");
        document.getElementById("cseError").classList.add("hidden");
      } else {
        cseForm.classList.add("form-control-danger");
        document.getElementById("customSearchProviderForm").classList.add("has-danger");
        document.getElementById("cseError").classList.remove("hidden");
      }
  }

  var searchProviders = getSearchProviders();

  // if no checkbox is selected
  const searchProvidersError = document.getElementById("searchProvidersError");
  if (searchProviders.length == 0) {
      searchProvidersError.classList.remove("hidden")
      const status = document.getElementById("status");
      status.classList.add("alert-danger");
      status.textContent = chrome.i18n.getMessage("error");
      status.style.display = "block";
      status.style.fontWeight = "bold";
      setTimeout(function() {
        status.style.display = "none";
        status.classList.remove("alert-danger");
      }, 1800);
      return
  }

  // If above error was shown to user before, hide it
  if (! searchProvidersError.classList.contains("hidden")) {
      searchProvidersError.classList.add("hidden")
  }
  
  /* Check if custom search provider is valid */
  if (searchProviders.includes("other")) {
      const cseForm = document.getElementById("customSearchProvider");
      if (cseForm.checkValidity() == false || cseForm.value == null || cseForm.value == "") {
          toggleCSEform(false);
      } else {
          toggleCSEform(true);
          if (cseForm.value.indexOf("%s") == "-1") { // no %s in URL!
              toggleCSEform(false);
          } else {
            var cseProvider = cseForm.value;
          }
      }
  }

  /* If custom search provider is not valid, but checked */
  if (typeof cseProvider == "undefined" && searchProviders.includes("other")) {
      const status = document.getElementById("status");
      status.classList.add("alert-danger");
      status.textContent = chrome.i18n.getMessage("error");
      status.style.display = "block";
      status.style.fontWeight = "bold";
      setTimeout(function() {
        status.style.display = "none";
        status.classList.remove("alert-danger");
      }, 1800);
      return
  } else if (typeof cseProvider == "undefined") {
      var cseProvider = "";
  }

  const openInBackground = document.getElementById("openInBackground").checked;
  const openTabAt = getOpenTabAt();

  /* Create contextMenu */
  chrome.contextMenus.removeAll();
  backgroundPage.createContextMenu({searchProviders}); // Pass searchProviders as object

  chrome.storage.sync.set({
    openInBackground,
    openTabAt,
    searchProviders,
    cseProvider
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    status.classList.add("alert-success");
    status.textContent = chrome.i18n.getMessage("saved");
    status.style.display = "block";
    status.style.fontWeight = "bold";
    setTimeout(function() {
      status.style.display = "none";
      status.classList.remove("alert-success");
    }, 1800);
  });
}

/* Update the options UI with the settings values retrieved from storage,
   or the default settings if the stored settings are empty. */
function updateUI(restoredSettings) {
  document.getElementById("openInBackground").checked = restoredSettings.openInBackground;

  const tabAtSelectList = document.querySelector("#openTabAt");
  tabAtSelectList.value = restoredSettings.openTabAt;
  
  for (let searchProvider of allSearchProviders) { 
    if (restoredSettings.searchProviders.includes(searchProvider)) {
      document.getElementById(searchProvider).checked = true;
    }
  }

  if (otherCSECheckbox.checked) {
    document.getElementById("customSearchProviderForm").classList.remove("hidden");
    const cseProviderInput = document.querySelector("#customSearchProvider")
    cseProviderInput.value = restoredSettings.cseProvider;
  }
}

function showOtherField(name) {
  if (name.target.checked) {
    document.getElementById("customSearchProviderForm").classList.remove("hidden");
  } else {
    document.getElementById("customSearchProviderForm").classList.add("hidden");
  }
}

/* We need those here */
const backgroundPage = chrome.extension.getBackgroundPage();
const allSearchProviders = ["google", "bing", "yandex", "yandexru", "baidu", "tineye", "saucenao", "iqdb", "other"];

/* On checking "other", show the text field */
const otherCSECheckbox = document.getElementById("other");
otherCSECheckbox.addEventListener("change", showOtherField)

/* On opening the options page, fetch stored settings and update the UI with them. */
chrome.storage.sync.get(null, updateUI);

/* On clicking the save button, save the currently selected settings. */
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
