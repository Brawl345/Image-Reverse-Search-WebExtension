// replace the "browser.*" namespace with "chrome.*" for Chrome & Opera compatibility

// Set up context menu for images
var title = browser.i18n.getMessage("contextMenuTitle");
browser.contextMenus.create({
  id: "search-with-google-andreas-add-on",
  title: title,
  contexts: ["image"]
});

// Add listener
browser.contextMenus.onClicked.addListener(function(info, tab) {
    browser.tabs.create({
        url:'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(info.srcUrl)
    });
});