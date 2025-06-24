import {TFunction} from 'i18next';

type TType = TFunction<'translation', undefined>;

export const getRouteDifficulty = (t: TType) => [
  {title: t('text.easy'), value: 'easy'},
  {title: t('text.medium'), value: 'medium'},
  {title: t('text.hard'), value: 'hard'},
];

export const getRouteSurface = (t: TType) => [
  {title: t('text.any'), value: 'any'},
  {title: t('text.asphalt'), value: 'asphalt'},
  {title: t('text.dirt'), value: 'dirt'},
];
