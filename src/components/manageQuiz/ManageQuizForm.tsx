import { FormikErrors, useFormik } from 'formik';
import { CloudUploadIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

	const handleUploadMedia = useCallback(
		async (file: File) => {
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
		},
		[enqueueSnackbar, setFieldValue]
	);

	const handleRemoveImage = useCallback(() => {
		setMediaUrl(undefined);
		setFieldValue('mediaId', undefined);
	}, [setFieldValue]);

	useEffect(() => {
		if (router.isReady) {
			setQuizId(router.query.id as string);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		<div className={styles.quizForm}>
			<UploadMedia
				isOpen={uploadModal}
				onClose={() => setUploadModal(false)}
				handleSave={handleUploadMedia}
			/>
			<div className="flex flex-col gap-2 pb-2">
				<div className="flex items-center">
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
						<div className="h-24">
							<Image
								src={mediaUrl}
								alt="Quiz Image"
								width={100}
								height={100}
								style={{ marginLeft: '1rem' }}
							/>
							<Button
								className="relative top-[-100px] left-[80px] h-10 w-10"
								onClick={() => {
									handleRemoveImage();
								}}
								size="icon"
								variant="ghost"
							>
								<Trash2Icon className="stroke-red-500" />
							</Button>
						</div>
					) : (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setUploadModal(true)}
						>
							<CloudUploadIcon />
						</Button>
					)}
				</div>
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
				<p>Максимум балів: {totalScore}</p>
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
			</div>

			{!!hasError && (
				<p className="text-red-500 text-sm">Зaповність всі необхідні поля</p>
			)}
			{!values.questions.length ? (
				<Button
					onClick={() => {
						setValues(quizInitial);
					}}
					disabled={!!quizId}
					className="m-2 ml-3"
				>
					Додати питання
				</Button>
			) : values.questions.length === 1 ? (
				<p className="text-red-500 text-sm">Необхідно додати ще питання</p>
			) : (
				<Button onClick={() => submitForm()}>
					{quizId ? 'Оновити' : 'Створити'}
				</Button>
			)}
		</div>
	);
};

export default QuizForm;
