import axios, { isAxiosError } from 'axios';

import { AUTH_REQUEST } from '@/data/apiConstants';
import { AuthRequest } from '@/data/dto/auth/auth.request';

import axiosInstance from '../axiosInstance/axios.instance';

export const signIn = async (data: AuthRequest) => {
	try {
		return await axios.post(`${AUTH_REQUEST}/signIn`, data);
	} catch (e) {
		console.error(e);
		if (isAxiosError(e)) {
			return e.response;
		}
	}
};

export const getTokens = async (refreshToken: string) => {
	try {
		return await axios.get(`${AUTH_REQUEST}/refresh-token`, {
			headers: { Authorization: `Bearer ${refreshToken}` }
		});
	} catch (e) {
		console.error(e);
		if (isAxiosError(e)) {
			return e.response;
		}
	}
};
export const getUser = async () => {
	try {
		return await axiosInstance.get(`${AUTH_REQUEST}/current-user`);
	} catch (e) {
		console.error(e);
		if (isAxiosError(e)) {
			return e.response;
		}
	}
};
