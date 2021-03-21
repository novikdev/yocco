import { WithButtonsProps } from '../../Toast';
import Toast from 'react-native-toast-message';

type ShowToastConfig = Omit<Parameters<typeof Toast.show>[0], 'type' | 'props'> &
  (
    | {
        type: 'success' | 'error' | 'info';
        props: undefined;
      }
    | {
        type: 'with_buttons';
        props: WithButtonsProps;
      }
  );

export function showToast(config: ShowToastConfig) {
  return Toast.show(config);
}
