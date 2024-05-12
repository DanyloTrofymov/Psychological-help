import { CircularProgress, Stack } from '@mui/material';
import cn from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import useUser from '@/context/useUser';
import { privatePages, publicPages } from '@/data/pages';

import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import { ILayout } from './layout.interfaces';
import styles from './layout.module.scss';

export function Layout({
	children,
	title,
	outerPage = false
}: ILayout): JSX.Element {
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingToCheckUser, setIsLoadingToCheckUser] =
		useState<boolean>(false);
	const router = useRouter();
	const { user } = useUser();

	const checkUserPermission = async () => {
		setIsLoadingToCheckUser(true);
		handleAccess();
	};

	const handleAccess = async () => {
		if (!user) return;
		const key = Object.keys(privatePages).find(key => {
			const page = privatePages[key];
			return router.pathname.includes(page.route);
		});

		if (key) {
			const page = privatePages[key];
			if (!page.roles.includes(user.role.key)) {
				await router.replace('/');
				return;
			}
		}
		setIsLoadingToCheckUser(false);
	};

	const checkLinks = useCallback(() => {
		const isPublicPage = Object.values(publicPages).some(
			page => router.pathname === page.route
		);
		if (!isPublicPage && !user) {
			router.replace('/');
		} else {
			setIsLoading(false);
		}
	}, [router, user]);

	useEffect(() => {
		if (!user) return;
		checkLinks();
	}, [checkLinks, user]);

	useEffect(() => {
		if (!user) return;
		checkUserPermission();
	}, [checkUserPermission, user]);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Psycho help - {title}</title>
			</Head>
			<ErrorBoundary>
				<div>
					<main className={cn(styles.main, !outerPage && styles.mainInner)}>
						{isLoading || isLoadingToCheckUser ? (
							<Stack
								direction="row"
								sx={{
									height: 'calc(100% - 64px)',
									justifyContent: 'center'
								}}
							>
								<Stack
									sx={{
										justifyContent: 'center',
										alignItems: 'center'
									}}
								>
									<CircularProgress />
								</Stack>
							</Stack>
						) : (
							children
						)}
					</main>
				</div>
			</ErrorBoundary>
		</>
	);
}
