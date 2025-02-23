import React, { useEffect } from 'react';

import { signIn } from '@/api/auth.api';
import useUser from '@/context/useUser';
import { BOT_NAME } from '@/data/apiConstants';

const TelegramLoginWidget = () => {
	const { setJwtTokens, user } = useUser();
	useEffect(() => {
		const signInUser = async (user: any) => {
			try {
				const response = await signIn(user);
				if (response && response.status === 201) {
					setJwtTokens(response.data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		(window as any).onTelegramAuth = (user: any) => {
			signInUser(user);
		};

		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-widget.js?22';
		script.async = true;
		script.dataset.telegramLogin = BOT_NAME;
		script.dataset.size = 'large';
		script.dataset.onauth = 'onTelegramAuth(user)';
		script.dataset.requestAccess = 'write';
		script.dataset.userpic = 'false';

		if (!user) {
			document.getElementById('telegramLogin')?.appendChild(script);
		} else {
			document.getElementById('telegram-login-psycological_help_bot')?.remove();
		}

		return () => {
			document.getElementById('telegram-login-psycological_help_bot')?.remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return <div id="telegramLogin" />;
};

export default TelegramLoginWidget;
