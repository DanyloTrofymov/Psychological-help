import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Stack,
	Tooltip,
	Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { deleteQuiz } from '@/api/quiz.api';
import useUser from '@/context/useUser';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
import { ROLE } from '@/data/dto/user/userInfo';
import { getQuestionWordForm } from '@/data/utils';

import AlertDialog from '../alertDialog/AlertDialog';
import LoginModal from '../loginModal/loginModal';
import styles from './quizCard.module.scss';

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

	const handleDeleteQuiz = async () => {
		const response = await deleteQuiz(quiz.id);
		if (response && response.status === 200) {
			router.reload();
		}
	};

	const handleQuizClick = () => {
		if (user) {
			router.push(`/tests/${quiz.id}`);
		} else {
			setShowModal(true);
		}
	};
	return (
		<>
			<LoginModal open={showModal} onClose={() => setShowModal(false)} />
			<Card
				className={styles.quizCard}
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				sx={{ height: '100%' }}
				onClick={handleQuizClick}
			>
				<CardMedia
					component={'img'}
					src={quiz.media ? quiz.media.url : defaultImage}
					alt="Media"
					height="200"
					title={quiz.title}
				/>
				<CardContent>
					<Stack direction="row" justifyContent={'space-between'}>
						<Stack direction="column" width={'100%'}>
							<Typography variant="h5" gutterBottom>
								{quiz.title}
							</Typography>

							{quiz.subtitle && (
								<Typography variant="subtitle1">{quiz.subtitle}</Typography>
							)}
							<Typography variant="subtitle1">
								{getQuestionWordForm(quiz._count.questions)}
							</Typography>
							<Tooltip
								title={
									<Typography variant="subtitle1">
										Цей тест пройшли {quiz._count.take} разів
									</Typography>
								}
							>
								<Stack
									direction="row"
									alignItems={'center'}
									width={'max-content'}
								>
									<VisibilityIcon sx={{ mr: 1 }} />
									<Typography variant="subtitle1">
										{quiz._count.take}
									</Typography>
								</Stack>
							</Tooltip>
						</Stack>
						<Stack direction="row" alignItems="center" height="max-content">
							{visible && user?.role.key === ROLE.ADMIN && (
								<>
									<IconButton
										onClick={e => {
											e.stopPropagation();
											router.push(`/tests/statistic/${quiz.id}`);
										}}
										sx={{ height: '45px', width: '45px' }}
									>
										<LeaderboardIcon />
									</IconButton>
									<IconButton
										onClick={e => {
											e.stopPropagation();
											router.push(`/tests/manage/${quiz.id}`);
										}}
										sx={{ height: '45px', width: '45px' }}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										onClick={e => {
											e.stopPropagation();
											setIsDeleting(true);
										}}
										sx={{ height: '45px', width: '45px' }}
									>
										<DeleteIcon />
									</IconButton>
								</>
							)}
							{quiz.lastTakeId && (
								<Tooltip
									title={
										<>
											<Typography variant="subtitle1">
												Ви вже пройшли цей тест
											</Typography>
											<Typography
												variant="subtitle2"
												sx={{
													textDecoration: 'underline',
													cursor: 'pointer',
													'&:hover': {
														cursor: 'pointer',
														color: 'blue'
													}
												}}
												onClick={e => {
													e.stopPropagation();
													router.push(`/tests/overview/${quiz.lastTakeId}`);
												}}
											>
												Переглянути результати
											</Typography>
										</>
									}
								>
									<DoneIcon color="success" sx={{ height: '45px' }} />
								</Tooltip>
							)}
						</Stack>
					</Stack>
				</CardContent>
			</Card>
			<AlertDialog
				open={isDeleting}
				title="Delete Quiz"
				text="Are you sure you want to delete this quiz?"
				agreeButtonText="Delete"
				onCancel={() => setIsDeleting(false)}
				onAccept={() => handleDeleteQuiz()}
			/>
		</>
	);
};

export default QuizCard;
