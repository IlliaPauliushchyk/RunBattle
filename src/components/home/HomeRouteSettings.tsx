import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {AppButton} from '../common/AppButton';
import {AppText} from '../common/AppText';
import {AutoHeightBottomSheet} from '../common/AutoHeightBottomSheet';

type HomeRouteSettingsProps = {
  saveSettings: () => void;
  closeSettings: () => void;
};

export const HomeRouteSettings = forwardRef<
  BottomSheet,
  HomeRouteSettingsProps
>(({saveSettings, closeSettings}, ref) => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <AutoHeightBottomSheet
      ref={ref}
      index={-1}
      enablePanDownToClose={false}
      handleIndicatorStyle={{backgroundColor: colors.background}}>
      <BottomSheetView style={styles.conainer}>
        <AppText variant="headlineSmall" mb={20} fontWeight="bold">
          {t('buttons.settings')}
        </AppText>
        <AppButton mb={20} onPress={closeSettings}>
          {t('Close')}
        </AppButton>
      </BottomSheetView>
    </AutoHeightBottomSheet>
  );
});

const styles = StyleSheet.create({
  conainer: {
    paddingHorizontal: 20,
  },
});
