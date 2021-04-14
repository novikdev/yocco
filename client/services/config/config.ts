import Constants from 'expo-constants';

const envConfig = Constants.manifest.extra[process.env.NODE_ENV || 'development'];

type SupportUrlType = 'telegram' | 'whatsapp';

type Config = {
  API_URL: string;
  AGREEMENT_URL: string;
  SUPPORT_URLS: {
    [key in SupportUrlType]: string;
  };
  VERSION: string;
};

export const config: Config = {
  API_URL: envConfig.API_URL,
  AGREEMENT_URL: envConfig.AGREEMENT_URL,
  SUPPORT_URLS: {
    telegram: envConfig.SUPPORT_TELEGRAM_URL,
    whatsapp: envConfig.SUPPORT_WHATSAPP_URL,
  },
  VERSION: envConfig.VERSION,
};
