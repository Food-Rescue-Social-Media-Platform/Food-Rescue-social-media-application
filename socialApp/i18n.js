import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';
import he from './locales/he/translation.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    const savedDataJSON = await AsyncStorage.getItem('user-language');
    const lng = savedDataJSON ? savedDataJSON : 'en';
    callback(lng);
  },
  init: () => {},
  cacheUserLanguage: (lng) => {
    AsyncStorage.setItem('user-language', lng);
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
        he: { translation: he },
      },
      fallbackLng: 'en',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
