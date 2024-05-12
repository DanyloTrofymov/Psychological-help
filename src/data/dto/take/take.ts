export interface TakeResponse {
	id: number;
	quizId: number;
	userId: number;
	answers: TakeAnswerResponse[];
	createdAt: string;
	updatedAt: string;
}

export interface TakeAnswerResponse {
	id: number;
	questionId: number;
	answerId: number;
}
