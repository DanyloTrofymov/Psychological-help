import { Grid3X3Icon, LogOutIcon, MessageCircleIcon } from 'lucide-react';
import { useRouter } from 'next/router';

import useUser from '@/context/useUser';
import { ROLE } from '@/data/dto/user/userInfo';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
import styles from './navbar.module.scss';

const AccountMenu = ({
	anchorEl,
	onClose
}: {
	anchorEl: HTMLElement | null;
	onClose: () => void;
}) => {
	const router = useRouter();
	const { user, logout } = useUser();

	return (
		<DropdownMenu open={!!anchorEl} onOpenChange={open => !open && onClose()}>
			<DropdownMenuTrigger className="absolute right-0"></DropdownMenuTrigger>
			<DropdownMenuContent className="absolute right-0 top-6 w-[170px]">
				{user?.role && [ROLE.ADMIN, ROLE.USER].includes(user?.role.key) && (
					<DropdownMenuItem
						className={styles.listItem}
						onClick={() => router.push('/tests/overview')}
					>
						<Grid3X3Icon />
						<p className="text-wrap">Мої результати</p>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					className={styles.listItem}
					onClick={() => router.push('/chats')}
				>
					<MessageCircleIcon />
					<p className="text-wrap">Чати</p>
				</DropdownMenuItem>
				<DropdownMenuItem
					className={styles.listItem}
					onClick={() => {
						logout();
						onClose();
					}}
				>
					<LogOutIcon />
					<p className="text-wrap">Вихід</p>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AccountMenu;
