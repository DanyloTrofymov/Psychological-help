import '../styles/colors.css';
import '../styles/globals.css';

import { ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';

import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary';
import { UserContextProvider } from '@/context/useUser';

import { lightTheme } from '../styles/mui.theme';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={lightTheme}>
			<SnackbarProvider>
				<ErrorBoundary>
					<UserContextProvider>
						<Component {...pageProps} />
					</UserContextProvider>
				</ErrorBoundary>
			</SnackbarProvider>
		</ThemeProvider>
	);
}

export default MyApp;
