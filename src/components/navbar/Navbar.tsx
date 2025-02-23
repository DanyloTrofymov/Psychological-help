import axios from 'axios';
import { UserRoundIcon } from 'lucide-react';
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
	const ref = useRef<HTMLDivElement>(null);
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
		<div className={styles.navbar}>
			<AccountMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
			<div
				className="ml-2 cursor-pointer w-20 h-20"
				onClick={() => router.push('/')}
			>
				<Image src={'/logo-white.svg'} alt="logo" width={70} height={70} />
			</div>
			<p className="justify-self-center text-2xl hidden md:block">
				Час подбати про себе. Почніть піклуватися про своє здоров&apos;я вже
				зараз.
			</p>
			<div className="justify-self-end mr-2" ref={ref}>
				{!isLoggingIn ? (
					<TelegramLoginWidget />
				) : (
					<div
						className={styles.accountContainer}
						onClick={e => setAnchorEl(e.currentTarget)}
					>
						<div className="flex relative h-8 w-8 mr-2 bg-slate-300 text-white rounded-full justify-center items-center">
							{isPictureAvailable && user?.avatar?.url ? (
								<Image
									src={
										isPictureAvailable && user?.avatar?.url
											? user?.avatar?.url
											: ''
									}
									alt="avatar"
									className=""
									layout="fill"
								/>
							) : (
								<UserRoundIcon />
							)}
						</div>
						<p>{user?.name}</p>
					</div>
				)}
			</div>
		</div>
	);
}
