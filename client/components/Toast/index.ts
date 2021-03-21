import ToastMessage from 'react-native-toast-message';
import { showToast } from './services/showToast/showToast';
import { Toast } from './Toast';

type ToastComponentType = typeof Toast & {
  show: typeof showToast;
  hide: typeof ToastMessage.hide;
};

const ToastComponent: ToastComponentType = Toast as ToastComponentType;
ToastComponent.show = showToast;
ToastComponent.hide = ToastMessage.hide;

export { ToastComponent as Toast };
