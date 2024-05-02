import { AppProps } from 'next/app';
import { SnackbarProvider } from 'notistack';

import { UserContextProvider } from '@/context/useUser';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SnackbarProvider>
			<UserContextProvider>
				<Component {...pageProps} />
			</UserContextProvider>
		</SnackbarProvider>
	);
}

export default MyApp;
