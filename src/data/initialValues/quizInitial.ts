import { QuizRequest } from '../dto/quiz/quiz.request';
import { TakeRequest } from '../dto/take/take.request';

export const quizInitial: QuizRequest = {
	title: '',
	subtitle: '',
	mediaId: undefined,
	questions: [
		{
			title: '',
			subtitle: '',
			mediaId: undefined,
			answers: [
				{ title: '', score: 0, mediaId: undefined },
				{ title: '', score: 0, mediaId: undefined }
			]
		}
	]
};

export const takeInitial: TakeRequest = {
	quizId: 0,
	answers: []
};
