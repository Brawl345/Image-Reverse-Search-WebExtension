# Reverse Image Search

WebExtension which adds an option to the context menu to search with an image on various services, such as Google, Bing, Yandex, TinEye, SauceNAO and IQDB. The user can also add custom search engines. Has options to open the search page in a background tab and left or right to the current tab or at the end of the tabstrip, too.

## Installation

- Available for Firefox on [addons.mozilla.org](https://addons.mozilla.org/firefox/addon/image-reverse-search/)
- Available for Chrome and Edge in the [Chrome Web Store](https://chrome.google.com/webstore/detail/reverse-image-search/cdgbjhkjjghbjjikgjkkpljlmnpcakco)
- Available for Opera in the [Opera Add-Ons Store](https://addons.opera.com/extensions/details/image-reverse-search/)
- Available for other Chromium-based browsers in the [Releases section](https://github.com/Brawl345/Image-Reverse-Search-with-Google/releases) (drag CRX into chrome://extensions, only for browser which do not enforce signing)

## Features

- Add multiple custom search providers with your own URL
- Name them and upload a custom icon
- Show multiple search providers in a submenu
- Open search page left, right or at the end
- Open search page in background or foreground

## Development

1. `git clone ...`
2. `npm ci`
3. `npm run dev`
4. `npm run start:chrome` or `npm run start:firefox`

## Screenshots

![Screenshot](screenshot.png?raw=true "Screenshot")

![Options](options.png?raw=true "Options")
