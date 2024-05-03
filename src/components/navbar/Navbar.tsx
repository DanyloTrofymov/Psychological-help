import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import useUser from '@/context/useUser';

import TelegramLoginWidget from '../telegramWidget/TelegramWidget';
import styles from './navbar.module.scss';

export function Navbar(): JSX.Element {
	const { user } = useUser();
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [isPictureAvailable, setIsPictureAvailable] = useState(false);
	const ref = useRef<HTMLElement>(null);
	useEffect(() => {
		const fetchPicture = async () => {
			if (user) {
				try {
					await axios.get(user.Avatar.url);
					setIsPictureAvailable(true);
				} catch (error) {
					console.error(error);
				}
			}
		};
		if (user) {
			setIsLoggingIn(true);
			fetchPicture();
		}
	}, [user]);

	return (
		<Box className={styles.navbar}>
			<Box sx={{ width: ref?.current?.clientWidth, ml: 1 }}>
				<Avatar className={styles.logo}>
					<Image src={'/logo.svg'} alt="logo" width={70} height={70} />
				</Avatar>
			</Box>
			<Typography variant="h1" sx={{ justifySelf: 'center' }}>
				Час подбати про себе. Почніть піклуватися про своє здоров&apos;я вже
				зараз.
			</Typography>
			<Box sx={{ justifySelf: 'flex-end', mr: 1 }} ref={ref}>
				{!isLoggingIn ? (
					<TelegramLoginWidget />
				) : (
					<Stack direction="row" className={styles.accountContainer}>
						<Avatar
							src={isPictureAvailable ? user?.Avatar?.url : undefined}
							sx={{
								backgroundColor: 'var(--light-gray)',
								color: 'white',
								mr: 1,
								height: 30,
								width: 30
							}}
						>
							<PersonIcon />
						</Avatar>
						<Typography>{user?.name}</Typography>
					</Stack>
				)}
			</Box>
		</Box>
	);
}
