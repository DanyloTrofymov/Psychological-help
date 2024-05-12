import { QuizEntity } from '../entities/quiz.entity';

export const quizInitial: QuizEntity = {
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
