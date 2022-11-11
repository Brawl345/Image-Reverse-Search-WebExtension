import defaultOptions from '../default-options.json';
import {
  migrate,
  onReverseSearch,
  setupContextMenu,
} from './service-worker-functions.js';

chrome.runtime.onInstalled.addListener(() =>
  chrome.storage.sync.get(defaultOptions).then(migrate).then(setupContextMenu)
);

chrome.contextMenus.onClicked.addListener(onReverseSearch);
chrome.storage.sync.onChanged.addListener(async () => {
  // easier to just teardown everything and re-setup
  await chrome.contextMenus.removeAll();
  chrome.storage.sync.get(defaultOptions).then(setupContextMenu);
});
