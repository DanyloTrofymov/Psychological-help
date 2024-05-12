import React from 'react';

import { Layout } from '@/components/layout/Layout';
import ViewTestPage from '@/pages/tests/ViewTest.page';

const Tests = () => {
	return (
		<Layout title="Результати тесту">
			<ViewTestPage />
		</Layout>
	);
};

export default Tests;
