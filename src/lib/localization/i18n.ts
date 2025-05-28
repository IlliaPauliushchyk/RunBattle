import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import be from './languages/be.json';
import en from './languages/en.json';
import ru from './languages/ru.json';

i18n.use(initReactI18next).init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    be,
    en,
    ru,
  },
  interpolation: {
    escapeValue: false,
  },
});

// eslint-disable-next-line no-restricted-syntax
export default i18n;
