export interface QuizRequest {
	title: string;
	summary?: string;
	subtitle?: string;
	mediaId?: number;
	media?: MediaEntity;
	questions: QuizQuestionRequest[];
}

export interface QuizQuestionRequest {
	title: string;
	subtitle?: string;
	mediaId?: number;
	answers: QuizAnsweRequest[];
	media?: MediaEntity;
}

export interface QuizAnsweRequest {
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
