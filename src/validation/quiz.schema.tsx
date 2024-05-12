import * as Yup from 'yup';

export const quizSchema = Yup.object().shape({
	title: Yup.string().required('Title is required'),
	summary: Yup.string(),
	subtitle: Yup.string()
});
