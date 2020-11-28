import axios from 'axios';
import { config } from '@services/config';

export const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

type AuthData = {
  jwt?: string;
  uniqueId?: string;
};

export function initializeApiInterceptor({ jwt, uniqueId }: AuthData) {
  if (jwt) {
    api.defaults.headers.common['Authorization'] = `bearer ${jwt}`;
  }
  if (uniqueId) {
    api.defaults.headers.common['Device-ID'] = uniqueId;
  }
}
