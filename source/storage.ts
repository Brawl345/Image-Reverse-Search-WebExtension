import type { Options, StorageProvider } from './types';

export const newProvider: StorageProvider = {
  name: '',
  icon: 'icons/other.png',
  url: '',
  selected: true,
  doNotEncodeUrl: false,
  stripProtocol: false,
  method: 'GET' as const,
  postFieldName: 'url',
  contentType: 'application/x-www-form-urlencoded',
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
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'Google',
      icon: 'icons/google.png',
      url: 'https://www.google.com/searchbyimage?sbisrc=google&image_url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'IQDB',
      icon: 'icons/iqdb.png',
      url: 'https://iqdb.org/?url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'TinEye',
      icon: 'icons/tineye.png',
      url: 'https://www.tineye.com/search?url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'Bing',
      icon: 'icons/bing.png',
      url: 'https://www.bing.com/images/searchbyimage?FORM=IRSBIQ&cbir=sbi&imgurl=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'Yandex',
      icon: 'icons/yandex.png',
      url: 'https://yandex.com/images/search?url=%s&rpt=imageview',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'Яндекс',
      icon: 'icons/yandexru.png',
      url: 'https://yandex.ru/images/search?url=%s&rpt=imageview',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'SauceNAO',
      icon: 'icons/saucenao.png',
      url: 'https://saucenao.com/search.php?db=999&url=%s',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'GET' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
    {
      name: 'IQDB (POST)',
      icon: 'icons/iqdb.png',
      url: 'https://iqdb.org/',
      selected: false,
      doNotEncodeUrl: false,
      stripProtocol: false,
      method: 'POST' as const,
      postFieldName: 'url',
      contentType: 'application/x-www-form-urlencoded',
    },
  ],
});

export const getOptions: () => Promise<Options> = async () => {
  const options = await chrome.storage.sync.get(defaultOptions) as Options;

  // Ensure backward compatibility by adding default values for new properties
  options.storageProviders = options.storageProviders.map(provider => ({
    ...provider,
    method: provider.method ?? 'GET',
    postFieldName: provider.postFieldName ?? 'url',
    contentType: provider.contentType ?? 'application/x-www-form-urlencoded',
  }));

  return options;
};
