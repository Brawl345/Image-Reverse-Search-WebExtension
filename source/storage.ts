import type { Options, StorageProvider } from './types';

export const newProvider: StorageProvider = {
  name: '',
  icon: 'icons/other.png',
  url: '',
  selected: true,
  doNotEncodeUrl: false,
  stripProtocol: false,
};

export const defaultOptions: Options = Object.freeze({
  openInBackground: false,
  openTabAt: 'right',
  showOpenAll: true,
  showOpenAllAtTop: false,
  searchAllByDefault: false,
  storageProviders: [
    {
      name: 'Google Lens',
      icon: 'icons/google.png',
      url: 'https://lens.google.com/uploadbyurl?url=%s',
      selected: true,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'Google',
      icon: 'icons/google.png',
      url: 'https://www.google.com/searchbyimage?sbisrc=google&image_url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'IQDB',
      icon: 'icons/iqdb.png',
      url: 'https://iqdb.org/?url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'TinEye',
      icon: 'icons/tineye.png',
      url: 'https://www.tineye.com/search?url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'Bing',
      icon: 'icons/bing.png',
      url: 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'Yandex',
      icon: 'icons/yandex.png',
      url: 'https://yandex.com/images/search?url=%s&rpt=imageview',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'Яндекс',
      icon: 'icons/yandexru.png',
      url: 'https://yandex.ru/images/search?url=%s&rpt=imageview',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'Baidu',
      icon: 'icons/baidu.png',
      url: 'https://image.baidu.com/n/pc_search?queryImageUrl=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
    {
      name: 'SauceNAO',
      icon: 'icons/saucenao.png',
      url: 'https://saucenao.com/search.php?db=999&url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
    },
  ],
});

export const getOptions: () => Promise<Options> = async () =>
  chrome.storage.sync.get(defaultOptions) as Promise<Options>;
