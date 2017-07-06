/* Localization */
document.title = browser.i18n.getMessage("extensionName") + " | " + browser.i18n.getMessage("optionsPageTitle");
document.getElementById("navbarTitle").textContent = browser.i18n.getMessage("extensionName");
document.getElementById("openTabAtLabel").textContent = browser.i18n.getMessage("openTabAtLabel");
document.getElementById("right").textContent = browser.i18n.getMessage("openAtRight");
document.getElementById("left").textContent = browser.i18n.getMessage("openAtLeft");
document.getElementById("end").textContent = browser.i18n.getMessage("openAtEnd");
document.getElementById("openInBackgroundLabel").textContent = browser.i18n.getMessage("openInBackground");
document.getElementById("searchProviderLabel").textContent = browser.i18n.getMessage("searchProviderLabel");
document.getElementById("otherCSE").textContent = browser.i18n.getMessage("other");
document.getElementById("customSearchProviderLabel").textContent = browser.i18n.getMessage("customSearchProviderLabel");
document.getElementById("customSearchProvider").placeholder = browser.i18n.getMessage("customSearchProviderPlaceholder");
document.getElementById("cseError").textContent = browser.i18n.getMessage("cseError");
document.getElementById("save-button").textContent = browser.i18n.getMessage("saveOptions");
document.getElementById("status").textContent = browser.i18n.getMessage("saved");

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

  var searchProvider = getSearchProvider();
  /* Check if custom search provider is valid */
  if (searchProvider == "other") {
      const cseForm = document.getElementById("customSearchProvider");
      if (cseForm.checkValidity() == false || cseForm.value == null || cseForm.value == "") {
          toggleCSEform(false);
      } else {
          toggleCSEform(true);
          if (cseForm.value.indexOf("%s") == "-1") {
              toggleCSEform(false);
          }
          var cseProvider = cseForm.value;
      }
  }

  if (typeof cseProvider == "undefined" && searchProvider == "other") {
      var cseProvider = "";
      var searchProvider = "google"; /* set default value if cseProvider text field is empty/invalid  */
  } else if (typeof cseProvider == "undefined") {
      var cseProvider = "";
  }
  const openInBackground = document.getElementById("openInBackground").checked;
  const openTabAt = getOpenTabAt();

  browser.storage.sync.set({
    openInBackground,
    openTabAt,
    searchProvider,
    cseProvider
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.style.display = "block";
    status.style.fontWeight = "bold";
    setTimeout(function() {
      status.style.display = "none";
    }, 1800);
  });
}

/* Update the options UI with the settings values retrieved from storage,
or the default settings if the stored settings are empty. */
function updateUI(restoredSettings) {
  document.getElementById("openInBackground").checked = restoredSettings.openInBackground;

  const tabAtSelectList = document.querySelector("#openTabAt");
  tabAtSelectList.value = restoredSettings.openTabAt;
  
  const searchProviderSelectList = document.querySelector("#searchProvider");
  searchProviderSelectList.value = restoredSettings.searchProvider;
  if (searchProviderSelectList.value == "other" ) {
    document.getElementById("customSearchProviderForm").classList.remove("hidden");
    const cseProviderInput = document.querySelector("#customSearchProvider")
    cseProviderInput.value = restoredSettings.cseProvider;
  }
}

function onError(e) {
  console.error(e);
}

function showOtherField(name) {
  if (name.target.value == "other") {
    document.getElementById("customSearchProviderForm").classList.remove("hidden");
  } else {
    document.getElementById("customSearchProviderForm").classList.add("hidden");
  }
}

/* On opening the options page, fetch stored settings and update the UI with them. */
const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(updateUI, onError);

/* On changing the searchProvider to "other", show the text field */
const searchProviderSelect = document.querySelector("#searchProvider");
searchProviderSelect.addEventListener("change", showOtherField)

/* On clicking the save button, save the currently selected settings. */
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
