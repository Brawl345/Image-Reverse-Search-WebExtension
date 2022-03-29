import defaultOptions from '../default-options.json';
import { getMessage } from '../utils.js';

const PARENT_ID = 'Image-Reverse-Search';
const OPEN_ALL_ID = 'openAll';

export const setupContextMenu = ({
  storageProviders,
  showOpenAll,
  showOpenAllAtTop,
  searchAllByDefault,
}) => {
  const selectedProviders = storageProviders.filter((p) => p.selected);

  /* If there is only one search provider, do not create a submenu */
  if (selectedProviders.length === 1 || searchAllByDefault) {
    chrome.contextMenus.create({
      id: searchAllByDefault ? OPEN_ALL_ID : selectedProviders[0].name,
      title: getMessage('contextMenuTitle'),
      contexts: ['image'],
    });
    return;
  }

  const separator = {
    parentId: PARENT_ID,
    id: 'image-reverse-search-separator',
    type: 'separator',
  };

  const openAllEntry = {
    parentId: PARENT_ID,
    id: OPEN_ALL_ID,
    title: getMessage('contextMenuOpenAll'),
    contexts: ['image'],
  };

  /* Create menu and submenu entries */
  chrome.contextMenus.create({
    id: PARENT_ID,
    title: getMessage('contextMenuTitle'),
    contexts: ['image'],
  });

  if (showOpenAll && showOpenAllAtTop) {
    chrome.contextMenus.create(openAllEntry);
    chrome.contextMenus.create(separator);
  }

  for (const provider of selectedProviders) {
    const contextMenuOptions = {
      parentId: PARENT_ID,
      id: provider.name,
      icons: {
        64: provider.icon,
      },
      title: provider.name,
      contexts: ['image'],
    };
    try {
      chrome.contextMenus.create(contextMenuOptions);
    } catch {
      // when the browser doesn't support icons for submenus
      delete contextMenuOptions.icons;
      chrome.contextMenus.create(contextMenuOptions);
    }
  }

  if (showOpenAll && !showOpenAllAtTop) {
    chrome.contextMenus.create(separator);
    chrome.contextMenus.create(openAllEntry);
  }
};

export const onReverseSearch = async ({ srcUrl, menuItemId }, tab) => {
  const options = await chrome.storage.sync.get(defaultOptions);

  const providerUrls = [];

  if (menuItemId === 'openAll') {
    for (const provider of options.storageProviders) {
      if (provider.selected) {
        providerUrls.push(provider.url);
      }
    }
    /* Reverse because we open them by tab index */
    providerUrls.reverse();
  } else {
    for (const providerId of options.storageProviders) {
      if (providerId.name === menuItemId) {
        providerUrls.push(providerId.url);
      }
    }
  }

  let newTabIndex;

  if (options.openTabAt === 'right') {
    newTabIndex = tab.index + 1;
  } else if (options.openTabAt === 'left') {
    newTabIndex = tab.index;
  } else {
    /* end */
    newTabIndex = await chrome.tabs
      .query({ currentWindow: true })
      .then((tabs) => tabs.length)
      .catch(() => tab.index);
  }

  for (const providerUrl of providerUrls) {
    chrome.tabs.create({
      url: providerUrl.replace('%s', encodeURIComponent(srcUrl)),
      active: !options.openInBackground,
      index: newTabIndex,
      openerTabId: tab.id,
    });
  }
};
