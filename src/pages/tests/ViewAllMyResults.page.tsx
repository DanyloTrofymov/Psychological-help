import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getMyTake } from '@/api/take.api';
import TakeCard from '@/components/takeCard/TakeCard';
import { TakeResponse } from '@/data/dto/take/take.response';

const QuizLayout = () => {
	const [takes, setTakes] = useState<TakeResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(0);

	const fetchTakes = useCallback(async () => {
		try {
			const response = await getMyTake(currentPage, 10);
			if (response && response.status === 200) {
				setTakes(prev => [...prev, ...response.data.content]);
			}
		} catch (error) {
			console.error(error);
		}
	}, [currentPage]);

	useEffect(() => {
		fetchTakes();
	}, [fetchTakes]);

	return (
		<div>
			<p className="text-2xl text-center text-gray-800 pb-2 font-semibold w-full">
				Мої результати
			</p>
			<InfiniteScroll
				dataLength={takes.length}
				next={() => setCurrentPage(currentPage + 1)}
				hasMore={true}
				loader={null}
				scrollableTarget="scrollableLayout"
			>
				<div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 mb-1">
					{takes.map(take => (
						<TakeCard key={take.id} take={take} />
					))}
				</div>
			</InfiniteScroll>
		</div>
	);
};

export default QuizLayout;
