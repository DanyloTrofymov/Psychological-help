import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getQuizzes } from '@/api/quiz/quiz';
import Button from '@/components/custom/Button';
import useUser from '@/context/useUser';
import { QuizResponse } from '@/data/dto/quiz/quiz';
import { ROLE } from '@/data/dto/user/userInfo';

import QuizCard from '../../components/quizCard/QuizCard';

const QuizLayout = () => {
	const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
	const { user } = useUser();
	const router = useRouter();
	useEffect(() => {
		const fetchQuizzes = async () => {
			try {
				const response = await getQuizzes();
				if (response && response.status === 200) {
					setQuizzes(response.data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchQuizzes();
	}, []);

	return (
		<div>
			{user?.role.key === ROLE.ADMIN && (
				<Button
					variant="contained"
					onClick={() => router.push('/tests/manage')}
					sx={{ mb: 2 }}
				>
					Створити тест
				</Button>
			)}
			<Grid container spacing={2}>
				{quizzes.map(quiz => (
					<Grid item key={quiz.id} xs={12} sm={6} md={4} lg={3}>
						<QuizCard quiz={quiz} />
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default QuizLayout;
