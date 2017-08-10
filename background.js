// Set up context menu for images
function createContextMenu(options) {
  const title = chrome.i18n.getMessage("contextMenuTitle");

  /* If there is only one search provider, do not create a submenu */
  if (options.searchProviders.length == 1) {
    chrome.contextMenus.create({
      id: options.searchProviders[0],
      title: title,
      contexts: ["image"]
    });
    return
  }
  
  /* Create menu and submenu entries */
  chrome.contextMenus.create({
    id: "Image-Reverse-Search",
    title: title,
    contexts: ["image"]
  });
  for (i = 0; i < options.searchProviders.length; i++) {
    var contextMenuOptions = {
      parentId: "Image-Reverse-Search",
      id: options.searchProviders[i],
      icons: {
        64: "icons/" + options.searchProviders[i] + ".png"
      },
      title: searchProviderNames[options.searchProviders[i]],
      contexts: ["image"]
    }
    try {
        chrome.contextMenus.create(contextMenuOptions);
    } catch(exception) { // when the browser doesn't support icons for submenus
        delete contextMenuOptions.icons
        chrome.contextMenus.create(contextMenuOptions);
    }
  }
}

/* Default settings. If there is nothing in storage, use these values. */
var defaultSettings = {
  openInBackground: false,
  openTabAt: "right",
  searchProviders: ["google"]
}

/* On startup, check whether we have stored settings and set up the context menu.
  If we don't, then store the default settings. */
function checkStoredSettings(storedSettings) {
  if (storedSettings.openInBackground == null || !storedSettings.openTabAt || !storedSettings.searchProviders) {
    chrome.storage.sync.set(defaultSettings);
    createContextMenu(defaultSettings);
  } else {
    chrome.storage.sync.get("searchProviders", createContextMenu);
  }
}

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
  
  function getSearchProviderURL(searchProviderName) {
    if (searchProviderName == 'google') {
      return 'https://www.google.com/searchbyimage?image_url=%s';
    } else if (searchProviderName == 'bing') {
      return 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s';
    } else if (searchProviderName == 'yandex') {
      return 'https://yandex.com/images/search?url=%s&rpt=imageview';
    } else if (searchProviderName == 'yandexru') {
      return 'https://yandex.ru/images/search?url=%s&rpt=imageview';
    } else if (searchProviderName == 'tineye') {
      return 'https://www.tineye.com/parse?url=%s';
    } else if (searchProviderName == 'baidu') {
      return 'https://image.baidu.com/n/pc_search?queryImageUrl=%s'
    } else if (searchProviderName == 'saucenao') {
      return 'https://saucenao.com/search.php?db=999&url=%s'
    } else if (searchProviderName == 'iqdb') {
      return 'https://iqdb.org/?url=%s'
    } else if (searchProviderName == 'other') {
      return storedSettings.cseProvider;
    }
  }
  
  const imageURL = info.srcUrl;
  const openInBackground = storedSettings.openInBackground;
  const openTabAt = storedSettings.openTabAt;
  const searchProvider = getSearchProviderURL(info.menuItemId);
  
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

/* Load search engine names and settings and set up context menu */
const searchProviderNames = {
  google: "Google",
  bing: "Bing",
  yandex: "Yandex",
  yandexru: "Яндекс",
  baidu: "Baidu",
  tineye: "TinEye",
  saucenao: "SauceNAO",
  iqdb: "IQDB",
  other: chrome.i18n.getMessage("customSearchProviderLabel")
};
chrome.storage.sync.get(null, checkStoredSettings);

/* On click, fetch stored settings and reverse search. */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.sync.get(null, reverseSearch.bind(null, info));
});