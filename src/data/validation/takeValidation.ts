import * as Yup from 'yup';

export const TakeSchema = Yup.object().shape({
	quizId: Yup.number().required('Required'),
	answers: Yup.array()
		.min(1, 'At least one answer is required')
		.required('Required')
		.of(
			Yup.object().shape({
				questionId: Yup.number().required('Required'),
				answerId: Yup.number().required('Required')
			})
		)
});
