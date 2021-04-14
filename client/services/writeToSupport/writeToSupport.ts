import { Linking } from 'react-native';

import { config } from '@services/config';

export function writeToSupport(type: keyof typeof config.SUPPORT_URLS): void {
  Linking.openURL(config.SUPPORT_URLS[type]);
}
