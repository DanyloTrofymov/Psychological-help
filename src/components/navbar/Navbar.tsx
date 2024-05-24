import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Stack, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import useUser from '@/context/useUser';

import TelegramLoginWidget from '../telegramWidget/TelegramWidget';
import AccountMenu from './AccountMenu';
import styles from './navbar.module.scss';

export function Navbar(): JSX.Element {
	const { user } = useUser();
	const router = useRouter();
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [isPictureAvailable, setIsPictureAvailable] = useState(false);
	const ref = useRef<HTMLElement>(null);
	const smallScreen = useMediaQuery('(max-width: 560px)');
	useEffect(() => {
		const fetchPicture = async () => {
			if (user) {
				try {
					await axios.get(user.avatar.url);
					setIsPictureAvailable(true);
				} catch (error) {
					setIsPictureAvailable(false);
				}
			}
		};
		if (user) {
			setIsLoggingIn(true);
			fetchPicture();
		} else {
			setIsLoggingIn(false);
		}
	}, [user]);

	return (
		<Box className={styles.navbar}>
			<AccountMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
			<Box
				sx={{ ml: 1, cursor: 'pointer', width: '70px', height: '70px' }}
				onClick={() => router.push('/')}
			>
				<Image src={'/logo-white.svg'} alt="logo" width={70} height={70} />
			</Box>
			{!smallScreen && (
				<Typography variant="h1" sx={{ justifySelf: 'center' }}>
					Час подбати про себе. Почніть піклуватися про своє здоров&apos;я вже
					зараз.
				</Typography>
			)}
			<Box sx={{ justifySelf: 'flex-end', mr: 1 }} ref={ref}>
				{!isLoggingIn ? (
					<TelegramLoginWidget />
				) : (
					<Stack
						direction="row"
						className={styles.accountContainer}
						onClick={e => setAnchorEl(e.currentTarget)}
					>
						<Avatar
							src={isPictureAvailable ? user?.avatar?.url : undefined}
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
