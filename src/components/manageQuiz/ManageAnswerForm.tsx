import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import { FormikErrors, FormikTouched } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { QuizQuestionRequest, QuizRequest } from '@/data/dto/quiz/quiz.request';

import Button from '../custom/Button';
import styles from './quizForm.module.scss';

const AnswerForm = ({
	question,
	handleChange,
	setFieldValue,
	questionIndex,
	errors,
	touched,
	handleBlur
}: {
	question: QuizQuestionRequest;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<void> | Promise<FormikErrors<QuizRequest>>;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: {
		(e: FocusEvent): void;
		<T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
	};
	questionIndex: number;
	errors: FormikErrors<QuizRequest>;
	touched: FormikTouched<QuizRequest>;
}) => {
	const [animationClasses, setAnimationClasses] = useState<string[]>([]);

	useEffect(() => {
		setAnimationClasses(question.answers.map(() => 'entered'));
	}, [question.answers]);
	const router = useRouter();
	const handleAddAnswer = () => {
		const newAnswer = { title: '', score: 0, mediaId: undefined };
		const updatedAnswers = [...question.answers, newAnswer];
		setFieldValue(`questions[${questionIndex}].answers`, updatedAnswers);
		setAnimationClasses(animationClasses.concat(['entering']));
		setTimeout(() => {
			setAnimationClasses(current =>
				current.map((cls, idx) =>
					idx === question.answers.length ? 'entered' : cls
				)
			);
		}, 300); // Animation duration
	};

	const handleRemoveAnswer = (index: number) => {
		setAnimationClasses(current =>
			current.map((cls, idx) => (idx === index ? 'exiting' : cls))
		);
		setTimeout(() => {
			setFieldValue(
				`questions[${questionIndex}].answers`,
				question.answers.filter((_, i) => i !== index)
			);
			setAnimationClasses(current => current.filter((_, i) => i !== index));
		}, 300); // Ensure this matches your CSS animation duration
	};

	return (
		<Box sx={{ backgroundColor: '#dfdfdf', borderRadius: '4px' }}>
			{question.answers.map((answer, idx) => (
				// eslint-disable-next-line react/jsx-no-undef
				<Stack
					className={`${styles.animatedItem} ${styles[animationClasses[idx]]}`}
					direction={'column'}
					key={idx}
					sx={{
						p: '8px 16px 0px 16px',
						mt: 1
					}}
				>
					<Stack
						direction="row"
						alignItems="flex-start"
						spacing={2}
						sx={{ pb: 2 }}
					>
						<TextField
							name={`questions[${questionIndex}].answers[${idx}].title`}
							label="Тест відповіді"
							onChange={handleChange}
							required
							value={question.answers[idx].title}
							sx={{ width: '100%' }}
							onBlur={handleBlur(
								`questions[${questionIndex}].answers[${idx}].title`
							)}
							error={
								touched?.questions &&
								touched?.questions[questionIndex] &&
								touched?.questions[questionIndex]?.answers &&
								touched?.questions[questionIndex]?.answers?.length &&
								(touched?.questions[questionIndex] as any)?.answers[idx]
									?.title &&
								Boolean(
									errors?.questions &&
										errors?.questions[questionIndex] &&
										(errors?.questions[questionIndex] as any)?.answers &&
										(errors?.questions[questionIndex] as any).answers?.length &&
										(errors?.questions[questionIndex] as any)?.answers[idx]
											?.title
								)
							}
							helperText={
								touched?.questions &&
								touched?.questions[questionIndex] &&
								touched?.questions[questionIndex]?.answers &&
								touched?.questions[questionIndex]?.answers?.length &&
								(touched?.questions[questionIndex] as any)?.answers[idx]
									?.title &&
								errors?.questions &&
								errors?.questions[questionIndex] &&
								(errors?.questions[questionIndex] as any)?.answers &&
								(errors?.questions[questionIndex] as any).answers?.length &&
								(errors?.questions[questionIndex] as any)?.answers[idx]?.title
							}
						/>
						<TextField
							type="number"
							name={`questions[${questionIndex}].answers[${idx}].score`}
							label="Бали"
							required
							onChange={handleChange}
							value={question.answers[idx].score}
							sx={{ width: '90px' }}
							error={
								touched?.questions &&
								touched?.questions[questionIndex] &&
								touched?.questions[questionIndex]?.answers &&
								touched?.questions[questionIndex]?.answers?.length &&
								(touched?.questions[questionIndex] as any)?.answers[idx]
									?.score &&
								Boolean(
									errors?.questions &&
										errors?.questions[questionIndex] &&
										(errors?.questions[questionIndex] as any)?.answers &&
										(errors?.questions[questionIndex] as any).answers?.length &&
										(errors?.questions[questionIndex] as any)?.answers[idx]
											?.score
								)
							}
							helperText={
								touched?.questions &&
								touched?.questions[questionIndex] &&
								touched?.questions[questionIndex]?.answers &&
								touched?.questions[questionIndex]?.answers?.length &&
								(touched?.questions[questionIndex] as any)?.answers[idx]
									?.score &&
								errors?.questions &&
								errors?.questions[questionIndex] &&
								(errors?.questions[questionIndex] as any)?.answers &&
								(errors?.questions[questionIndex] as any).answers?.length &&
								(errors?.questions[questionIndex] as any)?.answers[idx]?.score
							}
						/>
						{!router.query.id && (
							<Box sx={{ pt: 1 }}>
								<IconButton
									onClick={() => handleRemoveAnswer(idx)}
									sx={{ height: '35px', width: '35px' }}
								>
									<DeleteOutlineIcon />
								</IconButton>
							</Box>
						)}
					</Stack>
				</Stack>
			))}
			{!router.query.id && (
				<Button
					onClick={() => handleAddAnswer()}
					sx={{ m: 2, mt: 0, width: 'max-content' }}
				>
					Додати відповідь
				</Button>
			)}
		</Box>
	);
};

export default AnswerForm;
