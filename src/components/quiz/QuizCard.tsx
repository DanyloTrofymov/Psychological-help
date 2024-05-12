import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Stack,
	Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { deleteQuiz } from '@/api/quiz/quiz';
import useUser from '@/context/useUser';
import { QuizResponse } from '@/data/dto/quiz/quiz';
import { ROLE } from '@/data/dto/user/userInfo';

import AlertDialog from '../alertDialog/AlertDialog';
import styles from './quizCard.module.scss';

interface QuizCardProps {
	quiz: QuizResponse;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
	const defaultImage = '/images/quiz.jpg';
	const [visible, setVisible] = useState(true);
	const [isDeleting, setIsDeleting] = useState(false);
	const { user } = useUser();
	const router = useRouter();

	const handleDeleteQuiz = async () => {
		const response = await deleteQuiz(quiz.id);
		if (response && response.status === 200) {
			router.reload();
		}
	};
	return (
		<>
			<Card
				className={styles.quizCard}
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				sx={{ height: '100%' }}
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
						<Stack direction="column">
							<Typography variant="h5" gutterBottom>
								{quiz.title}
							</Typography>
							{quiz.summary && <Typography>{quiz.summary}</Typography>}
							{quiz.subtitle && (
								<Typography variant="subtitle1">{quiz.subtitle}</Typography>
							)}
						</Stack>
						{visible && user?.role.key === ROLE.ADMIN && (
							<Stack direction="row">
								<IconButton
									onClick={() => router.push(`/tests/manage/${quiz.id}`)}
									sx={{ height: '45px', width: '45px' }}
								>
									<EditIcon />
								</IconButton>
								<IconButton
									onClick={() => setIsDeleting(true)}
									sx={{ height: '45px', width: '45px' }}
								>
									<DeleteIcon />
								</IconButton>
							</Stack>
						)}
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
