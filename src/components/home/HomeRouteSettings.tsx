import {RouteSettingsForm} from '@/forms/RouteSettingsForm';
import {useAppSelector, useUpdateRouteSettingsMutation} from '@/hooks';
import {ISettings, selectUser} from '@/store';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {AppText} from '../common/AppText';
import {AutoHeightBottomSheet} from '../common/AutoHeightBottomSheet';

type HomeRouteSettingsProps = {
  closeSettings: () => void;
};

export const HomeRouteSettings = forwardRef<
  BottomSheet,
  HomeRouteSettingsProps
>(({closeSettings}, ref) => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {settings} = useAppSelector(selectUser);

  const {
    mutate: saveRouteSettings,
    isPending,
    isError,
  } = useUpdateRouteSettingsMutation();

  const initialValues = settings as ISettings;

  const handleSubmit = async (values: ISettings): Promise<void> => {
    try {
      await saveRouteSettings(values);
      closeSettings();
    } catch (e) {
      console.error(e);
    }
  };

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
        <RouteSettingsForm
          closeSettings={closeSettings}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          loading={isPending}
          error={isError}
        />
      </BottomSheetView>
    </AutoHeightBottomSheet>
  );
});

const styles = StyleSheet.create({
  conainer: {
    paddingHorizontal: 20,
  },
});
