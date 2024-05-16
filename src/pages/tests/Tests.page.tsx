import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getQuizzes } from '@/api/quiz.api';
import Button from '@/components/custom/Button';
import useUser from '@/context/useUser';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { ROLE } from '@/data/dto/user/userInfo';

import QuizCard from '../../components/quizCard/QuizCard';

const QuizLayout = () => {
	const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
	const { user } = useUser();
	const [currentPage, setCurrentPage] = useState(0);

	const router = useRouter();

	const fetchQuizzes = async () => {
		try {
			const response = await getQuizzes(currentPage, 10);
			if (response && response.status === 200) {
				setQuizzes(prev => [...prev, ...response.data]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchQuizzes();
	}, [currentPage]);

	return (
		<div>
			<Stack
				direction="row"
				sx={{ alignItems: 'center', justifyContent: 'space-between' }}
			>
				<Typography
					variant="h1"
					sx={{ justifySelf: 'center', fontSize: 30, color: '#213529', pb: 2 }}
				>
					{' '}
					Тести{' '}
				</Typography>
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
				</div>
			</Stack>
			<InfiniteScroll
				dataLength={quizzes.length}
				next={() => setCurrentPage(currentPage + 1)}
				hasMore={true}
				loader={null}
				scrollableTarget="scrollableLayout"
			>
				<Grid container spacing={2} sx={{ mb: 1 }}>
					{quizzes.map(quiz => (
						<Grid item key={quiz.id} xs={12} sm={6} md={4} lg={3}>
							<QuizCard quiz={quiz} />
						</Grid>
					))}
				</Grid>
			</InfiniteScroll>
		</div>
	);
};

export default QuizLayout;
