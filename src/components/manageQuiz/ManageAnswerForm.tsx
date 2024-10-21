import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack } from '@mui/material';
import { FormikErrors, FormikTouched } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { QuizQuestionRequest, QuizRequest } from '@/data/dto/quiz/quiz.request';

import { Input } from '../ui/input';
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
	const router = useRouter();
	const [removingIndex, setRemovingIndex] = useState<number | null>(null);

	const handleAddAnswer = () => {
		const newAnswer = { title: '', score: 0, mediaId: undefined };
		const updatedAnswers = [...question.answers, newAnswer];
		setFieldValue(`questions[${questionIndex}].answers`, updatedAnswers);
	};

	const handleRemoveAnswer = (index: number) => {
		setRemovingIndex(index);
		setTimeout(() => {
			setFieldValue(
				`questions[${questionIndex}].answers`,
				question.answers.filter((_, i) => i !== index)
			);
			setRemovingIndex(null);
		}, 300);
	};

	return (
		<Box sx={{ backgroundColor: '#dfdfdf', borderRadius: '4px' }}>
			{question.answers.map((answer, idx) => (
				// eslint-disable-next-line react/jsx-no-undef
				<Stack
					className={`${styles.animatedItem} ${removingIndex === idx ? styles.deletingItem : ''}`}
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
						<Input
							name={`questions[${questionIndex}].answers[${idx}].title`}
							placeholder="Текст відповіді"
							placeholderTransparent
							onChange={handleChange}
							required
							value={question.answers[idx].title}
							className="w-full"
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
								errors?.questions &&
								errors?.questions[questionIndex] &&
								(errors?.questions[questionIndex] as any)?.answers &&
								(errors?.questions[questionIndex] as any).answers?.length &&
								(errors?.questions[questionIndex] as any)?.answers[idx]?.title
							}
						/>
						<Input
							type="number"
							name={`questions[${questionIndex}].answers[${idx}].score`}
							placeholder="Бали"
							required
							onChange={handleChange}
							value={question.answers[idx].score}
							className="w-20"
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
					className="m-2 mt-0 w-max"
					variant={'outline'}
				>
					Додати відповідь
				</Button>
			)}
		</Box>
	);
};

export default AnswerForm;
