// components/ChatRoomList.tsx
import cn from 'classnames';
import {
	CirclePlusIcon,
	EllipsisVerticalIcon,
	MenuIcon,
	PencilIcon,
	Trash2Icon,
	XIcon
} from 'lucide-react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { deleteChatroom, renameChatroom } from '@/api/chatroom.api';
import useUser from '@/context/useUser';
import { ChatroomResponse } from '@/data/dto/chat/chat.response';
import { ROLE } from '@/data/dto/user/userInfo';

import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu';
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
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
		setIsSidebarOpen(false);
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

	const renderSidebarContent = () => {
		return (
			<div className="flex flex-col h-full">
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
								onClick={() => {
									setCurrentChatroom(room);
									setIsSidebarOpen(false);
								}}
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
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<EllipsisVerticalIcon />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{user &&
												[ROLE.USER, ROLE.ADMIN].includes(user?.role.key) && (
													<DropdownMenuItem
														onClick={e => {
															setRenameData({
																anchorEl: e.currentTarget,
																id: room.id,
																title: room.title
															});
														}}
													>
														<PencilIcon />
														Переіменувати
													</DropdownMenuItem>
												)}
											{[0, 1, 4, 5].includes(tab) && (
												<DropdownMenuItem
													onClick={() => {
														handleDeleteChatroom(room.id);
													}}
												>
													<Trash2Icon />
													Видалити
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</Button>
						))}
					</InfiniteScroll>
				</div>
			</div>
		);
	};

	return (
		<>
			<Button
				className="md:hidden mb-2 absolute top-[110px] left-[10px] z-20"
				variant="outline"
				size="icon"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				{isSidebarOpen ? <XIcon /> : <MenuIcon />}
			</Button>
			{/* DESKTOP SIDEBAR: Always visible on md+ */}
			<div className="hidden md:block w-64 border-r bg-white h-screen">
				{renderSidebarContent()}
			</div>

			{/* MOBILE DRAWER OVERLAY + SIDEBAR */}
			<div
				// We keep this container in the DOM always (no "hidden" class).
				// Instead, fade and disable clicks with pointer-events.
				className={cn(
					'fixed left-0 right-0 top-[100px] bottom-0 z-50 flex transition-all duration-300',
					isSidebarOpen
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				)}
				onClick={() => setIsSidebarOpen(false)}
			>
				{/* SIDEBAR (90% width) with transition on width */}
				<div
					className={cn(
						'bg-white h-full overflow-y-auto transition-[width] duration-300',
						isSidebarOpen ? 'w-[90%]' : 'w-0'
					)}
					onClick={e => {
						// Prevent closing when clicking inside
						e.stopPropagation();
					}}
				>
					{renderSidebarContent()}
				</div>

				{/* OVERLAY (10% dark area) */}
				<div
					className={cn(
						'w-full h-full bg-black/50 transition-all duration-300',
						{
							'w-[10%]': isSidebarOpen
						}
					)}
				/>
			</div>
		</>
	);
};

export default ChatRoomList;
