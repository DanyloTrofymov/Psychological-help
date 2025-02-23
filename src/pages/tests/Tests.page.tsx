import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getQuizzes } from '@/api/quiz.api';
import { Button } from '@/components/ui/button';
import useUser from '@/context/useUser';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { ROLE } from '@/data/dto/user/userInfo';

import QuizCard from '../../components/quizCard/QuizCard';

const QuizLayout = () => {
	const [quizzes, setQuizzes] = useState<QuizResponse[]>([]);
	const { user } = useUser();
	const [currentPage, setCurrentPage] = useState(0);

	const router = useRouter();

	const fetchQuizzes = useCallback(async () => {
		try {
			const response = await getQuizzes(currentPage, 10);
			if (response && response.status === 200) {
				setQuizzes(prev => [...prev, ...response.data.content]);
			}
		} catch (error) {
			console.error(error);
		}
	}, [currentPage]);

	useEffect(() => {
		if (fetchQuizzes) {
			fetchQuizzes();
		}
	}, [fetchQuizzes]);

	return (
		<div>
			<div className="flex items-center justify-between">
				<p className="text-2xl text-center text-gray-800 pb-2 font-semibold">
					Тести
				</p>
				<div>
					{user?.role.key === ROLE.ADMIN && (
						<Button
							onClick={() => router.push('/tests/manage')}
							className="mb-2"
						>
							Створити тест
						</Button>
					)}
				</div>
			</div>
			<InfiniteScroll
				dataLength={quizzes.length}
				next={() => setCurrentPage(currentPage + 1)}
				hasMore={true}
				loader={null}
				scrollableTarget="scrollableLayout"
			>
				<div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4 mb-1">
					{quizzes.map(quiz => (
						<QuizCard key={quiz.id} quiz={quiz} />
					))}
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default QuizLayout;
