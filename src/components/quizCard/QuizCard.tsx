import {
	ChartAreaIcon,
	CheckIcon,
	EyeIcon,
	PencilIcon,
	Trash2Icon
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { deleteQuiz } from '@/api/quiz.api';
import { Card, CardContent } from '@/components/ui/card';
import useUser from '@/context/useUser';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { ROLE } from '@/data/dto/user/userInfo';
import { getQuestionWordForm } from '@/data/utils';

import AlertDialog from '../alertDialog/AlertDialog';
import LoginModal from '../loginModal/loginModal';
import { Button } from '../ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '../ui/tooltip';

interface QuizCardProps {
	quiz: QuizResponse;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
	const defaultImage = '/images/quiz.jpg';
	const [visible, setVisible] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const { user } = useUser();
	const router = useRouter();

	const handleDeleteQuiz = useCallback(async () => {
		const response = await deleteQuiz(quiz.id);
		if (response && response.status === 200) {
			router.reload();
		}
	}, [quiz.id, router]);

	const handleQuizClick = useCallback(() => {
		if (user) {
			router.push(`/tests/${quiz.id}`);
		} else {
			setShowModal(true);
		}
	}, [user, quiz.id, router]);

	return (
		<>
			<LoginModal open={showModal} onOpenChange={setShowModal} />
			<Card
				className="flex-grow cursor-pointer"
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				onClick={handleQuizClick}
			>
				<div className="relative h-40 w-full mb-2">
					<Image
						src={quiz.media ? quiz.media.url : defaultImage}
						alt="Media"
						layout="fill"
					/>
				</div>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="flex flex-col w-full">
							<div className="flex items-center justify-between">
								<p className="text-2xl text-wrap break-all">
									{quiz.title + '123123123123123123123123123123123123123123123'}
								</p>
								{visible && user?.role.key === ROLE.ADMIN && (
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={e => {
												e.stopPropagation();
												router.push(`/tests/statistic/${quiz.id}`);
											}}
										>
											<ChartAreaIcon />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={e => {
												e.stopPropagation();
												router.push(`/tests/manage/${quiz.id}`);
											}}
										>
											<PencilIcon />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={e => {
												e.stopPropagation();
												setIsDeleting(true);
											}}
										>
											<Trash2Icon />
										</Button>
									</div>
								)}
							</div>
							{quiz.subtitle && (
								<p className="overflow-hidden text-ellipsis whitespace-pre-wrap">
									{quiz.subtitle}
								</p>
							)}
							<p className="font-semibold">
								{getQuestionWordForm(quiz._count.questions)}
							</p>
							<div className="flex items-center w-full justify-between">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<div className="flex items-center gap-1">
												<EyeIcon className="mr-1" />
												<p className="text-sm">{quiz._count.take}</p>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-sm">
												Цей тест пройшли {quiz._count.take} разів
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								{quiz.lastTakeId && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<CheckIcon className="h-5 w-5 stroke-green-700" />
											</TooltipTrigger>
											<TooltipContent>
												<p className="text-sm">Ви вже пройшли цей тест</p>
												<p
													className="text-sm underline cursor-pointer hover:text-blue-400"
													onClick={e => {
														e.stopPropagation();
														router.push(`/tests/overview/${quiz.lastTakeId}`);
													}}
												>
													Переглянути результати
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<AlertDialog
				open={isDeleting}
				title="Видалити тест?"
				text="Ви впевнені, що хочете видалити цей тест?"
				agreeButtonText="Видалити"
				onCancel={() => setIsDeleting(false)}
				onAccept={() => handleDeleteQuiz()}
			/>
		</>
	);
};

export default QuizCard;
