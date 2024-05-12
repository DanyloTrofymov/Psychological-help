export interface QuizEntity {
	title: string;
	summary?: string;
	subtitle?: string;
	mediaId?: number;
	media?: MediaEntity;
	questions: QuizQuestionEntity[];
}

export interface QuizQuestionEntity {
	title: string;
	subtitle?: string;
	mediaId?: number;
	answers: QuizAnswerEntity[];
	media?: MediaEntity;
}

export interface QuizAnswerEntity {
	title: string;
	score: number;
	mediaId?: number;
	media?: MediaEntity;
}

export interface MediaEntity {
	id: number;
	url: string;
	type: string;
}
