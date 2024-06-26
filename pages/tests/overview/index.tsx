import React from 'react';

import { Layout } from '@/components/layout/Layout';
import ViewAllMyTestsPage from '@/pages/tests/ViewAllMyResults.page';

const Tests = () => {
	return (
		<Layout title="Результати тестів">
			<ViewAllMyTestsPage />
		</Layout>
	);
};

export default Tests;
