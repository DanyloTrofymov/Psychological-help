import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { getQuizById } from '@/api/quiz.api';
import { createTake } from '@/api/take.api';
import CenteredLoader from '@/components/custom/CenteredLoader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		<div className={styles.quizForm}>
			<div className="flex flex-col gap-2 pb-2">
				<h1 className="text-2xl font-bold">{quiz.title}</h1>
				<h3 className="text-lg">{quiz?.subtitle}</h3>
				{quiz.questions.map((question, questionIndex) => (
					<div
						key={questionIndex}
						className="flex flex-col gap-2 p-2 mt-1 bg-gray-100 rounded-md"
					>
						<h2 className="text-xl font-bold">{question.title}</h2>
						<p className="text-sm">{question.subtitle}</p>
						{errors.answers?.[questionIndex] && (
							<p className="text-red-500 text-sm">
								Дайте відповідь на це запитання.
							</p>
						)}
						<div className="flex flex-col gap-1">
							<RadioGroup
								name={`answers[${questionIndex}].answerId`}
								value={values.answers[questionIndex]?.answerId?.toString()}
								onValueChange={value => {
									setFieldValue(
										`answers[${questionIndex}].answerId`,
										Number(value)
									);
								}}
							>
								{question.answers.map((answer, answerIndex) => (
									<div key={answerIndex} className="flex items-center gap-2">
										<RadioGroupItem
											value={answer.id.toString()}
											id={answer.id.toString()}
										/>
										<Label htmlFor={answer.id.toString()}>{answer.title}</Label>
									</div>
								))}
							</RadioGroup>
						</div>
					</div>
				))}
			</div>
			{!!errors?.answers && (
				<p className="text-red-500 text-sm mb-2">
					Заповність усі необхідні поля
				</p>
			)}
			<Button onClick={() => submitForm()}>Завершити</Button>
		</div>
	);
};

export default PassTestForm;
