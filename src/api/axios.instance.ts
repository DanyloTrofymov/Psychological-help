import axios, { isAxiosError } from 'axios';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/data/localStorageKeys';

import { getTokens } from './auth.api';

const instance = axios.create();

instance.interceptors.request.use(async config => {
	const accessToken = localStorage.getItem(ACCESS_TOKEN);
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

instance.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true; // Prevent retry loop

			try {
				const refreshToken = localStorage.getItem(REFRESH_TOKEN);
				if (!refreshToken) {
					throw error;
				}
				const response = await getTokens(refreshToken);
				// Store the new access token
				if (response && response.status === 200) {
					localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
					localStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);
					originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
					return instance(originalRequest);
				}
			} catch (refreshError) {
				console.error(refreshError);
				if (isAxiosError(refreshError)) {
					return refreshError;
				}
			}
		}

		throw error;
	}
);

export default instance;
