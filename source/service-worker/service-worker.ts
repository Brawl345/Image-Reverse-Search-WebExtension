import { onReverseSearch, setupContextMenu } from './service-worker-functions';

chrome.runtime.onStartup.addListener(setupContextMenu);
chrome.runtime.onInstalled.addListener(async (details) => {
  await setupContextMenu();

  if (details.reason === 'install') {
    await chrome.runtime.openOptionsPage();
  }
});
chrome.storage.sync.onChanged.addListener(setupContextMenu);

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.contextMenus.onClicked.addListener(onReverseSearch);
