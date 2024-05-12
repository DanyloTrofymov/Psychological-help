import {
	Box,
	Button,
	FormControlLabel,
	Radio,
	RadioGroup,
	Stack,
	Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { getQuizById } from '@/api/quiz/quiz';
import { getTakeById } from '@/api/take/take';
import CenteredLoader from '@/components/custom/CenteredLoader';
import { QuizResponse } from '@/data/dto/quiz/quiz';
import { TakeResponse } from '@/data/dto/take/take';
import { MESSAGE_TYPE, SOMETHING_WENT_WRONG } from '@/data/messageData';

import styles from '../../components/manageQuiz/quizForm.module.scss';

const ViewTestForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();
	const [takeId, setTakeId] = useState<string | undefined>(undefined);
	const [take, setTake] = useState<TakeResponse | undefined>(undefined);
	const [quiz, setQuiz] = useState<QuizResponse | undefined>(undefined);

	useEffect(() => {
		const takeId = router.query.id as string;
		setTakeId(takeId);
	}, [router.isReady]);

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const response = await getTakeById(takeId!);
				if (response && response.status === 200) {
					setTake(response.data);
				} else {
					enqueueSnackbar(SOMETHING_WENT_WRONG, {
						variant: MESSAGE_TYPE.ERROR
					});
				}
			} catch (e) {
				console.error(e);
				enqueueSnackbar(SOMETHING_WENT_WRONG, {
					variant: MESSAGE_TYPE.ERROR
				});
			}
		};
		if (takeId) {
			fetchQuiz();
		}
	}, [takeId]);

	useEffect(() => {
		if (take) {
			const fetchQuiz = async () => {
				try {
					const response = await getQuizById(take.quizId);
					if (response && response.status === 200) {
						setQuiz(response.data);
					} else {
						enqueueSnackbar(SOMETHING_WENT_WRONG, {
							variant: MESSAGE_TYPE.ERROR
						});
					}
				} catch (e) {
					console.error(e);
					enqueueSnackbar(SOMETHING_WENT_WRONG, {
						variant: MESSAGE_TYPE.ERROR
					});
				}
			};
			if (take?.quizId) {
				fetchQuiz();
			}
		}
	}, [take]);

	const score = take?.answers.reduce((acc, answer) => {
		const question = quiz?.questions.find(q =>
			q.answers.some(a => a.id === answer.answerId)
		);
		return (
			acc + (question?.answers.find(a => a.id == answer.answerId)?.score || 0)
		);
	}, 0);
	if (!take || !quiz) {
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
							<RadioGroup
								name={`answers[${questionIndex}].answerId`}
								value={take.answers[questionIndex]?.answerId}
							>
								{question.answers.map((answer, answerIndex) => (
									<FormControlLabel
										key={answerIndex}
										value={answer.id}
										control={<Radio />}
										disabled
										label={answer.title}
									/>
								))}
							</RadioGroup>
						</Stack>
					</Stack>
				))}
				<Typography variant="h1">Ваш результат</Typography>
				<Typography variant="h3">
					{score} з {quiz.maxScore}
				</Typography>
				<Typography variant="h1">Опис</Typography>
				<Typography variant="h3">{quiz?.summary}</Typography>
			</Stack>
			<Button variant="contained" onClick={() => router.push('/tests')}>
				Назад
			</Button>
		</Box>
	);
};

export default ViewTestForm;
