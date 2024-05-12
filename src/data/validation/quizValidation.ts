import * as Yup from 'yup';

export const QuizSchema = Yup.object().shape({
	title: Yup.string().required('Required'),
	subtitle: Yup.string(),
	description: Yup.string(),
	mediaId: Yup.number().nullable(),
	summary: Yup.string().required('Required'),
	questions: Yup.array()
		.required('Required')
		.of(
			Yup.object().shape({
				title: Yup.string().required('Required'),
				subtitle: Yup.string(),
				mediaId: Yup.number().nullable(),
				answers: Yup.array()
					.of(
						Yup.object().shape({
							title: Yup.string().required('Required'),
							score: Yup.number().required('Required').min(0),
							mediaId: Yup.number().nullable()
						})
					)
					.min(2, 'At least two answers are required')
			})
		)
		.min(2, 'At least two questions are required')
});
