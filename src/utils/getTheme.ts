import {CombinedDarkTheme, CombinedDefaultTheme} from '@/styles';
import {Appearance} from 'react-native';

export const getTheme = () => {
  const mode = Appearance.getColorScheme();

  return mode === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
};
