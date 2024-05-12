import { QUIZ_REQUEST } from '@/data/apiConstants';
import { QuizEntity } from '@/data/entities/quiz.entity';

import axios from '../axiosInstance/axios.instance';

export const getQuizzes = async () => {
	try {
		return await axios.get(QUIZ_REQUEST);
	} catch (e) {
		console.error(e);
	}
};

export const createQuiz = async (quiz: QuizEntity) => {
	try {
		return await axios.post(QUIZ_REQUEST, quiz);
	} catch (e) {
		console.error(e);
	}
};

export const updateQuiz = async (quizId: number | string, quiz: QuizEntity) => {
	try {
		return await axios.patch(`${QUIZ_REQUEST}/${quizId}`, quiz);
	} catch (e) {
		console.error(e);
	}
};
export const getQuizById = async (id: string | number) => {
	try {
		return await axios.get(`${QUIZ_REQUEST}/${id}`);
	} catch (e) {
		console.error(e);
	}
};

export const deleteQuiz = async (id: string | number) => {
	try {
		return await axios.delete(`${QUIZ_REQUEST}/${id}`);
	} catch (e) {
		console.error(e);
	}
};
