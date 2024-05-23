export interface QuizResponse {
	id: number;
	title: string;
	summary?: string;
	subtitle?: string;
	mediaId?: number;
	createdAt: string;
	updatedAt: string;
	active: boolean;
	maxScore: number;
	media?: MediaResponse;
	questions: QuizQuestionResponse[];
	lastTakeId?: number;
	_count: {
		questions: number;
		take: number;
	};
}

export interface QuizQuestionResponse {
	id: number;
	title: string;
	subtitle?: string;
	mediaId?: number;
	createdAt: string;
	updatedAt: string;
	quizId: number;
	answers: QuizAnswerResponse[];
	media?: MediaResponse;
}

export interface QuizAnswerResponse {
	id: number;
	title: string;
	score: number;
	mediaId?: number;
	media?: MediaResponse;
}

export interface MediaResponse {
	id: number;
	url: string;
	createdAt: string;
	updatedAt: string;
	type: string;
}
