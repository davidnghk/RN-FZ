import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './translations/en';
import zhHK from './translations/zh-HK';
import zhCN from './translations/zh-CN';

const LANGUAGES = {
  en,
  zhHK,
  zhCN
};

const LANG_CODES = Object.keys(LANGUAGES);


const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,

  //@ts-ignore
  detect: callback => {
    AsyncStorage.getItem('user-language', (err, language) => {
      // if error fetching stored data or no language was stored
      // display errors when in DEV mode as console statements
      if (err || !language) {
        if (err) {
          // console.log('Error fetching Languages from asyncstorage ', err);
        } else {
          // console.log('No language is set, choosing English as fallback');
        }
        const findBestAvailableLanguage =
          RNLocalize.findBestAvailableLanguage(LANG_CODES);

        if (findBestAvailableLanguage) {
          callback(findBestAvailableLanguage.languageTag);
        } else {
          callback('en');
        }
        return;
      }
      callback(language);
    });
  },

  init: () => { },

  cacheUserLanguage: language => {
    AsyncStorage.setItem('user-language', language);
  }
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    resources: LANGUAGES,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false
    }
  });