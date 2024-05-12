export interface TakeEntity {
	quizId: number;
	answers: AnswerEntity[];
}

export interface AnswerEntity {
	questionId: number;
	answerId: number;
}
