import { ExpoConfig } from '@expo/config';
import { coerce as semver } from 'semver';
import * as pkg from './package.json';

const AGREEMENT_URL =
  'https://docs.google.com/document/d/e/2PACX-1vTHhjaaXWMvmkDhjtEbmqvbTqAiQ8NgGox42KfkJ7y3xcQGW-A2fynwtCXgECl5rUSZfBFlRs-VYkWG/pub';
const SUPPORT_TELEGRAM_URL = 'https://t.me/yocco_app';
const SUPPORT_WHATSAPP_URL =
  'https://wa.me/79161894143?text=%D0%92%D0%BE%D0%BF%D1%80%D0%BE%D1%81%20%D0%B2%20%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D1%83%D1%8E%20%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D1%83%20Yocco%20App';

/**
 * The Expo sdkVersion to run the project on.
 * This should line up with the version specified in your package.json.
 */
const SDK_VERSION = '39.0.0';
const VERSION = pkg.version;
const ANDROID_VERSION_CODE = getAndroidVersionCode(SDK_VERSION, VERSION);
const DISPLAY_VERSION = `${VERSION} (${ANDROID_VERSION_CODE})`;

const config: ExpoConfig = {
  name: 'Yocco',
  slug: 'yocco',
  sdkVersion: SDK_VERSION,
  version: VERSION,
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
    checkAutomatically: 'ON_ERROR_RECOVERY',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'ru.yocco',
    buildNumber: VERSION,
    infoPlist: {
      LSApplicationQueriesSchemes: ['instagram'],
    },
  },
  android: {
    package: 'ru.yocco',
    versionCode: ANDROID_VERSION_CODE,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#6A37C7',
    },
    permissions: [],
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
      VERSION: DISPLAY_VERSION,
    },
    development: {
      API_URL: 'http://localhost:3000',
      AGREEMENT_URL,
      SUPPORT_TELEGRAM_URL,
      SUPPORT_WHATSAPP_URL,
      VERSION: DISPLAY_VERSION,
    },
  },
};

/**
 * Get the version code from a manifest and target version.
 * It's designed for Android using the approach from Maxi Rosson.
 *
 * @see https://medium.com/@maxirosson/versioning-android-apps-d6ec171cfd82
 */
export function getAndroidVersionCode(sdk: string, version: string): number {
  const expo = semver(sdk);
  const target = semver(version);

  if (!expo) {
    throw new Error('Could not parse the `expo.sdkVersion` from the manifest.');
  }

  if (!target) {
    throw new Error('Could not parse the new version from standard version.');
  }

  return expo.major * 10000000 + target.major * 10000 + target.minor * 100 + target.patch;
}

export default config;
