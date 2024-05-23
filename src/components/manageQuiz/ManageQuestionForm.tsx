import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { FormikErrors, FormikTouched } from 'formik/dist/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { QuizQuestionRequest, QuizRequest } from '@/data/dto/quiz/quiz.request';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from '../custom/Button';
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
	const [animationClasses, setAnimationClasses] = useState<string[]>([]);
	const router = useRouter();
	useEffect(() => {
		setAnimationClasses(values.questions.map(() => 'entered'));
	}, [values.questions]);

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
		setAnimationClasses([
			...animationClasses.slice(0, index + 1),
			'entering',
			...animationClasses.slice(index + 1)
		]);
		setTimeout(() => {
			setAnimationClasses(current =>
				current.map((cls, idx) => (idx === index + 1 ? 'entered' : cls))
			);
		}, 300); // Animation duration
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
		setAnimationClasses([
			...animationClasses.slice(0, index + 1),
			'entering',
			...animationClasses.slice(index + 1)
		]);
		setTimeout(() => {
			setAnimationClasses(current =>
				current.map((cls, idx) => (idx === index + 1 ? 'entered' : cls))
			);
		}, 300); // Animation duration
	};

	const handleRemoveQuestion = (index: number) => {
		setAnimationClasses(current =>
			current.map((cls, idx) => (idx === index ? 'exiting' : cls))
		);
		setTimeout(() => {
			setFieldValue(
				'questions',
				values.questions.filter((_, i) => i !== index)
			);
			setAnimationClasses(current => current.filter((_, i) => i !== index));
		}, 300); // Ensure this matches your CSS animation duration
	};

	return (
		<>
			{values.questions.map((question, index) => (
				<Stack
					key={index}
					direction="column"
					spacing={2}
					className={`${styles.animatedItem} ${styles[animationClasses[index]]}`}
					sx={{ p: 2, mt: 1, borderRadius: '4px', backgroundColor: '#f5f5f5' }}
				>
					<TextField
						name={`questions[${index}].title`}
						label="Заголовок"
						required
						onBlur={handleBlur(`questions[${index}].title`)}
						onChange={handleChange}
						value={values.questions[index].title}
						error={
							touched?.questions &&
							touched?.questions[index]?.title &&
							Boolean(
								errors.questions &&
								((errors.questions[index] as any)?.title as string)
							)
						}
						helperText={
							touched?.questions &&
							touched?.questions[index]?.title &&
							errors.questions &&
							((errors.questions[index] as any)?.title as string)
						}
					/>
					<TextField
						name={`questions[${index}].subtitle`}
						label="Підзаголовок"
						onChange={handleChange}
						onBlur={handleBlur(`questions[${index}].subtitle`)}
						value={values.questions[index].subtitle}
						error={
							touched?.questions &&
							touched?.questions[index] &&
							Boolean(
								errors.questions &&
								((errors.questions[index] as any)?.subtitle as string)
							)
						}
						helperText={
							errors.questions &&
							((errors.questions[index] as any)?.subtitle as string as string)
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
							'Add at least 2 answers'}
					</Typography>
					<Stack direction="row" spacing={2} justifyContent={'space-between'}>
						{!router.query.id && (
							<>
								<Button
									onClick={() => {
										handleAddQuestion(index);
									}}
									sx={{ m: 2, ml: 3 }}
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
