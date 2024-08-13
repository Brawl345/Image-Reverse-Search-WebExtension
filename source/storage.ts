import type { Options } from './types';

export const defaultOptions: Options = Object.freeze({
  openInBackground: false,
  openTabAt: 'right',
  showOpenAll: true,
  showOpenAllAtTop: false,
  searchAllByDefault: false,
  storageProviders: [
    {
      name: 'Google',
      icon: 'icons/google.png',
      url: 'https://lens.google.com/uploadbyurl?url=%s',
      selected: true,
    },
    {
      name: 'IQDB',
      icon: 'icons/iqdb.png',
      url: 'https://iqdb.org/?url=%s',
      selected: false,
    },
    {
      name: 'TinEye',
      icon: 'icons/tineye.png',
      url: 'https://www.tineye.com/search?url=%s',
      selected: false,
    },
    {
      name: 'Bing',
      icon: 'icons/bing.png',
      url: 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s',
      selected: false,
    },
    {
      name: 'Yandex',
      icon: 'icons/yandex.png',
      url: 'https://yandex.com/images/search?url=%s&rpt=imageview',
      selected: false,
    },
    {
      name: 'Яндекс',
      icon: 'icons/yandexru.png',
      url: 'https://yandex.ru/images/search?url=%s&rpt=imageview',
      selected: false,
    },
    {
      name: 'Baidu',
      icon: 'icons/baidu.png',
      url: 'https://image.baidu.com/n/pc_search?queryImageUrl=%s',
      selected: false,
    },
    {
      name: 'SauceNAO',
      icon: 'icons/saucenao.png',
      url: 'https://saucenao.com/search.php?db=999&url=%s',
      selected: false,
    },
  ],
});

export const getOptions: () => Promise<Options> = async () =>
  chrome.storage.sync.get(defaultOptions) as Promise<Options>;
