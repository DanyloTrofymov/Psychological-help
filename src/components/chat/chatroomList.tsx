// components/ChatRoomList.tsx
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, List, ListItem, ListItemButton, Stack } from '@mui/material';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { deleteChatroom, renameChatroom } from '@/api/chatroom.api';
import useUser from '@/context/useUser';
import { ChatroomResponse } from '@/data/dto/chat/chat.response';
import { ROLE } from '@/data/dto/user/userInfo';

import styles from './chat.module.scss';
import RenamePopup from './renamePopup';
import TabPages from './tabPages';

interface ChatRoomListProps {
	chatrooms: ChatroomResponse[];
	currentChatroom: ChatroomResponse | null;
	setChatrooms: Dispatch<SetStateAction<ChatroomResponse[]>>;
	setCurrentChatroom: (chatroom: ChatroomResponse | null) => void;
	tab: number;
	setTab: (tab: number) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
}

const ChatRoomList = ({
	chatrooms,
	setChatrooms,
	currentChatroom,
	setCurrentChatroom,
	setTab,
	tab,
	currentPage,
	setCurrentPage
}: ChatRoomListProps) => {
	const router = useRouter();
	const { socket } = useUser();
	const [renameData, setRenameData] = useState<{
		anchorEl: HTMLElement;
		id: number;
		title: string;
	} | null>(null);
	const { user } = useUser();
	useEffect(() => {
		if (router.isReady && socket) {
			socket.on('chatroomDetails', (chatroomDetails: ChatroomResponse) => {
				setCurrentChatroom(chatroomDetails);
				setChatrooms((prev: ChatroomResponse[]) => [chatroomDetails, ...prev]);
			});
		}

		return () => {
			if (socket) {
				socket.off('chatroomDetails');
			}
		};
	}, [router.isReady, socket]);

	const handleCreateChatroom = async () => {
		if (!socket) return;
		tab === 0 && socket.emit('AICreateChatroom');
		tab === 1 && socket.emit('createChatroom');
	};

	const handleRename = (name: string) => {
		if (!renameData?.id) return;
		const index = chatrooms.findIndex(room => room.id === renameData?.id);
		chatrooms[index].title = name;
		renameChatroom(renameData?.id, name);
		setRenameData(null);
	};

	const handleDeleteChatroom = (id: number) => {
		if (currentChatroom?.id == id) {
			setCurrentChatroom(null);
		}
		deleteChatroom(id);
		setChatrooms(chatrooms.filter(room => room.id !== id));
		setRenameData(null);
	};

	const handlePagination = () => {
		setCurrentPage(currentPage + 1);
	};

	return (
		<>
			<TabPages selectedTab={tab} setSelectedTab={setTab} />
			<RenamePopup
				anchorEl={renameData?.anchorEl}
				currentName={renameData?.title || ''}
				onClose={() => setRenameData(null)}
				onSubmit={handleRename}
			/>
			{[0, 1].includes(tab) && (
				<ListItemButton
					onClick={handleCreateChatroom}
					color="primary"
					sx={{
						justifyContent: 'flex-start !important',
						backgroundColor: 'var(--green)',
						'&: hover': {
							backgroundColor: 'var(--green-hover) !important'
						}
					}}
					className={cn(styles.listItem)}
				>
					<AddIcon />
					{tab === 0
						? 'Створити чат з асистентом'
						: 'Створити чат з терапевтом'}
				</ListItemButton>
			)}
			<List
				dense
				sx={{
					height: '100%',
					overflow: 'auto',
					maxHeight: 'calc(100vh - 215px)'
				}}
				id="infiniteList"
			>
				<InfiniteScroll
					hasMore={true}
					dataLength={chatrooms.length}
					next={handlePagination}
					loader={null}
					scrollableTarget="infiniteList"
				>
					{chatrooms?.map(room => (
						<ListItem
							onClick={() => setCurrentChatroom(room)}
							disablePadding
							key={room.id}
							className={cn(styles.listItem, {
								[styles.active]: currentChatroom?.id === room.id
							})}
						>
							{room.title}
							<Stack direction="row">
								{user && [ROLE.USER, ROLE.ADMIN].includes(user?.role.key) && (
									<Box
										onClick={e =>
											setRenameData({
												anchorEl: e.currentTarget,
												id: room.id,
												title: room.title
											})
										}
									>
										<EditIcon className={styles.listIcon} />
									</Box>
								)}
								<Box onClick={() => handleDeleteChatroom(room.id)}>
									<DeleteIcon className={styles.listIcon} />
								</Box>
							</Stack>
						</ListItem>
					))}
				</InfiniteScroll>
			</List>
		</>
	);
};

export default ChatRoomList;
