export interface StorageProvider {
  name: string;
  icon: string;
  url: string;
  selected: boolean;
  stripProtocol: boolean;
  doNotEncodeUrl: boolean;
}

export interface Options {
  storageProviders: StorageProvider[];
  openInBackground: boolean;
  openTabAt: 'right' | 'left' | 'end';
  showOpenAll: boolean;
  showOpenAllAtTop: boolean;
  searchAllByDefault: boolean;
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/253f25de35d325a06452802734470c9a3f30e99d/types/firefox-webext-browser/index.d.ts#L7171 not supported by Chrome
interface CreatePropertiesWithIcon
  extends chrome.contextMenus.CreateProperties {
  icons?: { [key: number]: string | undefined };
}
