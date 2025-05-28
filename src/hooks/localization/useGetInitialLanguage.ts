import AsyncStorage from '@react-native-async-storage/async-storage';
import {changeLanguage} from 'i18next';
import {useEffect} from 'react';
import * as RNLocalize from 'react-native-localize';

export const useGetInitialLanguage = () => {
  const getLanguage = async () => {
    const language = await RNLocalize.getLocales()[0].languageCode;
    const savedLanguage = await AsyncStorage.getItem('language');
    changeLanguage(savedLanguage ?? language);
  };

  useEffect(() => {
    getLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RNLocalize.getLocales()[0].languageCode]);
};
