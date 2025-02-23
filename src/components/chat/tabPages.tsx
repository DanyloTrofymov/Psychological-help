// components/TabPages.tsx
import { useRouter } from 'next/router';

import useUser from '@/context/useUser';
import { ROLE } from '@/data/dto/user/userInfo';

import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface TabPagesProps {
	selectedTab: number;
	setSelectedTab: (newValue: number) => void;
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
		value: index.toString()
	};
}

const TabPages = ({ selectedTab, setSelectedTab }: TabPagesProps) => {
	const router = useRouter();
	const { user } = useUser();
	const handleChange = (value: string) => {
		const newValue = parseInt(value);
		setSelectedTab(newValue);
		if (router.isReady) {
			let newRoute = '';
			switch (newValue) {
				case 0:
					newRoute = '/chats/ai';
					break;
				case 1:
					newRoute = '/chats/therapist';
					break;
				case 2:
					newRoute = '/chats/clients';
					break;
				case 3:
					newRoute = '/chats/requests';
					break;
				case 4:
					newRoute = '/chats/my';
					break;
				case 5:
					newRoute = '/chats/all';
					break;
			}
			router.replace(newRoute, undefined, { shallow: true });
		}
	};

	return (
		<Tabs
			value={selectedTab.toString()}
			onValueChange={handleChange}
			aria-label="chatroom tabs"
		>
			<TabsList className="grid w-full grid-cols-2">
				{user?.role.key === ROLE.USER && (
					<TabsTrigger {...a11yProps(0)} className="flex-1">
						ШІ асистенти
					</TabsTrigger>
				)}
				{user?.role.key === ROLE.USER && (
					<TabsTrigger {...a11yProps(1)} className="flex-1">
						Терапевт
					</TabsTrigger>
				)}
				{user?.role.key === ROLE.THERAPIST && (
					<TabsTrigger {...a11yProps(2)} className="flex-1">
						Клієнти
					</TabsTrigger>
				)}
				{user?.role.key === ROLE.THERAPIST && (
					<TabsTrigger {...a11yProps(3)} className="flex-1">
						Запити
					</TabsTrigger>
				)}
				{user?.role.key === ROLE.ADMIN && (
					<TabsTrigger {...a11yProps(4)} className="flex-1">
						Мої чати
					</TabsTrigger>
				)}
				{user?.role.key === ROLE.ADMIN && (
					<TabsTrigger {...a11yProps(5)} className="flex-1">
						Всі чати
					</TabsTrigger>
				)}
			</TabsList>
		</Tabs>
	);
};

export default TabPages;
