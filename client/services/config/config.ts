import Constants from 'expo-constants';

const envConfig = Constants.manifest.extra[process.env.NODE_ENV || 'development'];

type Config = {
  API_URL: string;
  AGREEMENT_URL: string;
  SUPPORT_TELEGRAM_URL: string;
  SUPPORT_WHATSAPP_URL: string;
};

export const config: Config = {
  API_URL: envConfig.API_URL,
  AGREEMENT_URL: envConfig.AGREEMENT_URL,
  SUPPORT_TELEGRAM_URL: envConfig.SUPPORT_TELEGRAM_URL,
  SUPPORT_WHATSAPP_URL: envConfig.SUPPORT_WHATSAPP_URL,
};
