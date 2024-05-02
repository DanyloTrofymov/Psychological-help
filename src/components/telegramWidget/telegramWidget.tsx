import { signIn } from '@/api/auth/auth.api';
import useUser from '@/context/useUser';
import React, { useEffect } from 'react';

const TelegramLoginWidget = () => {
  const { setJwtTokens, user } = useUser();
  useEffect(() => {
    const signInUser = async (user: any) => {
      try {
        const response = await signIn(user);
        if (response) {
          setJwtTokens(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
    (window as any).onTelegramAuth = (user: any) => {
      alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
      console.log(user);
      signInUser(user);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.dataset.telegramLogin = 'psycological_help_bot';
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
  }, [user]);

  return (
    // You'll likely replace this with the actual UI button for the widget
    <div id='telegramLogin' />
  );
};

export default TelegramLoginWidget;
