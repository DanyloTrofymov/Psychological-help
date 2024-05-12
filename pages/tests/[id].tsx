import React from 'react';

import { Layout } from '@/components/layout/Layout';
import PassTestPage from '@/pages/tests/PassTest.page';

const Tests = () => {
	return (
		<Layout title="Проходженння тесту">
			<PassTestPage />
		</Layout>
	);
};

export default Tests;
