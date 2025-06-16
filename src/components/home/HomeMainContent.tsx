import {useAppSelector} from '@/hooks';
import {selectUser} from '@/store';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {AppButton} from '../common/AppButton';
import {AppText} from '../common/AppText';
import {AutoHeightBottomSheet} from '../common/AutoHeightBottomSheet';

type HomeMainContentProps = {
  openSettings: () => void;
};

export const HomeMainContent = forwardRef<BottomSheet, HomeMainContentProps>(
  ({openSettings}, ref) => {
    const {colors} = useTheme();
    const {t} = useTranslation();
    const {user} = useAppSelector(selectUser);

    return (
      <AutoHeightBottomSheet
        ref={ref}
        enablePanDownToClose={false}
        handleIndicatorStyle={{backgroundColor: colors.background}}>
        <BottomSheetView style={styles.conainer}>
          <AppText variant="headlineSmall" fontWeight="bold">
            {t('text.hi')}, {user.displayName}
          </AppText>
          <AppText mb={20} variant="bodyLarge">
            {t('titles.chooseTraining')}
          </AppText>
          <AppButton mb={10}>{t('buttons.routes')}</AppButton>
          <AppButton onPress={openSettings} mode="outlined" mb={20}>
            {t('buttons.settings')}
          </AppButton>
        </BottomSheetView>
      </AutoHeightBottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  conainer: {
    paddingHorizontal: 20,
  },
});
