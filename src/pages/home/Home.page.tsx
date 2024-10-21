import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';

import styles from './home.module.scss';

const HomePage = () => {
	//const { user } = useUser();
	const router = useRouter();
	return (
		<div>
			<Box className={styles.imageContainer}></Box>
			<Stack
				sx={{
					diasplay: 'flex',
					height: '100px',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<Button onClick={() => router.push('/tests')}>Перейти до тестів</Button>
			</Stack>
		</div>
	);
};

export default HomePage;
