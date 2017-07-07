// Set up context menu for images
var title = browser.i18n.getMessage("contextMenuTitle");
browser.contextMenus.create({
  id: "343642_image-reverse-search",
  title: title,
  contexts: ["image"]
});

/* Default settings. If there is nothing in storage, use these values. */
var defaultSettings = {
  openInBackground: false,
  openTabAt: "right",
  searchProvider: "google"
}

/* Generic error logger. */
function onError(e) {
  console.error(e);
}

/* On startup, check whether we have stored settings.
If we don't, then store the default settings. */
function checkStoredSettings(storedSettings) {
  if (!storedSettings.openInBackground || !storedSettings.openTabAt || !storedSettings.searchProvider) {
    browser.storage.sync.set(defaultSettings);
  }
}

const gettingStoredSettings = browser.storage.sync.get();
gettingStoredSettings.then(checkStoredSettings, onError);

function reverseSearch(info, storedSettings) {
  
  function getTabIndex(openTabAt, tabs) {
    if (openTabAt == 'right') {
      return tabs[0].index + 1;
    } else if (openTabAt == 'left') {
      return tabs[0].index;
    } else if (openTabAt == 'end') {
      return null;
    }
  }
  
  function getSearchProvider(searchProvider) {
    if (searchProvider == 'google') {
      return 'https://www.google.com/searchbyimage?image_url=%s';
    } else if (searchProvider == 'bing') {
      return 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s';
    } else if (searchProvider == 'yandex') {
      return 'https://yandex.com/images/search?url=%s&rpt=imageview';
    } else if (searchProvider == 'tineye') {
      return 'https://www.tineye.com/parse?url=%s';
    } else if (searchProvider == 'other') {
      return storedSettings.cseProvider;
    }
  }
  
  const imageURL = info.srcUrl;
  const openInBackground = storedSettings.openInBackground;
  const openTabAt = storedSettings.openTabAt;
  const searchProvider = getSearchProvider(storedSettings.searchProvider);
  
  function openImageSearch(tabs) {
    tabIndex = getTabIndex(openTabAt, tabs);
    browser.tabs.create({
      url: searchProvider.replace('%s', encodeURIComponent(imageURL)),
      active: !openInBackground,
      index: tabIndex
    });
  }
  
  var querying = browser.tabs.query({currentWindow: true, active: true});
  querying.then(openImageSearch, onError);
}

/* On click, fetch stored settings and reverse search. */
browser.contextMenus.onClicked.addListener((info, tab) => {
  const gettingStoredSettings = browser.storage.sync.get();
  gettingStoredSettings.then(reverseSearch.bind(null, info), onError);
});