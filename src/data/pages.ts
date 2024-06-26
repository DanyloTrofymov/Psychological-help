import { ROLE } from '@/data/dto/user/userInfo';

export const publicPages: PublicPages = {
	login: {
		route: '/',
		title: 'Home'
	},
	tests: {
		route: '/tests',
		title: 'Tests'
	}
};

export const privatePages: PrivatePages = {
	testStatistic: {
		route: '/tests/statistic',
		title: 'Tests',
		roles: [ROLE.ADMIN]
	},
	manageTests: {
		route: '/tests/manage',
		title: 'Tests',
		roles: [ROLE.ADMIN]
	},
	startTest: {
		route: '/tests[id]',
		title: 'Tests',
		roles: [ROLE.USER, ROLE.ADMIN]
	},
	chat: {
		route: '/chat',
		title: 'Chat',
		roles: [ROLE.USER, ROLE.THERAPIST, ROLE.ADMIN]
	}
};

export const pages = {
	...privatePages,
	...publicPages
} as Pages;

export type Page = PublicPage & {
	roles?: ROLE[];
};

export type PublicPage = {
	route: string;
	title: string;
};

export type PrivatePage = PublicPage & {
	roles: ROLE[];
};

export interface Pages {
	[key: string]: Page;
}

export interface PublicPages {
	[key: string]: PublicPage;
}

export interface PrivatePages {
	[key: string]: PrivatePage;
}

export type TabTypes = {
	[key: string]: Page[];
};

export function findPagesByRole(role: ROLE): Page[] {
	return Object.values(privatePages).filter(page => page.roles.includes(role));
}
