import axios, { isAxiosError } from 'axios';

import { AUTH_REQUEST } from '@/data/apiConstants';
import { AuthRequest } from '@/dto/auth/auth.request';

import axiosInstance from '../axiosInstance/axios.instance';

export const signIn = async (data: AuthRequest) => {
	try {
		const response = await axios.post(`${AUTH_REQUEST}/signIn`, data);
		return response.data;
	} catch (e) {
		console.error(e);
		if (isAxiosError(e)) {
			return e;
		}
	}
};

export const getTokens = async (refreshToken: string) => {
	try {
		const response = await axios.get(`${AUTH_REQUEST}/refresh-token`, {
			headers: { Authorization: `Bearer ${refreshToken}` }
		});
		return response.data;
	} catch (e) {
		console.error(e);
		if (isAxiosError(e)) {
			return e;
		}
	}
};
export const getUser = async () => {
	try {
		return await axiosInstance.get(`${AUTH_REQUEST}/current-user`);
	} catch (e) {
		console.error(e);
		if (isAxiosError(e)) {
			return e;
		}
	}
};
