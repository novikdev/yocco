import axios, { AxiosError } from 'axios';
import { config } from '@services/config';
import { IYoccoError } from './types';
import { NotOptional } from '@services/tsUtils';
// TODO: fix circular dependency
import { store } from '../../App';
import { logout } from '../../data/init/actions';

export const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
});

const logoutInterceptor = (error: AxiosError) => {
  const status = error.response && error.response.status;
  if (status !== 401) {
    return Promise.reject(error);
  }
  store.dispatch(logout({ silent: true }));
};

api.interceptors.response.use(undefined, logoutInterceptor);

type AuthData = {
  jwt?: string;
  uniqueId?: string;
};

export function isYoccoError(
  error: AxiosError | any
): error is NotOptional<AxiosError<IYoccoError>, 'response'> {
  return error && error.isAxiosError && error.response?.data?.error === 'YoccoError';
}

export function initializeApiInterceptor({ jwt, uniqueId }: AuthData) {
  if (jwt) {
    api.defaults.headers.common['Authorization'] = `bearer ${jwt}`;
  }
  if (uniqueId) {
    api.defaults.headers.common['Device-ID'] = uniqueId;
  }
}
