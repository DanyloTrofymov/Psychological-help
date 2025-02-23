import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { getQuizById } from '@/api/quiz.api';
import CenteredLoader from '@/components/custom/CenteredLoader';
import { Card, CardContent } from '@/components/ui/card';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { TakeResponse } from '@/data/dto/take/take.response';

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
		if (take.quizId) {
			fetchQuiz();
		}
	}, [take.quizId]);

	const score = useMemo(() => {
		return take?.answers?.reduce((acc, answer) => {
			const question = quiz?.questions.find(q =>
				q.answers.some(a => a.id === answer.answerId)
			);
			return (
				acc + (question?.answers.find(a => a.id == answer.answerId)?.score || 0)
			);
		}, 0);
	}, [take.answers, quiz?.questions]);

	if (!quiz) return <CenteredLoader />;
	return (
		<>
			<Card
				className="flex-grow cursor-pointer min-w-[250px] sm:min-w-[350px]"
				onClick={() => router.push(`/tests/overview/${take.id}`)}
			>
				<div className="relative h-40 w-full mb-2">
					<Image
						src={quiz.media ? quiz.media.url : defaultImage}
						alt="Media"
						layout="fill"
					/>
				</div>
				<CardContent>
					<p className="text-2xl text-wrap break-all">{quiz.title}</p>
					{quiz.subtitle && (
						<p className="overflow-hidden text-ellipsis whitespace-pre-wrap">
							{quiz.subtitle}
						</p>
					)}
					<p>
						Результат: {score} з {quiz.maxScore}
					</p>
				</CardContent>
			</Card>
		</>
	);
};

export default TakeCard;
