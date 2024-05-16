export interface TakeRequest {
	quizId: number;
	answers: AnswerRequest[];
}

export interface AnswerRequest {
	questionId: number;
	answerId: number;
}
