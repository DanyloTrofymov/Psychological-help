import '../styles/colors.css';
import '../styles/globals.css';

import { ThemeProvider, useMediaQuery } from '@mui/material';
import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';
import { useEffect, useState } from 'react';

import { UserContextProvider } from '@/context/useUser';

import { darkTheme, lightTheme } from '../styles/mui.theme';

function MyApp({ Component, pageProps }: AppProps) {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const [theme, setTheme] = useState(prefersDarkMode ? darkTheme : lightTheme);

	useEffect(() => {
		setTheme(prefersDarkMode ? darkTheme : lightTheme);
	}, [prefersDarkMode]);

	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider>
				<UserContextProvider>
					<Component {...pageProps} />
				</UserContextProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
}

export default MyApp;
