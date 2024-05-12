import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ReactNode } from 'react';

import ErrorBoundaryClass from './ErrorBoundaryClass';

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
	const router = useRouter();
	const { enqueueSnackbar } = useSnackbar();

	return (
		<ErrorBoundaryClass router={router} enqueueSnackbar={enqueueSnackbar}>
			{children}
		</ErrorBoundaryClass>
	);
};

export default ErrorBoundary;
