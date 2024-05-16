import * as Yup from 'yup';

export const QuizSchema = Yup.object().shape({
	title: Yup.string().required('Додайте назву тесту'),
	subtitle: Yup.string(),
	description: Yup.string(),
	mediaId: Yup.number().nullable(),
	summary: Yup.string().required('Додайте результат тесту'),
	questions: Yup.array()
		.required('Додайте запитання')
		.of(
			Yup.object().shape({
				title: Yup.string().required('Додайте заголовок запитання'),
				subtitle: Yup.string(),
				mediaId: Yup.number().nullable(),
				answers: Yup.array()
					.of(
						Yup.object().shape({
							title: Yup.string().required('Додайте тест відповіді'),
							score: Yup.number().required('Додайте бали').min(0),
							mediaId: Yup.number().nullable()
						})
					)
					.min(2, 'Необхідно мінімум дві відповіді')
			})
		)
		.min(2, 'Необхідно мінімум два запитання')
});
