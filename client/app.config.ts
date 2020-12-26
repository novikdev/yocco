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
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    production: {
      API_URL: 'https://yocco.ru/api',
    },
    development: {
      API_URL: 'http://localhost:3000',
    },
  },
};
