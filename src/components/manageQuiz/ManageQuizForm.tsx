import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { FormikErrors, useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';

import { uploadFileToStorage } from '@/api/media.api';
import { createQuiz, getQuizById, updateQuiz } from '@/api/quiz.api';
import { Button } from '@/components/ui/button';
import { QuizQuestionRequest } from '@/data/dto/quiz/quiz.request';
import { QuizResponse } from '@/data/dto/quiz/quiz.response';
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
import { cn } from '@/lib/utils';

import UploadMedia from '../mediaUpload/mediaUpload';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
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
		return values.questions.reduce((totalScore, question) => {
			const maxAnswerScore = question.answers.reduce(
				(max, answer) => Math.max(max, answer.score),
				0
			);
			return totalScore + maxAnswerScore;
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
	const hasError = useMemo(() => {
		return (
			(!!errors.title ||
				!!errors.subtitle ||
				!!errors.summary ||
				!!errors?.questions?.length ||
				(errors?.questions as FormikErrors<QuizQuestionRequest>[])?.some(
					q => !!q?.answers?.length
				)) &&
			(!!touched.title ||
				!!touched.subtitle ||
				!!touched.summary ||
				!!touched?.questions?.length ||
				(touched?.questions as FormikErrors<QuizQuestionRequest>[])?.some(
					q => !!q?.answers?.length
				))
		);
	}, [errors, touched]);

	return (
		<Box onSubmit={submitForm} className={styles.quizForm}>
			<UploadMedia
				isOpen={uploadModal}
				onClose={() => setUploadModal(false)}
				handleSave={handleUploadMedia}
			/>
			<Stack direction="column" spacing={2} sx={{ pb: 2 }}>
				<Stack direction="row" alignItems={'center'}>
					<Input
						className={cn('w-full', styles.field)}
						name="title"
						placeholder="Назва"
						onChange={handleChange}
						onBlur={handleBlur('title')}
						value={values.title}
						error={touched.title && errors.title}
						required
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
				<Input
					className={styles.field}
					name="subtitle"
					placeholder="Опис"
					onBlur={handleBlur('subtitle')}
					onChange={handleChange}
					value={values.subtitle}
					error={touched.subtitle && errors.subtitle}
				/>

				<QuestionForm
					handleChange={handleChange}
					setFieldValue={setFieldValue}
					handleBlur={handleBlur}
					touched={touched}
					values={values}
					errors={errors}
				/>
				<Typography>Максимум балів: {totalScore}</Typography>
				<Textarea
					className="resize-none"
					name="summary"
					placeholder="Опис результатів"
					required
					onChange={handleChange}
					onBlur={handleBlur('summary')}
					value={values.summary}
					error={touched.summary ? errors.summary : ''}
				/>
			</Stack>

			{!!hasError && (
				<Typography sx={{ color: 'rgb(253, 54, 54)', fontSize: 14 }}>
					{'Зaповність всі необхідні поля'}
				</Typography>
			)}
			{!values.questions.length ? (
				<Button
					onClick={() => {
						setValues(quizInitial);
					}}
					disabled={!!quizId}
					variant={'secondary'}
					className="m-2 ml-3"
				>
					Додати питання
				</Button>
			) : values.questions.length === 1 ? (
				<Typography sx={{ color: 'rgb(253, 54, 54)', fontSize: 14 }}>
					{'Необхідно додати ще питання'}
				</Typography>
			) : (
				<Button onClick={() => submitForm()}>
					{quizId ? 'Оновити' : 'Створити'}
				</Button>
			)}
			{}
		</Box>
	);
};

export default QuizForm;
