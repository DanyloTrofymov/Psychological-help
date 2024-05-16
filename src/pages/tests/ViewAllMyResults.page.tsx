import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getMyTake } from '@/api/take.api';
import TakeCard from '@/components/takeCard/TakeCard';
import { TakeResponse } from '@/data/dto/take/take.response';

const QuizLayout = () => {
	const [takes, setTakes] = useState<TakeResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(0);

	const fetchTakes = async () => {
		try {
			const response = await getMyTake();
			if (response && response.status === 200) {
				setTakes(prev => [...prev, ...response.data]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchTakes();
	}, [currentPage]);

	return (
		<div>
			<Typography
				variant="h1"
				sx={{ justifySelf: 'center', fontSize: 30, color: '#213529', pb: 2 }}
			>
				{' '}
				Мої результати{' '}
			</Typography>
			<InfiniteScroll
				dataLength={takes.length}
				next={() => setCurrentPage(currentPage + 1)}
				hasMore={true}
				loader={null}
				scrollableTarget="scrollableLayout"
			>
				<Grid container spacing={2} sx={{ mb: 1 }}>
					{takes.map(take => (
						<Grid item key={take.id} xs={12} sm={6} md={4} lg={3}>
							<TakeCard take={take} />
						</Grid>
					))}
				</Grid>
			</InfiniteScroll>
		</div>
	);
};

export default QuizLayout;
