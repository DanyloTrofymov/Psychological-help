import TelegramLoginWidget from '@/components/telegramWidget/telegramWidget';
import useUser from '@/context/useUser';
import React, { use, useEffect, useState } from 'react';

const Home = () => {

  const { user } = useUser();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    console.log(user);
    if (user)
      setIsLoggingIn(true);
  }
    , [user]);

  return (
    <div>{!isLoggingIn ? <TelegramLoginWidget /> : "already logged in"}</div>
  );
};

export default Home;