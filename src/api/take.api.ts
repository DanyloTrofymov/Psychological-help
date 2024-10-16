import { AxiosResponse } from 'axios';

import { TAKE_REQUEST } from '@/data/apiConstants';
import { PaginatedResponse } from '@/data/dto';
import { TakeRequest } from '@/data/dto/take/take.request';
import { TakeResponse } from '@/data/dto/take/take.response';

import axios from './axios.instance';

export const getMyTake = async (
	page: number,
	pageSize: number
): Promise<AxiosResponse<PaginatedResponse<TakeResponse>>> => {
	try {
		return await axios.get(
			TAKE_REQUEST + '/my' + `?page=${page}&pageSize=${pageSize}`
		);
	} catch (e) {
		console.error(e);
		throw e;
	}
};

export const getTakeById = async (id: string | number) => {
	try {
		return await axios.get(TAKE_REQUEST + '/' + id);
	} catch (e) {
		console.error(e);
	}
};

export const createTake = async (take: TakeRequest) => {
	try {
		return await axios.post(TAKE_REQUEST, {
			quizId: take.quizId,
			answers: take.answers
		});
	} catch (e) {
		console.error(e);
	}
};
