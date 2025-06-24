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
  generateRoutes: () => Promise<void>;
  closeMenu: () => void;
  loading: boolean;
};

export const HomeMainContent = forwardRef<BottomSheet, HomeMainContentProps>(
  ({openSettings, generateRoutes, closeMenu, loading}, ref) => {
    const {colors} = useTheme();
    const {t} = useTranslation();
    const {displayName} = useAppSelector(selectUser);

    const handleGenerateRoutes = async () => {
      generateRoutes().then(() => {
        closeMenu();
      });
    };
    return (
      <AutoHeightBottomSheet
        ref={ref}
        enablePanDownToClose={false}
        handleIndicatorStyle={{backgroundColor: colors.background}}>
        <BottomSheetView style={styles.conainer}>
          <AppText variant="headlineSmall" fontWeight="bold">
            {t('text.hi')}, {displayName}
          </AppText>
          <AppText mb={20} variant="bodyLarge">
            {t('titles.chooseTraining')}
          </AppText>
          <AppButton
            loading={loading}
            disabled={loading}
            onPress={handleGenerateRoutes}
            mb={10}>
            {t('buttons.routes')}
          </AppButton>
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
