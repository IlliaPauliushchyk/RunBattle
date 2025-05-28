import {AppButton, ScreenContainer} from '@/components';
import {useAppDispatch} from '@/hooks';
import {setUser} from '@/store';
import {defaultContainerStyle} from '@/styles';
import auth from '@react-native-firebase/auth';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

export const HomeScreen = () => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(setUser({displayName: null, email: null}));
    auth().signOut();
  };

  return (
    <ScreenContainer>
      <Text>HomeScreen</Text>
      <AppButton onPress={handleLogout}>Выйти</AppButton>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    ...defaultContainerStyle,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 25,
  },
});
