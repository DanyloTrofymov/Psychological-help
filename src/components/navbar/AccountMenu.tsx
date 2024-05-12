import LogoutIcon from '@mui/icons-material/Logout';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import {
	ClickAwayListener,
	List,
	ListItem,
	Popper,
	Typography
} from '@mui/material';
import { useRouter } from 'next/router';

import useUser from '@/context/useUser';

import styles from './navbar.module.scss';

const AccountMenu = ({
	anchorEl,
	onClose
}: {
	anchorEl: HTMLElement | null;
	onClose: () => void;
}) => {
	const router = useRouter();
	const { logout } = useUser();

	return (
		<Popper open={!!anchorEl} anchorEl={anchorEl} placement="bottom-end">
			<ClickAwayListener onClickAway={onClose}>
				<List sx={{ borderRadius: '5px', mt: 1, width: '200px' }}>
					<ListItem
						className={styles.listItem}
						onClick={() => router.push('/tests/overview')}
					>
						<ViewModuleIcon />
						<Typography>Мої тести</Typography>
					</ListItem>
					<ListItem
						className={styles.listItem}
						onClick={() => {
							logout();
							onClose();
						}}
					>
						<LogoutIcon />
						<Typography>Вихід</Typography>
					</ListItem>
				</List>
			</ClickAwayListener>
		</Popper>
	);
};

export default AccountMenu;
