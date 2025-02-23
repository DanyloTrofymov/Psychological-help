// components/ChatRoomList.tsx
import cn from 'classnames';
import { CirclePlusIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { deleteChatroom, renameChatroom } from '@/api/chatroom.api';
import useUser from '@/context/useUser';
import { ChatroomResponse } from '@/data/dto/chat/chat.response';
import { ROLE } from '@/data/dto/user/userInfo';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import styles from './chat.module.scss';

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
	// setTab,
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
	const inputRef = useRef<HTMLInputElement | null>(null);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady, socket]);

	useEffect(() => {
		if (renameData?.id && inputRef.current) {
			inputRef.current.focus();
		}
	}, [renameData]);

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
			{/* <TabPages selectedTab={tab} setSelectedTab={setTab} /> */}
			{[0, 1].includes(tab) && (
				<Button
					variant="ghost"
					size="icon"
					onClick={handleCreateChatroom}
					color="primary"
					className={cn('!justify-start rounded-md', styles.listItem)}
				>
					<CirclePlusIcon />
					{tab === 0
						? 'Створити чат з асистентом'
						: 'Створити чат з терапевтом'}
				</Button>
			)}
			<div
				className="flex flex-col h-full overflow-auto max-h-[calc(100vh-215px)]"
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
						<Button
							onClick={() => setCurrentChatroom(room)}
							key={room.id}
							className={cn(
								styles.listItem,
								'bg-transparent text-gray-700 w-full',
								{
									[styles.active]: currentChatroom?.id === room.id
								}
							)}
						>
							{renameData?.id === room.id ? (
								<Input
									ref={inputRef}
									value={renameData.title}
									onChange={e =>
										setRenameData({ ...renameData, title: e.target.value })
									}
									onBlur={() => handleRename(renameData?.title || '')}
								/>
							) : (
								<>{room.title}</>
							)}

							<div className="flex">
								{user && [ROLE.USER, ROLE.ADMIN].includes(user?.role.key) && (
									<Button
										variant="ghost"
										size="icon"
										onClick={e =>
											setRenameData({
												anchorEl: e.currentTarget,
												id: room.id,
												title: room.title
											})
										}
									>
										<PencilIcon />
									</Button>
								)}
								{[0, 1, 4, 5].includes(tab) && (
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDeleteChatroom(room.id)}
									>
										<Trash2Icon />
									</Button>
								)}
							</div>
						</Button>
					))}
				</InfiniteScroll>
			</div>
		</>
	);
};

export default ChatRoomList;
