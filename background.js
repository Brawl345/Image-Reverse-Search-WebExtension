var Provider = class Provider {
	constructor(name = '', icon = '../icons/other.png', url = '', selected = false) {
		this.name = name;
		this.icon = icon;
		this.url = url;
		this.selected = selected;
	}
	clone() {
		return new Provider(this.name, this.icon, this.url, this.selected);
	}
};

const defaultProviders = [
	new Provider('Google', '../icons/google.png', 'https://www.google.com/searchbyimage?image_url=%s', true),
	new Provider('IQDB', '../icons/iqdb.png', 'https://iqdb.org/?url=%s'),
	new Provider('TinEye', '../icons/tineye.png', 'https://www.tineye.com/search?url=%s'),
	new Provider('Bing', '../icons/bing.png', 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s'),
	new Provider('Yandex', '../icons/yandex.png', 'https://yandex.com/images/search?url=%s&rpt=imageview'),
	new Provider('Яндекс', '../icons/yandexru.png', 'https://yandex.ru/images/search?url=%s&rpt=imageview'),
	new Provider('Baidu', '../icons/baidu.png', 'https://image.baidu.com/n/pc_search?queryImageUrl=%s'),
	new Provider('SauceNAO', '../icons/saucenao.png', 'https://saucenao.com/search.php?db=999&url=%s'),
];

function getDefaultProvidersClone() {
	return defaultProviders.map(p => p.clone());
}

// Set up context menu for images
function createContextMenu(storageProviders) {
	const title = chrome.i18n.getMessage('contextMenuTitle');

	console.log(storageProviders);
    const selectedProviders = storageProviders.storageProviders.filter(p => p.selected);

	/* If there is only one search provider, do not create a submenu */
	if (selectedProviders.length === 1) {
		chrome.contextMenus.create({
			id: selectedProviders[0].name,
			title,
			contexts: ['image'],
		});
		return;
	}

	/* Create menu and submenu entries */
	chrome.contextMenus.create({
		id: 'Image-Reverse-Search',
		title,
		contexts: ['image'],
	});

	for (const p of selectedProviders) {
		const contextMenuOptions = {
			parentId: 'Image-Reverse-Search',
			id: p.name,
			icons: {
				64: p.icon,
			},
			title: p.name,
			contexts: ['image'],
		};
		try {
			chrome.contextMenus.create(contextMenuOptions);
		} catch (exception) {
			// when the browser doesn't support icons for submenus
			delete contextMenuOptions.icons;
			chrome.contextMenus.create(contextMenuOptions);
		}
	}
}

/* Default settings. If there is nothing in storage, use these values. */
const defaultSettings = {
	openInBackground: false,
	openTabAt: 'right',
	storageProviders: getDefaultProvidersClone(),
};

/**
 * storage: {
 * 	openInBackground: bool,
 * 	openTabAt: 'left' | 'right' | 'end',
 *  storageProviders: Provider[]
 * }
 */

/* On startup, check whether we have stored settings and set up the context menu.
  If we don't, then store the default settings. */
function checkStoredSettings(storedSettings) {
	if (Object.getOwnPropertyNames(storedSettings).length) {
		chrome.storage.sync.get('storageProviders', createContextMenu);
	} else {
		chrome.storage.sync.set(defaultSettings);
		createContextMenu(defaultSettings.storageProviders);
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

	function getProviderURL(targetProviderName) {
		for (const p of storedSettings.storageProviders) {
			if (p.name === targetProviderName) {
				return p.url;
			}
		}
	}

	const imageURL = info.srcUrl;
	const openInBackground = storedSettings.openInBackground;
	const openTabAt = storedSettings.openTabAt;
	const searchProvider = getProviderURL(info.menuItemId);

	function openImageSearch(tabs) {
		tabIndex = getTabIndex(openTabAt, tabs);
		chrome.tabs.create({
			url: searchProvider.replace('%s', encodeURIComponent(imageURL)),
			active: !openInBackground,
			index: tabIndex,
		});
	}

	chrome.tabs.query(
		{
			currentWindow: true,
			active: true,
		},
		openImageSearch,
	);
}

/* Setup context menu */
chrome.storage.sync.get(null, checkStoredSettings);

/* On click, fetch stored settings and reverse search. */
chrome.contextMenus.onClicked.addListener((info, tab) => {
	chrome.storage.sync.get(null, reverseSearch.bind(null, info));
});
