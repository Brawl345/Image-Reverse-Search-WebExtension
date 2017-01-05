// Set up context menu for images
var title = chrome.i18n.getMessage("contextMenuTitle");
chrome.contextMenus.create({
    id: "search-with-google-andreas-add-on",
    title: title,
    contexts: ["image"]
});

// main function
function searchImageWithGoogle(info, tab) {
    // get option
    chrome.storage.local.get('open_in_bg', function(r) {
        if (typeof r.open_in_bg != 'undefined') {
            open_in_foreground = !r.open_in_bg;
        } else {
            open_in_foreground = true;
        }
	
        // open image search in fore- or background
        chrome.tabs.create({
            url:'https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(info.srcUrl),
            active: open_in_foreground
        });
    });
}

// Add listener
chrome.contextMenus.onClicked.addListener(searchImageWithGoogle);

