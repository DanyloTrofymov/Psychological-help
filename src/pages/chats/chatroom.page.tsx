import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

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
	const [selectedTab, setSelectedTab] = useState(0);
	const [currentChatroom, setCurrentChatroom] =
		useState<ChatroomResponse | null>(null);
	const [chatrooms, setChatrooms] = useState<ChatroomResponse[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const router = useRouter();
	const { user } = useUser();

	const fetchChats = async () => {
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
					refetchFunc = getUsersChats;
			}
			const response = await refetchFunc(currentPage, 20);
			if (response.status == 200 && response.data) {
				setChatrooms(prev => [...prev, ...response.data]);
				if (response.data.length > 0) setCurrentChatroom(response.data[0]);
			}
		} catch (error) {
			console.error('Error fetching chatrooms:', error);
		}
	};

	useEffect(() => {
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
			}
			router.replace(newRoute, undefined, { shallow: false });
		}
	}, [selectedTab]);

	useEffect(() => {
		if (currentPage === 0) return;
		fetchChats();
	}, [currentPage]);

	useEffect(() => {
		if (!router.isReady) return;
		const pathname = router.pathname;
		if (pathname == '/chats/ai') {
			setSelectedTab(0);
		} else if (pathname == '/chats/therapist') {
			setSelectedTab(1);
		} else if (pathname == '/chats/clients') {
			setSelectedTab(2);
		} else if (pathname == '/chats/requests') {
			setSelectedTab(3);
		} else if (pathname == '/chats/my') {
			setSelectedTab(4);
		} else if (pathname == '/chats/all') {
			setSelectedTab(5);
		}
		const chatroomId = parseInt(router.query.chatId as string);
		if (chatroomId) {
			const chatroom = chatrooms.find(chatroom => chatroom.id === chatroomId);
			setCurrentChatroom(chatroom || null);
		}
	}, [router.isReady]);

	useEffect(() => {
		if (!currentChatroom) return;
		router.push({ query: { chatId: currentChatroom?.id } });
	}, [currentChatroom]);

	const isParticipant = useMemo(() => {
		const chat = chatrooms.find(chatroom => chatroom.id === chatroom?.id);
		return (
			chat?.ChatroomParticipants?.some(p => p.userId === user?.id) || false
		);
	}, [currentChatroom, chatrooms]);

	return (
		<Box
			sx={{
				height: 'calc(100vh - 170px)',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<Stack direction={'row'} sx={{ flex: 1 }}>
				<Box sx={{ minWidth: '320px', width: '25vw' }}>
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
				</Box>
				<Box sx={{ width: '100%' }}>
					{chatrooms.length === 0 ? (
						<CenteredContainer>
							<Typography variant="h1" sx={{ color: 'grey' }}>
								Створіть новий чат
							</Typography>
							<Typography variant="h3" sx={{ color: 'grey' }}>
								Почніть листування зараз
							</Typography>
						</CenteredContainer>
					) : (
						<Chat
							selectedTab={selectedTab}
							currentChatroom={currentChatroom}
							isParticipant={isParticipant}
							setCurrentTab={setSelectedTab}
						/>
					)}
				</Box>
			</Stack>
		</Box>
	);
};

export default ChatRoom;
