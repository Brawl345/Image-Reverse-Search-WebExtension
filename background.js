// Set up context menu for images
var title = chrome.i18n.getMessage("contextMenuTitle");
chrome.contextMenus.create({
  id: "search-with-google-andreas-add-on",
  title: title,
  contexts: ["image"]
});

function getOption(info, tab) {
  chrome.storage.local.get('open_in_bg', function(data) {
    if (data.open_in_bg) {
      open_in_foreground = !data.open_in_bg;
    } else {
      open_in_foreground = true;
    }
    openNewTab(info.srcUrl, open_in_foreground);
  });
}

function openNewTab(pic_url, open_in_foreground) {
    // open image search in fore- or background next to current tab
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.create({
            url: 'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(pic_url),
            active: open_in_foreground,
            index: tabs[0].index + 1
        });
    });
}

// Add listener
chrome.contextMenus.onClicked.addListener(getOption);