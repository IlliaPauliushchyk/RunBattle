import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {Icon, useTheme} from 'react-native-paper';
import {AppText} from './AppText';

interface SmsCodeTimerProps {
  expiredIn?: number;
  onTimerFinished?: () => void;
  callback: (...args: any) => any;
  autoStart?: boolean;
}

export const SmsCodeTimer = ({
  expiredIn = 60,
  onTimerFinished,
  callback,
  autoStart = true,
}: SmsCodeTimerProps) => {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(expiredIn);
  const [isActive, setIsActive] = useState(autoStart);

  // Format time to MM:SS
  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return {
      minutes,
      seconds: seconds < 10 ? `0${seconds}` : seconds.toString(),
    };
  };

  // Timer control functions
  const startTimer = () => {
    setIsActive(true);
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          BackgroundTimer.stopBackgroundTimer();
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    BackgroundTimer.stopBackgroundTimer();
    setSecondsLeft(expiredIn);
    setIsActive(false);
  };

  // Handle timer finished
  useEffect(() => {
    if (secondsLeft === 0) {
      onTimerFinished?.();
    }
  }, [secondsLeft, onTimerFinished]);

  // Auto-start timer on mount if autoStart is true
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
    return () => BackgroundTimer.stopBackgroundTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRepeatRequest = async () => {
    setIsLoading(true);
    try {
      const response = await callback();

      if (response.success) {
        resetTimer();
        startTimer();
      } else {
        throw new Error(response.error.message);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const {seconds: displaySeconds} = formatTime();

  return (
    <>
      {isActive ? (
        <AppText>
          {`${t('text.waitOneMinuteMessage')} ${displaySeconds} ${t(
            'text.sec',
          )}`}
        </AppText>
      ) : (
        <TouchableOpacity
          disabled={isLoading}
          activeOpacity={0.7}
          onPress={handleRepeatRequest}
          style={styles.sendAgain}>
          <AppText mr={4}>{t('buttons.sendAgain')}</AppText>
          {isLoading ? (
            <ActivityIndicator size={12} color={colors.primary} />
          ) : (
            <Icon source="refresh" size={12} />
          )}
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sendAgain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
