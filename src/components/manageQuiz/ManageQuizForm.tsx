import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';

import { uploadFileToStorage } from '@/api/media/media.api';
import { createQuiz, getQuizById, updateQuiz } from '@/api/quiz/quiz';
import { QuizResponse } from '@/data/dto/quiz/quiz';
import { MediaResponse } from '@/data/dto/user/userInfo';
import { quizInitial } from '@/data/initialValues/quizInitial';
import {
	MESSAGE_TYPE,
	quizCreateError,
	quizCreateSuccess,
	quizUpdateError,
	quizUpdateSuccess,
	SOMETHING_WENT_WRONG,
	UPLOAD_MEDIA
} from '@/data/messageData';
import { QuizSchema } from '@/data/validation/quizValidation';

import Button from '../custom/Button';
import UploadMedia from '../mediaUpload/mediaUpload';
import QuestionForm from './ManageQuestionForm';
import styles from './quizForm.module.scss';

const QuizForm = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [uploadModal, setUploadModal] = useState<boolean>(false);
	const [quizId, setQuizId] = useState<string | undefined>(undefined);
	const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
	const router = useRouter();
	const handleManageQuiz = () => {
		if (quizId) {
			handleQuizUpdate();
		} else {
			handleQuizCreation();
		}
	};

	const handleQuizCreation = async () => {
		try {
			const response = await createQuiz(values);
			if (response && response.status === 201) {
				enqueueSnackbar(quizCreateSuccess, { variant: MESSAGE_TYPE.SUCCESS });
				router.push('/tests');
			} else {
				enqueueSnackbar(response?.data.error, { variant: MESSAGE_TYPE.ERROR });
			}
		} catch (e) {
			console.error(e);
			enqueueSnackbar(quizCreateError, { variant: MESSAGE_TYPE.ERROR });
		}
	};

	const handleQuizUpdate = async () => {
		if (!quizId) return;
		try {
			const response = await updateQuiz(quizId!, values);
			if (response && response.status === 200) {
				enqueueSnackbar(quizUpdateSuccess, { variant: MESSAGE_TYPE.SUCCESS });
				router.push('/tests');
			} else {
				enqueueSnackbar(response?.data.error, { variant: MESSAGE_TYPE.ERROR });
			}
		} catch (e) {
			console.error(e);
			enqueueSnackbar(quizUpdateError, { variant: MESSAGE_TYPE.ERROR });
		}
	};

	const {
		values,
		setFieldValue,
		submitForm,
		handleBlur,
		errors,
		setValues,
		handleChange,
		touched
	} = useFormik({
		initialValues: quizInitial,
		validationSchema: QuizSchema,
		validateOnChange: true,
		validateOnBlur: true,
		onSubmit: handleManageQuiz
	});

	const totalScore: number = useMemo(() => {
		return values.questions.reduce((acc, question) => {
			return (
				acc + question.answers.reduce((acc, answer) => acc + answer.score, 0)
			);
		}, 0);
	}, [values.questions]);

	const handleUploadMedia = async (file: File) => {
		if (file) {
			try {
				const response = await uploadFileToStorage(file);
				if (response && response.status === 201) {
					const media: MediaResponse = response.data;
					setFieldValue('mediaId', media.id);
					setMediaUrl(media.url);
					enqueueSnackbar(UPLOAD_MEDIA, {
						variant: MESSAGE_TYPE.SUCCESS
					});
				}
			} catch (e) {
				console.error(e);
				enqueueSnackbar(SOMETHING_WENT_WRONG, {
					variant: MESSAGE_TYPE.ERROR
				});
			}
		}
	};

	const handleRemoveImage = () => {
		setMediaUrl(undefined);
		setFieldValue('mediaId', undefined);
	};
	useEffect(() => {
		if (router.isReady) {
			setQuizId(router.query.id as string);
		}
	}, [router.isReady]);

	useEffect(() => {
		const fetchQuiz = async () => {
			try {
				const response = await getQuizById(quizId!);
				if (response && response.status === 200) {
					const quiz: QuizResponse = response.data;
					setValues(quiz);
				}
			} catch (e) {
				console.error(e);
				enqueueSnackbar(SOMETHING_WENT_WRONG, {
					variant: MESSAGE_TYPE.ERROR
				});
			}
		};

		if (quizId) {
			fetchQuiz();
		}
	}, [quizId]);
	return (
		<Box onSubmit={submitForm} className={styles.quizForm}>
			<UploadMedia
				isOpen={uploadModal}
				onClose={() => setUploadModal(false)}
				handleSave={handleUploadMedia}
			/>
			<Stack direction="column" spacing={2} sx={{ pb: 2 }}>
				<Stack direction="row" alignItems={'center'}>
					<TextField
						className={styles.field}
						name="title"
						label="Quiz Title"
						onChange={handleChange}
						onBlur={handleBlur('title')}
						sx={{ width: '100%' }}
						value={values.title}
						error={touched.title && Boolean(errors.title)}
						helperText={touched.title && errors.title}
					/>
					{mediaUrl ? (
						<Box height={100}>
							<Image
								src={mediaUrl}
								alt="Quiz Image"
								width={100}
								height={100}
								style={{ marginLeft: '1rem' }}
							/>
							<IconButton
								sx={{
									position: 'relative',
									top: '-100px',
									left: '80px',
									height: '35px',
									width: '35px'
								}}
								onClick={() => {
									handleRemoveImage();
								}}
							>
								<DeleteOutlineIcon sx={{ color: 'var(--red)' }} />
							</IconButton>
						</Box>
					) : (
						<IconButton
							sx={{ width: '56px', height: '56px' }}
							onClick={() => setUploadModal(true)}
						>
							<CloudUploadIcon />
						</IconButton>
					)}
				</Stack>
				<TextField
					className={styles.field}
					name="subtitle"
					label="Quiz Subtitle"
					onBlur={handleBlur('subtitle')}
					onChange={handleChange}
					value={values.subtitle}
					error={touched.subtitle && Boolean(errors.subtitle)}
					helperText={touched.subtitle && errors.subtitle}
				/>

				<QuestionForm
					handleChange={handleChange}
					setFieldValue={setFieldValue}
					handleBlur={handleBlur}
					touched={touched}
					values={values}
					errors={errors}
				/>
				<Typography>Total score: {totalScore}</Typography>
				<TextField
					className={styles.field}
					name="summary"
					label="Quiz Summary"
					onChange={handleChange}
					onBlur={handleBlur('summary')}
					value={values.summary}
					error={touched.summary && Boolean(errors.summary)}
					helperText={touched.summary ? errors.summary : ''}
				/>
			</Stack>

			{!values.questions.length ? (
				<Button
					onClick={() => {
						setValues(quizInitial);
					}}
					disabled={!!quizId}
					sx={{ m: 2, ml: 3 }}
				>
					Add Question
				</Button>
			) : values.questions.length === 1 ? (
				<Typography sx={{ color: 'rgb(253, 54, 54)', fontSize: 14, pl: 3 }}>
					{'Add at least 2 questions'}
				</Typography>
			) : (
				<Button variant="contained" onClick={() => submitForm()}>
					Submit Quiz
				</Button>
			)}
			{}
		</Box>
	);
};

export default QuizForm;
