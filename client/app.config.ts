const AGREEMENT_URL =
  'https://docs.google.com/document/d/e/2PACX-1vTHhjaaXWMvmkDhjtEbmqvbTqAiQ8NgGox42KfkJ7y3xcQGW-A2fynwtCXgECl5rUSZfBFlRs-VYkWG/pub';

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
    },
    development: {
      API_URL: 'http://localhost:3000',
      AGREEMENT_URL,
    },
  },
};
