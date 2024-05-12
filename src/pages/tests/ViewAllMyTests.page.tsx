import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';

import { getMyTake } from '@/api/take/take';
import TakeCard from '@/components/takeCard/TakeCard';
import { TakeResponse } from '@/data/dto/take/take';

const QuizLayout = () => {
	const [takes, setTakes] = useState<TakeResponse[]>([]);
	useEffect(() => {
		const fetchQuizzes = async () => {
			try {
				const response = await getMyTake();
				if (response && response.status === 200) {
					setTakes(response.data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchQuizzes();
	}, []);

	return (
		<div>
			<Grid container spacing={2}>
				{takes.map(take => (
					<Grid item key={take.id} xs={12} sm={6} md={4} lg={3}>
						<TakeCard take={take} />
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default QuizLayout;
