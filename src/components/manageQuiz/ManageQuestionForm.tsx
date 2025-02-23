import { FormikErrors, FormikTouched } from 'formik/dist/types';
import { CopyIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { QuizRequest } from '@/data/dto/quiz/quiz.request';
import { cn } from '@/lib/utils';

import { Input } from '../ui/input';
import AnswerForm from './ManageAnswerForm';
import styles from './quizForm.module.scss';

const QuestionForm = ({
	values,
	setFieldValue,
	handleChange,
	handleBlur,
	touched,
	errors
}: {
	values: QuizRequest;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean | undefined
	) => Promise<void> | Promise<FormikErrors<QuizRequest>>;
	handleChange: (e: React.ChangeEvent<any>) => void;
	errors: FormikErrors<QuizRequest>;
	touched: FormikTouched<QuizRequest>;
	handleBlur: {
		(e: FocusEvent): void;
		<T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
	};
}) => {
	const router = useRouter();
	const [removingIndex, setRemovingIndex] = useState<number | null>(null);

	const handleAddQuestion = useCallback(
		(index: number) => {
			const newQuestions = [
				...values.questions.slice(0, index + 1),
				{
					title: '',
					subtitle: '',
					answers: [
						{ title: '', score: 0, mediaId: undefined },
						{ title: '', score: 0, mediaId: undefined }
					]
				},
				...values.questions.slice(index + 1)
			];
			setFieldValue('questions', newQuestions);
		},
		[values.questions, setFieldValue]
	);

	const handleCloneQuestion = useCallback(
		(index: number) => {
			const newQuestions = [
				...values.questions.slice(0, index + 1),
				{
					title: values.questions[index].title,
					subtitle: values.questions[index].subtitle,
					answers: values.questions[index].answers
				},
				...values.questions.slice(index + 1)
			];
			setFieldValue('questions', newQuestions);
		},
		[values.questions, setFieldValue]
	);

	const handleRemoveQuestion = useCallback(
		(index: number) => {
			setRemovingIndex(index);
			setTimeout(() => {
				setFieldValue(
					'questions',
					values.questions.filter((_, i) => i !== index)
				);
				setRemovingIndex(null);
			}, 300);
		},
		[values.questions, setFieldValue]
	);

	return (
		<div className="flex flex-col gap-4">
			{values.questions.map((question, index) => (
				<div
					key={index}
					className={cn(
						styles.animatedItem,
						removingIndex === index ? styles.deletingItem : '',
						'flex flex-col p-2 mt-1 rounded-md bg-gray-100 gap-4'
					)}
				>
					<Input
						name={`questions[${index}].title`}
						placeholder="Заголовок"
						placeholderTransparent
						required
						onBlur={handleBlur(`questions[${index}].title`)}
						onChange={handleChange}
						value={values.questions[index].title}
						error={
							touched?.questions &&
							touched?.questions[index]?.title &&
							errors.questions &&
							((errors.questions[index] as any)?.title as string)
						}
					/>
					<Input
						name={`questions[${index}].subtitle`}
						placeholder="Підзаголовок"
						placeholderTransparent
						onChange={handleChange}
						onBlur={handleBlur(`questions[${index}].subtitle`)}
						value={values.questions[index].subtitle}
						error={
							touched?.questions &&
							touched?.questions[index] &&
							errors.questions
								? ((errors.questions[index] as any)?.subtitle as string)
								: ''
						}
					/>
					<AnswerForm
						handleBlur={handleBlur}
						question={question}
						questionIndex={index}
						handleChange={handleChange}
						setFieldValue={setFieldValue}
						touched={touched}
						errors={errors}
					/>
					{values.questions[index].answers.length < 2 && (
						<p className="text-red-500 text-sm pl-3">
							Додайте мінімум 2 запитання
						</p>
					)}
					<div className="flex justify-between gap-2">
						{!router.query.id && (
							<>
								<Button
									onClick={() => {
										handleAddQuestion(index);
									}}
									className="m-2"
								>
									Додати запитання
								</Button>
								<div className="flex gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => {
											handleCloneQuestion(index);
										}}
									>
										<CopyIcon />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => {
											handleRemoveQuestion(index);
										}}
									>
										<Trash2Icon />
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default QuestionForm;
