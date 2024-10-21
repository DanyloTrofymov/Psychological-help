import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { FormikErrors, FormikTouched } from 'formik/dist/types';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { QuizRequest } from '@/data/dto/quiz/quiz.request';

import { Input } from '../ui/input';
import AnswerForm from './ManageAnswerForm';
import styles from './quizForm.module.scss';

const QuestionForm = ({
	values,
	setFieldValue,
	handleChange,
	handleBlur,
	touched,
	errors
}: {
	values: QuizRequest;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<void> | Promise<FormikErrors<QuizRequest>>;
	handleChange: (e: React.ChangeEvent<any>) => void;
	errors: FormikErrors<QuizRequest>;
	touched: FormikTouched<QuizRequest>;
	handleBlur: {
		(e: FocusEvent): void;
		<T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
	};
}) => {
	const router = useRouter();
	const [removingIndex, setRemovingIndex] = useState<number | null>(null);

	const handleAddQuestion = (index: number) => {
		const newQuestions = [
			...values.questions.slice(0, index + 1),
			{
				title: '',
				subtitle: '',
				answers: [
					{ title: '', score: 0, mediaId: undefined },
					{ title: '', score: 0, mediaId: undefined }
				]
			},
			...values.questions.slice(index + 1)
		];
		setFieldValue('questions', newQuestions);
	};

	const handleCloneQuestion = (index: number) => {
		const newQuestions = [
			...values.questions.slice(0, index + 1),
			{
				title: values.questions[index].title,
				subtitle: values.questions[index].subtitle,
				answers: values.questions[index].answers
			},
			...values.questions.slice(index + 1)
		];
		setFieldValue('questions', newQuestions);
	};

	const handleRemoveQuestion = (index: number) => {
		setRemovingIndex(index);
		setTimeout(() => {
			setFieldValue(
				'questions',
				values.questions.filter((_, i) => i !== index)
			);
			setRemovingIndex(null);
		}, 300);
	};

	return (
		<>
			{values.questions.map((question, index) => (
				<Stack
					key={index}
					direction="column"
					spacing={2}
					className={`${styles.animatedItem} ${removingIndex === index ? styles.deletingItem : ''}`}
					sx={{ p: 2, mt: 1, borderRadius: '4px', backgroundColor: '#f5f5f5' }}
				>
					<Input
						name={`questions[${index}].title`}
						placeholder="Заголовок"
						placeholderTransparent
						required
						onBlur={handleBlur(`questions[${index}].title`)}
						onChange={handleChange}
						value={values.questions[index].title}
						error={
							touched?.questions &&
							touched?.questions[index]?.title &&
							errors.questions &&
							((errors.questions[index] as any)?.title as string)
						}
					/>
					<Input
						name={`questions[${index}].subtitle`}
						placeholder="Підзаголовок"
						placeholderTransparent
						onChange={handleChange}
						onBlur={handleBlur(`questions[${index}].subtitle`)}
						value={values.questions[index].subtitle}
						error={
							touched?.questions &&
							touched?.questions[index] &&
							errors.questions
								? ((errors.questions[index] as any)?.subtitle as string)
								: ''
						}
					/>
					<AnswerForm
						handleBlur={handleBlur}
						question={question}
						questionIndex={index}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
						touched={touched}
						errors={errors}
					/>
					<Typography sx={{ color: 'rgb(253, 54, 54)', fontSize: 14, pl: 3 }}>
						{values.questions[index].answers.length < 2 &&
							'Додайте мінімум 2 запитання'}
					</Typography>
					<Stack direction="row" spacing={2} justifyContent={'space-between'}>
						{!router.query.id && (
							<>
								<Button
									onClick={() => {
										handleAddQuestion(index);
									}}
									variant={'outline'}
									className="m-2 ml-3"
								>
									Додати запитання
								</Button>
								<Box>
									<IconButton
										sx={{
											mr: 2,
											height: '35px',
											width: '35px'
										}}
										onClick={() => {
											handleCloneQuestion(index);
										}}
									>
										<ContentCopyIcon />
									</IconButton>
									<IconButton
										sx={{
											mr: 2,
											height: '35px',
											width: '35px'
										}}
										onClick={() => {
											handleRemoveQuestion(index);
										}}
									>
										<DeleteOutlineIcon />
									</IconButton>
								</Box>
							</>
						)}
					</Stack>
				</Stack>
			))}
		</>
	);
};

export default QuestionForm;
