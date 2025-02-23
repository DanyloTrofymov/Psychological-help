import cn from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import useUser from '@/context/useUser';
import { privatePages, publicPages } from '@/data/pages';

import CenteredLoader from '../custom/CenteredLoader';
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

	const handleAccess = useCallback(async () => {
		if (!user) {
			setIsLoadingToCheckUser(false);
			return;
		}
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
	}, [user, router]);

	const checkUserPermission = useCallback(async () => {
		setIsLoadingToCheckUser(true);
		handleAccess();
	}, [handleAccess]);

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
		checkLinks();
	}, [checkLinks, user]);

	useEffect(() => {
		checkUserPermission();
	}, [checkUserPermission]);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Psycho help - {title}</title>
			</Head>
			<ErrorBoundary>
				<div>
					<main
						className={cn(styles.main, !outerPage && styles.mainInner)}
						id="scrollableLayout"
					>
						{isLoading || isLoadingToCheckUser ? <CenteredLoader /> : children}
					</main>
				</div>
			</ErrorBoundary>
		</>
	);
}
