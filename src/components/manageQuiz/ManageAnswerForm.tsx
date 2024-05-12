import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, TextField } from '@mui/material';
import { FormikErrors } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { QuizEntity, QuizQuestionEntity } from '@/data/entities/quiz.entity';

import Button from '../custom/Button';
import styles from './quizForm.module.scss';

const AnswerForm = ({
	question,
	handleChange,
	setFieldValue,
	questioinIndex
}: {
	question: QuizQuestionEntity;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<void> | Promise<FormikErrors<QuizEntity>>;
	handleChange: (e: React.ChangeEvent<any>) => void;
	questioinIndex: number;
}) => {
	const [animationClasses, setAnimationClasses] = useState<string[]>([]);

	useEffect(() => {
		setAnimationClasses(question.answers.map(() => 'entered'));
	}, [question.answers]);
	const router = useRouter();
	const handleAddAnswer = () => {
		const newAnswer = { title: '', score: 0, mediaId: undefined };
		const updatedAnswers = [...question.answers, newAnswer];
		setFieldValue(`questions[${questioinIndex}].answers`, updatedAnswers);
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
				`questions[${questioinIndex}].answers`,
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
					<Stack direction="row" alignItems="center" spacing={2} sx={{ pb: 2 }}>
						<TextField
							name={`questions[${questioinIndex}].answers[${idx}].title`}
							label="Answer Title"
							onChange={handleChange}
							value={question.answers[idx].title}
							sx={{ width: '100%' }}
						/>
						<TextField
							type="number"
							name={`questions[${questioinIndex}].answers[${idx}].score`}
							label="Score"
							onChange={handleChange}
							value={question.answers[idx].score}
							sx={{ width: '68px' }}
						/>
						{!router.query.id && (
							<IconButton
								onClick={() => handleRemoveAnswer(idx)}
								sx={{ height: '35px', width: '35px' }}
							>
								<DeleteOutlineIcon />
							</IconButton>
						)}
					</Stack>
				</Stack>
			))}
			{!router.query.id && (
				<Button
					onClick={() => handleAddAnswer()}
					sx={{ m: 2, mt: 0, width: 'max-content' }}
				>
					Add Answer
				</Button>
			)}
		</Box>
	);
};

export default AnswerForm;
