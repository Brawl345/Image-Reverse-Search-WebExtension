// Set up context menu for images
var title = chrome.i18n.getMessage("contextMenuTitle");
chrome.contextMenus.create({
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
    chrome.storage.sync.set(defaultSettings);
  }
}

const gettingStoredSettings = chrome.storage.sync.get(null, checkStoredSettings);

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
    } else if (searchProvider == 'yandexru') {
      return 'https://yandex.ru/images/search?url=%s&rpt=imageview';
    } else if (searchProvider == 'tineye') {
      return 'https://www.tineye.com/parse?url=%s';
    } else if (searchProvider == 'baidu') {
      return 'https://image.baidu.com/n/pc_search?queryImageUrl=%s'
    } else if (searchProvider == 'saucenao') {
      return 'https://saucenao.com/search.php?db=999&url=%s'
    } else if (searchProvider == 'iqdb') {
      return 'https://iqdb.org/?url=%s'
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
    chrome.tabs.create({
      url: searchProvider.replace('%s', encodeURIComponent(imageURL)),
      active: !openInBackground,
      index: tabIndex
    });
  }
  
  chrome.tabs.query({currentWindow: true, active: true}, openImageSearch);
}

/* On click, fetch stored settings and reverse search. */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.sync.get(null, reverseSearch.bind(null, info));
});