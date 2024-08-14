import { getOptions } from '../storage';
import type { CreatePropertiesWithIcon } from '../types';
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

  const { openTabAt, openInBackground, storageProviders } = await getOptions();

  const activeProviders = storageProviders.filter((provider) =>
    menuItemId === OPEN_ALL_ID
      ? provider.selected
      : provider.name === menuItemId,
  );

  if (menuItemId === OPEN_ALL_ID) {
    // Reverse because we open them by tab index
    activeProviders.reverse();
  }

  const newTabIndex = await (async () => {
    switch (openTabAt) {
      case 'right':
        return tab.index + 1;
      case 'left':
        return tab.index;
      default:
        return chrome.tabs
          .query({ currentWindow: true })
          .then((tabs) => tabs.length)
          .catch(() => tab.index);
    }
  })();

  await Promise.all(
    activeProviders.map((provider) => {
      let imgSrcUrl = srcUrl;
      if (provider.stripProtocol) {
        imgSrcUrl = imgSrcUrl.replace(/^https?:\/\//, '');
      }

      let providerUrl = provider.url;
      if (!provider.doNotEncodeUrl) {
        providerUrl = providerUrl.replace('%s', encodeURIComponent(imgSrcUrl));
      } else {
        providerUrl = providerUrl.replace('%s', imgSrcUrl);
      }

      return chrome.tabs.create({
        url: providerUrl,
        active: !openInBackground,
        index: newTabIndex,
        openerTabId: tab.id,
      });
    }),
  );
};
