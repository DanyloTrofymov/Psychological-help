import { Paper } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { getStatistic } from '@/api/quiz.api';
import { MESSAGE_TYPE, SOMETHING_WENT_WRONG } from '@/data/messageData';

const QuizStatistic = () => {
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState<any>(null);
	useEffect(() => {
		const fetch = async () => {
			const response: any = await getStatistic(router.query.id as string);
			if (response && response.status === 200) {
				setData(response.data);
			} else {
				enqueueSnackbar(SOMETHING_WENT_WRONG, { variant: MESSAGE_TYPE.ERROR });
			}
		};
		if (router.query.id) {
			fetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id]);

	return (
		<div className="flex flex-col">
			{data && (
				<Paper
					sx={{
						width: 'max-content',
						alignSelf: 'center',
						p: 3,
						boxShadow: '2px, 2px, 4px, rgba(0, 0, 0, 0.1)',
						display: 'flex',
						flexDirection: 'column'
					}}
				>
					<h1 className="self-center">Статистика тесту {data.quizTitle}</h1>
					<h2>Лінійний графік графік</h2>
					{data.scoreBins.length > 2 ? (
						<LineChart
							dataset={data.answerCounts}
							xAxis={[
								{
									data: data.scoreBins.map((item: any) => item.scoreMin)
								}
							]}
							series={[
								{
									data: data.scoreBins.map((item: any) => item.count),
									label: 'Бали'
								}
							]}
							width={600}
							height={300}
						/>
					) : (
						<p>Недостаньо даних для побудови лінійного графіку</p>
					)}
					<h2>Гістограма відповідей</h2>
					{data.answerCounts.map((item: any) => (
						<>
							<h3>{item.questionTitle}</h3>
							<BarChart
								xAxis={[{ scaleType: 'band', data: [item.questionTitle] }]}
								series={item.counts?.map((count: any) => {
									return { data: [count.count], label: count.answerTitle };
								})}
								width={600}
								height={300}
							/>
						</>
					))}
				</Paper>
			)}
		</div>
	);
};

export default QuizStatistic;
