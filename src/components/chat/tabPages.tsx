// components/TabPages.tsx
import { Tab, Tabs } from '@mui/material';
import { useRouter } from 'next/router';

import useUser from '@/context/useUser';
import { ROLE } from '@/data/dto/user/userInfo';

interface TabPagesProps {
	selectedTab: number;
	setSelectedTab: (newValue: number) => void;
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
		value: index
	};
}

const TabPages = ({ selectedTab, setSelectedTab }: TabPagesProps) => {
	const router = useRouter();
	const { user } = useUser();
	const handleChange = (e: React.SyntheticEvent, newValue: number) => {
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
			router.replace(newRoute, undefined, { shallow: false });
		}
	};

	return (
		<Tabs
			value={selectedTab}
			onChange={handleChange}
			aria-label="chatroom tabs"
		>
			{user?.role.key === ROLE.USER && (
				<Tab label="ШІ асистенти" {...a11yProps(0)} sx={{ flex: 1 }} />
			)}
			{user?.role.key === ROLE.USER && (
				<Tab label="Терапевт" {...a11yProps(1)} sx={{ flex: 1 }} />
			)}
			{user?.role.key === ROLE.THERAPIST && (
				<Tab label="Клієнти" {...a11yProps(2)} sx={{ flex: 1 }} />
			)}
			{user?.role.key === ROLE.THERAPIST && (
				<Tab label="Запити" {...a11yProps(3)} sx={{ flex: 1 }} />
			)}
			{user?.role.key === ROLE.ADMIN && (
				<Tab label="Мої чати" {...a11yProps(4)} sx={{ flex: 1 }} />
			)}
			{user?.role.key === ROLE.ADMIN && (
				<Tab label="Всі чати" {...a11yProps(5)} sx={{ flex: 1 }} />
			)}
		</Tabs>
	);
};

export default TabPages;
