import React from 'react';

import { Layout } from '@/components/layout/Layout';
import TestsPage from '@/pages/tests/Tests.page';

const Tests = () => {
	return (
		<Layout title="Тести">
			<TestsPage />
		</Layout>
	);
};

export default Tests;
