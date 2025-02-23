import { FormikErrors, FormikTouched } from 'formik';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { QuizQuestionRequest, QuizRequest } from '@/data/dto/quiz/quiz.request';
import { cn } from '@/lib/utils';

import { Input } from '../ui/input';
import styles from './quizForm.module.scss';

const AnswerForm = ({
	question,
	handleChange,
	setFieldValue,
	questionIndex,
	errors,
	touched,
	handleBlur
}: {
	question: QuizQuestionRequest;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<void> | Promise<FormikErrors<QuizRequest>>;
	handleChange: (e: React.ChangeEvent<any>) => void;
	handleBlur: {
		(e: FocusEvent): void;
		<T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
	};
	questionIndex: number;
	errors: FormikErrors<QuizRequest>;
	touched: FormikTouched<QuizRequest>;
}) => {
	const router = useRouter();
	const [removingIndex, setRemovingIndex] = useState<number | null>(null);

	const handleAddAnswer = useCallback(() => {
		const newAnswer = { title: '', score: 0, mediaId: undefined };
		const updatedAnswers = [...question.answers, newAnswer];
		setFieldValue(`questions[${questionIndex}].answers`, updatedAnswers);
	}, [question.answers, questionIndex, setFieldValue]);

	const handleRemoveAnswer = useCallback(
		(index: number) => {
			setRemovingIndex(index);
			setTimeout(() => {
				setFieldValue(
					`questions[${questionIndex}].answers`,
					question.answers.filter((_, i) => i !== index)
				);
				setRemovingIndex(null);
			}, 300);
		},
		[question.answers, questionIndex, setFieldValue]
	);

	return (
		<div className="flex flex-col bg-gray-200 rounded-md">
			{question.answers.map((answer, idx) => (
				// eslint-disable-next-line react/jsx-no-undef
				<div
					className={cn(
						styles.animatedItem,
						removingIndex === idx ? styles.deletingItem : '',
						'flex flex-col pt-2 pl-4 pr-4 mt-1 rounded-md gap-4'
					)}
					key={idx}
				>
					<div className="flex flex-row items-start gap-2 pb-2">
						<Input
							name={`questions[${questionIndex}].answers[${idx}].title`}
							placeholder="Текст відповіді"
							placeholderTransparent
							onChange={handleChange}
							required
							value={question.answers[idx].title}
							className="w-full"
							onBlur={handleBlur(
								`questions[${questionIndex}].answers[${idx}].title`
							)}
							error={
								touched?.questions &&
								touched?.questions[questionIndex] &&
								touched?.questions[questionIndex]?.answers &&
								touched?.questions[questionIndex]?.answers?.length &&
								(touched?.questions[questionIndex] as any)?.answers[idx]
									?.title &&
								errors?.questions &&
								errors?.questions[questionIndex] &&
								(errors?.questions[questionIndex] as any)?.answers &&
								(errors?.questions[questionIndex] as any).answers?.length &&
								(errors?.questions[questionIndex] as any)?.answers[idx]?.title
							}
						/>
						<Input
							type="number"
							name={`questions[${questionIndex}].answers[${idx}].score`}
							placeholder="Бали"
							required
							onChange={handleChange}
							value={question.answers[idx].score}
							className="w-20"
							error={
								touched?.questions &&
								touched?.questions[questionIndex] &&
								touched?.questions[questionIndex]?.answers &&
								touched?.questions[questionIndex]?.answers?.length &&
								(touched?.questions[questionIndex] as any)?.answers[idx]
									?.score &&
								Boolean(
									errors?.questions &&
										errors?.questions[questionIndex] &&
										(errors?.questions[questionIndex] as any)?.answers &&
										(errors?.questions[questionIndex] as any).answers?.length &&
										(errors?.questions[questionIndex] as any)?.answers[idx]
											?.score
								)
							}
						/>
						{!router.query.id && (
							<div className="pt-1">
								<Button
									onClick={() => handleRemoveAnswer(idx)}
									variant="ghost"
									size="icon"
									className="h-10 w-10"
								>
									<Trash2Icon />
								</Button>
							</div>
						)}
					</div>
				</div>
			))}
			{!router.query.id && (
				<Button onClick={() => handleAddAnswer()} className="m-2 mt-0 w-max">
					Додати відповідь
				</Button>
			)}
		</div>
	);
};

export default AnswerForm;
