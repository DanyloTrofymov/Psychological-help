import React from 'react';

import { Layout } from '@/components/layout/Layout';
import ManageTestPage from '@/pages/tests/ManageTest.page';

const Tests = () => {
	return (
		<Layout title="Редагувати тест">
			<ManageTestPage />
		</Layout>
	);
};

export default Tests;
