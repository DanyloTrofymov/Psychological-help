import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
	getAiChats,
	getAllChats,
	getUsersChats,
	getWithoutTherapis
} from '@/api/chatroom.api';
import CenteredContainer from '@/components/custom/CenteredContainer';
import useUser from '@/context/useUser';
import { ChatroomResponse } from '@/data/dto/chat/chat.response';

import Chat from '../../components/chat/chat';
import ChatRoomList from '../../components/chat/chatroomList';

const ChatRoom = () => {
	const [selectedTab, setSelectedTab] = useState(-1);
	const [currentChatroom, setCurrentChatroom] =
		useState<ChatroomResponse | null>(null);
	const [chatrooms, setChatrooms] = useState<ChatroomResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const router = useRouter();
	const { user } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	const fetchChats = useCallback(async () => {
		if (selectedTab == -1) return;
		try {
			let refetchFunc;
			switch (selectedTab) {
				case 0:
					refetchFunc = getAiChats;
					break;
				case 1:
				case 2:
				case 4:
					refetchFunc = getUsersChats;
					break;
				case 3:
					refetchFunc = getWithoutTherapis;
					break;
				case 5:
					refetchFunc = getAllChats;
					break;
				default:
					refetchFunc = getAiChats;
			}
			const response = await refetchFunc(currentPage, 20);
			if (response.status == 200 && response.data) {
				await setChatrooms(prev => [...prev, ...response.data.content]);
				setIsLoading(false);
			}
		} catch (error) {
			console.error('Error fetching chatrooms:', error);
		}
	}, [selectedTab, currentPage]);

	useEffect(() => {
		// if (!router.isReady || selectedTab == -1) return;
		if (!router.isReady || !fetchChats) return;
		setCurrentPage(0);
		setChatrooms([]);
		fetchChats();
		if (router.asPath == '/chats') {
			let newRoute = '';
			switch (selectedTab) {
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
				default:
					newRoute = '/chats/ai';
					break;
			}
			router.replace(newRoute, undefined, { shallow: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTab, router.isReady]);

	useEffect(() => {
		if (currentPage === 0) return;
		fetchChats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	useEffect(() => {
		if (!router.isReady) return;
		const pathname = router.pathname;
		if (pathname == '/chats/ai' && selectedTab !== 0) {
			setSelectedTab(0);
		} else if (pathname == '/chats/therapist' && selectedTab !== 1) {
			setSelectedTab(1);
		} else if (pathname == '/chats/clients' && selectedTab !== 2) {
			setSelectedTab(2);
		} else if (pathname == '/chats/requests' && selectedTab !== 3) {
			setSelectedTab(3);
		} else if (pathname == '/chats/my' && selectedTab !== 4) {
			setSelectedTab(4);
		} else if (pathname == '/chats/all' && selectedTab !== 5) {
			setSelectedTab(5);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.isReady]);

	useEffect(() => {
		if (!currentChatroom) return;
		router.push({ query: { chatId: currentChatroom?.id } }, undefined, {
			shallow: true
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentChatroom]);

	useEffect(() => {
		const chatroomId = parseInt(router.query.chatId as string);
		if (chatroomId) {
			const chatroom = chatrooms.find(chatroom => chatroom.id === chatroomId);
			setCurrentChatroom(chatroom || null);
		} else if (chatrooms.length > 0) {
			setCurrentChatroom(chatrooms[0]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chatrooms]);

	const isParticipant = useMemo(() => {
		const chat = chatrooms.find(chatroom => chatroom.id === chatroom?.id);
		return (
			chat?.ChatroomParticipants?.some(p => p.userId === user?.id) || false
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentChatroom, chatrooms, user?.id]);

	return (
		<div className="h-[calc(100vh-170px)] flex flex-col">
			<div className="flex-1 flex">
				<div className="min-w-[320px] w-[25vw]">
					<ChatRoomList
						chatrooms={chatrooms}
						currentChatroom={currentChatroom}
						setChatrooms={setChatrooms}
						setCurrentChatroom={setCurrentChatroom}
						setTab={setSelectedTab}
						tab={selectedTab}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
					/>
				</div>
				<div className="w-full">
					{chatrooms.length === 0 && !isLoading ? (
						<CenteredContainer>
							<h1 className="text-grey-500">Створіть новий чат</h1>
							<h3 className="text-grey-500">Почніть листування зараз</h3>
						</CenteredContainer>
					) : (
						<Chat
							selectedTab={selectedTab}
							currentChatroom={currentChatroom}
							isParticipant={isParticipant}
							setCurrentTab={setSelectedTab}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatRoom;
