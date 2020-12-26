import Constants from 'expo-constants';

const envConfig = Constants.manifest.extra[process.env.NODE_ENV || 'development'];

type Config = {
  API_URL: string;
};

export const config: Config = {
  API_URL: envConfig.API_URL,
};
