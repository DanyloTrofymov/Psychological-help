import React from 'react';

import { Layout } from '@/components/layout/Layout';
import HomePage from '@/pages/home/Home.page';

const Home = () => {
	//const { user } = useUser();

	return (
		<Layout title="Home" outerPage>
			<HomePage />
		</Layout>
	);
};

export default Home;
