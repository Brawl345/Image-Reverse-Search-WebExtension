import { getOptions } from '../storage';
import type { CreatePropertiesWithIcon, Options } from '../types';
import { getMessage, isNullish } from '../utils';

const PARENT_ID = 'Image-Reverse-Search';
const OPEN_ALL_ID = 'openAll';

export const setupContextMenu = async () => {
  const {
    storageProviders,
    showOpenAll,
    showOpenAllAtTop,
    searchAllByDefault,
  } = await getOptions();

  chrome.contextMenus.removeAll();
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

  const separator: chrome.contextMenus.CreateProperties = {
    parentId: PARENT_ID,
    id: 'image-reverse-search-separator',
    type: 'separator',
  };

  const openAllEntry: chrome.contextMenus.CreateProperties = {
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
    const contextMenuOptions: CreatePropertiesWithIcon = {
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
      // biome-ignore lint/performance/noDelete: is safe here
      delete contextMenuOptions.icons;
      chrome.contextMenus.create(contextMenuOptions);
    }
  }

  if (showOpenAll && !showOpenAllAtTop) {
    chrome.contextMenus.create(separator);
    chrome.contextMenus.create(openAllEntry);
  }
};

export const onReverseSearch: (
  { srcUrl, menuItemId }: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab | undefined,
) => Promise<void> = async ({ srcUrl, menuItemId }, tab) => {
  if (isNullish(srcUrl) || isNullish(tab)) {
    return;
  }

  const options = await getOptions();

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

  let newTabIndex: number;

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
    void chrome.tabs.create({
      url: providerUrl.replace('%s', encodeURIComponent(srcUrl)),
      active: !options.openInBackground,
      index: newTabIndex,
      openerTabId: tab.id,
    });
  }
};
