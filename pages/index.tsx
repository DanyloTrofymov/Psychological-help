import React, { useEffect, useState } from 'react';

import TelegramLoginWidget from '@/components/telegramWidget/telegramWidget';
import useUser from '@/context/useUser';

const Home = () => {
	const { user } = useUser();
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	useEffect(() => {
		if (user) setIsLoggingIn(true);
	}, [user]);

	return (
		<div>{!isLoggingIn ? <TelegramLoginWidget /> : 'already logged in'}</div>
	);
};

export default Home;
