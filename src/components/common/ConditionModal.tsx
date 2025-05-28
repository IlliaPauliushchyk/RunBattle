import {AppText, ScreenContainer} from '@/components';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Button, useTheme} from 'react-native-paper';

type Props = {
  mainButtonTitle: string;
  mainButtonColor?: string;
  onPressMainButton: (...args: any) => any;
  title: string;
  description: string;
};

export const ConditionModal = ({
  mainButtonTitle,
  onPressMainButton,
  title,
  description,
}: Props) => {
  const navigation = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(false);
  const {colors}: any = useTheme();
  const {t} = useTranslation();

  const handlePress = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await onPressMainButton();
      setIsLoading(false);
    } catch (e) {
      setError(t('smthWentWrongError'));
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppText lineH={40} size={35}>
          {title}
        </AppText>
        <AppText type="regular" mt={30} mb={80} lineH={24}>
          {description}
        </AppText>

        <View>
          <Button
            mode="contained"
            loading={loading}
            style={styles.button}
            onPress={handlePress}>
            {mainButtonTitle}
          </Button>

          {error ? (
            <Typography.Description
              mt={10}
              mb={-15}
              style={{alignSelf: 'center'}}
              color={colors.error}
              textAlign={'center'}>
              {error}
            </Typography.Description>
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  button: {
    alignSelf: 'flex-end',
  },
});
