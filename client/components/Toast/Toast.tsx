import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import ToastMessage, { BaseToastProps } from 'react-native-toast-message';
import { Text } from '@components/Text';
import { theme } from '@services/theme';
import styles from './Toast.styles';

type CustomToastProps<T> = BaseToastProps & {
  props: T;
};

type ButtonProps = {
  text: string;
  onPress(): void;
};

export type WithButtonsProps = {
  button1: ButtonProps;
  button2?: ButtonProps;
};

const toastConfig = {
  with_buttons: (props: CustomToastProps<WithButtonsProps>) => {
    const {
      text1,
      text2,
      props: { button1, button2 },
    } = props;
    return (
      <View style={styles.base}>
        {text1 && <Text size="h5">{text1}</Text>}
        {text2 && <Text size="body">{text2}</Text>}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={button1.onPress}>
            <Text size="body" color={theme.colors.darkPurple}>
              {button1.text}
            </Text>
          </TouchableOpacity>
          {button2 && (
            <TouchableOpacity onPress={button2.onPress}>
              <Text size="body" color={theme.colors.darkPurple}>
                {button2.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  },
};

export function Toast() {
  return <ToastMessage config={toastConfig} ref={(ref) => ToastMessage.setRef(ref)} />;
}
