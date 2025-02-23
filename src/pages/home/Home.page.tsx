import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';

import styles from './home.module.scss';

const HomePage = () => {
	//const { user } = useUser();
	const router = useRouter();
	return (
		<div>
			<div className={styles.imageContainer}></div>
			<div className="flex items-center justify-center h-24 w-full">
				<Button onClick={() => router.push('/tests')}>Перейти до тестів</Button>
			</div>
		</div>
	);
};

export default HomePage;
