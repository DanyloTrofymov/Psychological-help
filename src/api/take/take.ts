import { TAKE_REQUEST } from '@/data/apiConstants';
import { TakeEntity } from '@/data/entities/take.entity';

import axios from '../axiosInstance/axios.instance';

export const getMyTake = async () => {
	try {
		return await axios.get(TAKE_REQUEST + '/my');
	} catch (e) {
		console.error(e);
	}
};

export const getTakeById = async (id: string | number) => {
	try {
		return await axios.get(TAKE_REQUEST + '/' + id);
	} catch (e) {
		console.error(e);
	}
};

export const createTake = async (take: TakeEntity) => {
	try {
		return await axios.post(TAKE_REQUEST, {
			quizId: take.quizId,
			answers: take.answers
		});
	} catch (e) {
		console.error(e);
	}
};
