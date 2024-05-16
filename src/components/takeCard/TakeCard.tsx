import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getQuizById } from '@/api/quiz.api';
import CenteredLoader from '@/components/custom/CenteredLoader';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { TakeResponse } from '@/data/dto/take/take.response';

import styles from '../quizCard/quizCard.module.scss';

interface TakeCardProps {
	take: TakeResponse;
}

const TakeCard: React.FC<TakeCardProps> = ({ take }) => {
	const defaultImage = '/images/quiz.jpg';
	const [quiz, setQuiz] = useState<QuizResponse | undefined>(undefined);
	const router = useRouter();
	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const response = await getQuizById(take.quizId);
				if (response && response.status === 200) {
					setQuiz(response.data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchQuiz();
	}, []);

	const score = take?.answers?.reduce((acc, answer) => {
		const question = quiz?.questions.find(q =>
			q.answers.some(a => a.id === answer.answerId)
		);
		return (
			acc + (question?.answers.find(a => a.id == answer.answerId)?.score || 0)
		);
	}, 0);

	if (!quiz) return <CenteredLoader />;
	return (
		<>
			<Card
				className={styles.quizCard}
				sx={{ height: '100%' }}
				onClick={() => router.push(`/tests/overview/${take.id}`)}
			>
				<CardMedia
					component={'img'}
					src={quiz.media ? quiz.media.url : defaultImage}
					alt="Media"
					height="200"
					title={quiz.title}
				/>
				<CardContent>
					<Typography variant="h5" gutterBottom>
						{quiz.title}
					</Typography>
					{quiz.subtitle && (
						<Typography variant="subtitle1">{quiz.subtitle}</Typography>
					)}
					<Typography variant="subtitle2">
						Результат: {score} з {quiz.maxScore}
					</Typography>
				</CardContent>
			</Card>
		</>
	);
};

export default TakeCard;
