const AGREEMENT_URL =
  'https://docs.google.com/document/d/e/2PACX-1vTHhjaaXWMvmkDhjtEbmqvbTqAiQ8NgGox42KfkJ7y3xcQGW-A2fynwtCXgECl5rUSZfBFlRs-VYkWG/pub';
const SUPPORT_TELEGRAM_URL = 'https://t.me/yocco_app';
const SUPPORT_WHATSAPP_URL =
  'https://wa.me/79161894143?text=%D0%92%D0%BE%D0%BF%D1%80%D0%BE%D1%81%20%D0%B2%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D1%83%D1%8E%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D1%83%20Yocco%20App';

export default {
  name: 'Yocco',
  slug: 'yocco',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'yocco',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'ru.yocco',
    buildNumber: '1.0.0',
  },
  android: {
    package: 'ru.yocco',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#6A37C7',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    production: {
      API_URL: 'https://yocco.ru/api',
      AGREEMENT_URL,
      SUPPORT_TELEGRAM_URL,
      SUPPORT_WHATSAPP_URL,
    },
    development: {
      API_URL: 'http://localhost:3000',
      AGREEMENT_URL,
      SUPPORT_TELEGRAM_URL,
      SUPPORT_WHATSAPP_URL,
    },
  },
};
