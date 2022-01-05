import i18n from './i18n.json';

// Service Workers can't use chrome.i18n.getMessage() so we have to do this workaround

let lang = navigator.language || navigator.userLanguage;
lang = lang.toLowerCase();
lang = i18n[lang] ? lang : lang.split('-')[0];
lang = i18n[lang] || i18n.en;

export const getMessageForServiceWorker = (key) => lang[key] || i18n.en[key];
