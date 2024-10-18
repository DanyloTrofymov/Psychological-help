import {
	Box,
	FormControlLabel,
	FormHelperText,
	Radio,
	RadioGroup,
	Stack,
	Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { getQuizById } from '@/api/quiz.api';
import { createTake } from '@/api/take.api';
import Button from '@/components/custom/Button';
import CenteredLoader from '@/components/custom/CenteredLoader';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { takeInitial } from '@/data/initialValues/quizInitial';
import { MESSAGE_TYPE, SOMETHING_WENT_WRONG } from '@/data/messageData';
import { TakeSchema } from '@/data/validation/takeValidation';

import styles from '../../components/manageQuiz/quizForm.module.scss';

const PassTestForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [quizId, setQuizId] = useState<string | undefined>(undefined);
	const [quiz, setQuiz] = useState<QuizResponse | undefined>(undefined);
	const router = useRouter();

	const handleQuizSubmit = async () => {
		if (!values.quizId) return;
		if (values.answers.length !== quiz?.questions?.length) {
			enqueueSnackbar('Please answer all questions', {
				variant: MESSAGE_TYPE.ERROR
			});
			return;
		}
		const response: any = await createTake(values);
		if (response && response.status === 201) {
			router.push('/tests/overview/' + response.data.id);
		} else {
			enqueueSnackbar(SOMETHING_WENT_WRONG, {
				variant: MESSAGE_TYPE.ERROR
			});
		}
	};
	const { values, setFieldValue, submitForm, errors } = useFormik({
		initialValues: takeInitial,
		validationSchema: TakeSchema,
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: handleQuizSubmit
	});

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const response = await getQuizById(quizId!);
				if (response && response.status === 200) {
					const quiz: QuizResponse = response.data;
					setFieldValue('quizId', quiz.id);
					setQuiz(quiz);
				}
			} catch (e) {
				console.error(e);
				enqueueSnackbar(SOMETHING_WENT_WRONG, {
					variant: MESSAGE_TYPE.ERROR
				});
			}
		};

		if (quizId) {
			fetchQuiz();
		}
	}, [quizId]);

	useEffect(() => {
		if (router.query.id) {
			setQuizId(router.query.id as string);
		}
	}, [router.query.id]);

	useEffect(() => {
		if (quiz && setFieldValue) {
			const answers = quiz.questions.map(question => ({
				questionId: question.id,
				answerId: undefined
			}));
			setFieldValue('answers', answers);
		}
	}, [quiz, setFieldValue]);
	if (!quiz) {
		return <CenteredLoader />;
	}

	return (
		<Box className={styles.quizForm}>
			<Stack direction="column" spacing={2} sx={{ pb: 2 }}>
				<Typography variant="h1">{quiz.title}</Typography>
				<Typography variant="h3">{quiz?.subtitle}</Typography>
				{quiz.questions.map((question, questionIndex) => (
					<Stack
						key={questionIndex}
						direction="column"
						spacing={2}
						sx={{
							p: 2,
							mt: 1,
							backgroundColor: '#f5f5f5',
							borderRadius: '5px'
						}}
					>
						<Typography variant="h2">{question.title}</Typography>
						<Typography>{question.subtitle}</Typography>
						<Stack direction="column" spacing={1}>
							{errors.answers?.[questionIndex] && (
								<FormHelperText error>
									Дайте відповідь на це запитання.
								</FormHelperText>
							)}
							<RadioGroup
								name={`answers[${questionIndex}].answerId`}
								value={values.answers[questionIndex]?.answerId}
								onChange={event => {
									setFieldValue(
										`answers[${questionIndex}].answerId`,
										Number(event.target.value)
									);
									setFieldValue(
										`answers[${questionIndex}].questionId`,
										question.id
									);
								}}
							>
								{question.answers.map((answer, answerIndex) => (
									<FormControlLabel
										key={answerIndex}
										value={answer.id}
										control={<Radio />}
										label={answer.title}
									/>
								))}
							</RadioGroup>
						</Stack>
					</Stack>
				))}
			</Stack>
			{!!errors?.answers && (
				<Typography sx={{ color: 'rgb(253, 54, 54)', fontSize: 14 }}>
					{'Заповність усі необхідні поля'}
				</Typography>
			)}
			<Button variant="contained" onClick={() => submitForm()}>
				Завершити
			</Button>
		</Box>
	);
};

export default PassTestForm;
