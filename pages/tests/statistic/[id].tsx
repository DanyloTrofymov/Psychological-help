import React from 'react';

import { Layout } from '@/components/layout/Layout';
import QuizStatistic from '@/pages/tests/TestStatistics.page';

const Tests = () => {
	return (
		<Layout title="Статистика">
			<QuizStatistic />
		</Layout>
	);
};

export default Tests;
