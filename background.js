// Set up context menu
var title = browser.i18n.getMessage("contextMenuTitle");
browser.contextMenus.create({
  id: "search-with-google-andreas-add-on",
  title: title,
  contexts: ["image"]
});

// Add listener for images
browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "search-with-google-andreas-add-on") {
    browser.tabs.create({
        url:'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(info.srcUrl)
    });
  }
});