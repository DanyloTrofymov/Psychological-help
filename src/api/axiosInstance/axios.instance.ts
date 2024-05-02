import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/data/localStorageKeys';
import axios from 'axios';
import { getTokens } from '../auth/auth.api';

const instance = axios.create();

instance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent retry loop

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
          throw error;
        }
        const tokens = await getTokens(refreshToken);
        // Store the new access token
        localStorage.setItem(ACCESS_TOKEN, tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN, tokens.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {

        throw refreshError;
      }
    }
    throw error;
  }
);

export default instance;