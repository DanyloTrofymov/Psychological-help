// components/Chat.tsx
import InfoIcon from '@mui/icons-material/Info';
import { Box, TextField, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { getMessages, joinChatroom, pingAdmin } from '@/api/chatroom.api';
import useUser from '@/context/useUser';
import { ChatroomResponse, Message } from '@/data/dto/chat/chat.response';
import { ROLE } from '@/data/dto/user/userInfo';

import Button from '../custom/Button';
import CenteredContainer from '../custom/CenteredContainer';
import ChatMessage from './chatMessage';

interface ChatProps {
	selectedTab: number;
	currentChatroom: ChatroomResponse | null;
	isParticipant: boolean;
	setCurrentTab: (tab: number) => void;
}

const Chat = ({
	selectedTab,
	currentChatroom,
	isParticipant,
	setCurrentTab
}: ChatProps) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState('');
	const [aiMessage, setAiMessage] = useState<string>('');
	const [currentPage, setCurrentPage] = useState(0);
	const { user, socket } = useUser();
	const [handleShift, setHandleShift] = useState(false);
	const inputRef = useRef<HTMLInputElement>();
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const router = useRouter();

	const fetchMessages = useCallback(
		async (page: number) => {
			if (!currentChatroom?.id) return;
			const response = await getMessages(currentChatroom?.id, page, 20);
			if (response.status == 200 && response.data) {
				setMessages(prev => [...prev, ...response.data.content]);
			} else {
				setMessages([]);
			}
		},
		[currentChatroom?.id]
	);

	useEffect(() => {
		if (!socket) return;
		socket.on('newMessage', (data: Message) => {
			setMessages((prevMessages: Message[]) => [data, ...prevMessages]);
		});

		socket.on(
			'aiPartMessage',
			(data: { chatroomId: number; message: string }) => {
				if (data.chatroomId == currentChatroom?.id)
					setAiMessage((prev: string) => prev + data.message);
			}
		);

		socket.on('aiEndMessage', (data: Message) => {
			setAiMessage(() => '');
			setMessages((prevMessages: Message[]) => [data, ...prevMessages]);
		});

		return () => {
			if (!socket) return;
			socket.off('newMessage');
			socket.off('aiPartMessage');
		};
	}, []);

	useEffect(() => {
		if (!currentChatroom) return;
		setCurrentPage(0);
		setMessages([]);
		fetchMessages(0);
		setAiMessage('');
	}, [currentChatroom]);

	const handleSend = () => {
		if (!message || !message.trim() || !socket || !currentChatroom) return;
		const msg = message.trim();
		const payload = { chatroomId: currentChatroom?.id, message: msg };
		setMessages([
			{ message: msg, userId: user?.id, createdAt: new Date() },
			...messages
		]);
		if (selectedTab === 0) {
			socket.emit('sendAiMessage', payload);
		} else {
			socket.emit('sendUserMessage', payload);
		}
		setMessage('');
	};

	const handleJoin = async () => {
		if (!currentChatroom?.id) return;
		const response = await joinChatroom(currentChatroom?.id);
		if (response.status == 201 && response.data) {
			if (selectedTab === 3) {
				router.push(`/chats/clients?chatId=${response.data.id}`);
				setCurrentTab(2);
			}
			if (selectedTab === 5) {
				router.push(`/chats/my?chatId=${response.data.id}`);
				setCurrentTab(4);
			}
		} else {
			setMessages([]);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Shift') {
			setHandleShift(true);
		}
	};

	const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Shift') {
			setHandleShift(false);
		}
	};

	useEffect(() => {
		const handleEnterDown = (event: KeyboardEvent) => {
			if (handleShift) return;
			if (event.key === 'Enter') {
				if (buttonRef.current) {
					buttonRef.current.focus();
					buttonRef.current.click();
				}
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}
		};

		window.addEventListener('keydown', handleEnterDown);

		return () => {
			window.removeEventListener('keydown', handleEnterDown);
		};
	}, [buttonRef, inputRef, handleShift]);

	const handlePagination = async () => {
		const nextPage = currentPage + 1;
		setCurrentPage(nextPage);
		await fetchMessages(nextPage);
	};

	const handlePing = async () => {
		if (!currentChatroom?.id) return;
		const response = await pingAdmin(currentChatroom?.id);
		if (response.status == 201 && response.data) {
			setMessages([
				{
					message: 'Запит на підключення адміністратора відправлено',
					userId: user?.id
				},
				...messages
			]);
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column' }}>
			{messages.length === 0 ? (
				<Box sx={{ height: 'calc(100vh - 260px)' }}>
					<CenteredContainer>
						<Typography variant="h1" sx={{ color: 'grey' }}>
							У вас ще немає повідомлень
						</Typography>
						<Typography variant="h3" sx={{ color: 'grey' }}>
							Почніть листування зараз
						</Typography>
					</CenteredContainer>
				</Box>
			) : (
				<InfiniteScroll
					hasMore={true}
					loader={null}
					dataLength={messages.length}
					next={handlePagination}
					scrollableTarget="scrollableChat"
					inverse={true}
				>
					<Box
						sx={{
							flex: 1,
							overflowY: 'auto',
							justifyContent: 'flex',
							height: 'calc(100vh - 260px)',
							flexDirection: 'column-reverse',
							display: 'flex'
						}}
						id="scrollableChat"
					>
						{!!aiMessage && (
							<ChatMessage
								msg={{ message: aiMessage }}
								key={'ai'}
								selectedTab={selectedTab}
								user={user}
							/>
						)}
						{messages.map(msg => (
							<ChatMessage
								msg={msg}
								key={msg.id}
								selectedTab={selectedTab}
								user={user}
							/>
						))}
					</Box>
				</InfiniteScroll>
			)}
			<Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
				{[3, 5].includes(selectedTab) &&
				!currentChatroom?.ChatroomParticipants?.some(
					p => p.userId == user?.id
				) &&
				!isParticipant ? (
					<>
						{currentChatroom?.ChatroomParticipants?.some(
							p => !p.aiThreadId
						) && (
							<Button
								onClick={handleJoin}
								variant="contained"
								color="primary"
								id={'send'}
								sx={{ ml: 3 }}
								disabled={!!aiMessage}
							>
								Приєднатися до чату
							</Button>
						)}
					</>
				) : (
					<>
						{selectedTab === 0 && (
							<Tooltip
								title={
									<Typography variant="h4">
										Повідомлення у цьому чаті генеруються за допомогою штучного
										інтелекту. Ми докладаємо всіх зусиль для забезпечення
										високої якості та точності наданих консультацій. Однак, слід
										пам&aposятати, що відповіді, надані штучним інтелектом, не
										замінюють професійних консультацій кваліфікованого психолога
										чи психотерапевта. Рекомендуємо звертатися до фахівців для
										отримання більш детальної та індивідуальної допомоги у
										складних чи критичних ситуаціях.
									</Typography>
								}
							>
								<InfoIcon sx={{ mr: 1 }} />
							</Tooltip>
						)}
						<TextField
							onKeyDown={handleKeyDown}
							onKeyUp={handleKeyUp}
							inputRef={inputRef}
							value={message}
							disabled={!!aiMessage}
							multiline
							onChange={e => setMessage(e.target.value)}
							label="Повідомлення"
							variant="outlined"
							fullWidth
							sx={{ flexGrow: 1, mb: 1 }}
						/>
						<Button
							ref={buttonRef}
							onClick={handleSend}
							variant="contained"
							color="primary"
							id={'send'}
							sx={{ ml: 3 }}
							disabled={!!aiMessage}
						>
							Надіслати
						</Button>
					</>
				)}
			</Box>
			{user?.role.key !== ROLE.ADMIN && selectedTab !== 0 && (
				<Typography
					sx={{ color: 'blue', alignSelf: 'center', cursor: 'pointer' }}
					onClick={handlePing}
				>
					Запросити адміністратора
				</Typography>
			)}
		</Box>
	);
};

export default Chat;
