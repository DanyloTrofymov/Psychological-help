import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { sentTakeToAI, sentTakeToTherapist } from '@/api/chatroom.api';
import { getQuizById } from '@/api/quiz.api';
import { getTakeById } from '@/api/take.api';
import CenteredLoader from '@/components/custom/CenteredLoader';
import SendToChatModal from '@/components/sendToChatModal/sendToChatModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { TakeResponse } from '@/data/dto/take/take.response';
import { MESSAGE_TYPE, SOMETHING_WENT_WRONG } from '@/data/messageData';

import styles from '../../components/manageQuiz/quizForm.module.scss';

const ViewTestForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();
	const [takeId, setTakeId] = useState<string | undefined>(undefined);
	const [take, setTake] = useState<TakeResponse | undefined>(undefined);
	const [quiz, setQuiz] = useState<QuizResponse | undefined>(undefined);
	const [openModal, setOpenModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const takeId = router.query.id as string;
		setTakeId(takeId);
	}, [router.isReady, router.query.id]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [take]);

	const onAiSubmit = useCallback(async () => {
		if (!take?.id) return;
		setOpenModal(false);
		setIsLoading(true);
		const response = await sentTakeToAI(take?.id);
		if (response.status === 201) {
			router.push(`/chats/ai?chatId=${response.data.id}`);
		} else {
			enqueueSnackbar(SOMETHING_WENT_WRONG, {
				variant: MESSAGE_TYPE.ERROR
			});
			setIsLoading(false);
		}
	}, [take?.id, router, enqueueSnackbar]);

	const onTherapistSubmit = useCallback(async () => {
		if (!take?.id) return;
		setOpenModal(false);
		setIsLoading(true);
		const response = await sentTakeToTherapist(take?.id);
		if (response.status === 201) {
			router.push(`/chats/therapist?chatId=${response.data.id}`);
		} else {
			setIsLoading(false);
			enqueueSnackbar(SOMETHING_WENT_WRONG, {
				variant: MESSAGE_TYPE.ERROR
			});
		}
	}, [take?.id, router, enqueueSnackbar]);

	const score = useMemo(() => {
		return take?.answers.reduce((acc, answer) => {
			const question = quiz?.questions.find(q =>
				q.answers.some(a => a.id === answer.answerId)
			);
			return (
				acc + (question?.answers.find(a => a.id == answer.answerId)?.score || 0)
			);
		}, 0);
	}, [take?.answers, quiz?.questions]);

	if (!take || !quiz) {
		return <CenteredLoader />;
	}

	return (
		<div className={styles.quizForm}>
			<div className="flex flex-col gap-2 pb-2">
				<p className="text-2xl">{quiz.title}</p>
				<p className="text-lg">{quiz?.subtitle}</p>
				{quiz.questions.map((question, questionIndex) => (
					<div
						key={questionIndex}
						className="flex flex-col gap-2 p-2 mt-1 bg-gray-100 rounded-md"
					>
						<p className="text-xl">{question.title}</p>
						<p className="text-sm">{question.subtitle}</p>
						<div className="flex flex-col gap-1">
							<RadioGroup
								name={`answers[${questionIndex}].answerId`}
								value={take.answers[questionIndex]?.answerId.toString()}
								disabled
							>
								{question.answers.map((answer, answerIndex) => (
									<div key={answerIndex} className="flex items-center gap-2">
										<RadioGroupItem
											value={answer.id.toString()}
											id={answer.id.toString()}
										/>
										<Label htmlFor={answer.id.toString()}>{answer.title}</Label>
									</div>
								))}
							</RadioGroup>
						</div>
					</div>
				))}
				<p className="text-2xl">Ваш результат</p>
				<p className="text-lg">
					{score} з {quiz.maxScore}
				</p>
				<p className="text-2xl">Опис</p>
				<p className="text-lg">{quiz?.summary}</p>
			</div>
			<div className="flex justify-between">
				<Button onClick={() => router.push('/tests')}>Назад</Button>
				<Button onClick={() => onAiSubmit()}>Надіслати результат у чат</Button>
			</div>
			<SendToChatModal
				open={openModal}
				isLoading={isLoading}
				onOpenChange={setOpenModal}
				onAiSubmit={onAiSubmit}
				onTherapistSubmit={onTherapistSubmit}
			/>
		</div>
	);
};

export default ViewTestForm;
