import '../styles/colors.css';
import '../styles/globals.css';

import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';

import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary';
import { UserContextProvider } from '@/context/useUser';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SnackbarProvider>
			<ErrorBoundary>
				<UserContextProvider>
					<Component {...pageProps} />
				</UserContextProvider>
			</ErrorBoundary>
		</SnackbarProvider>
	);
}

export default MyApp;
