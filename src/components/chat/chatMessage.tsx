import { Avatar, Stack, Typography } from '@mui/material';

import { Message } from '@/data/dto/chat/chat.response';
import { UserResponse } from '@/data/dto/user/userInfo';

interface ChatMessageProps {
	msg: Message;
	user: UserResponse | null;
	selectedTab: number;
}

const formatMessage = (message: string) => {
	const formattedMessage = message.replaceAll('\n', '<br />');

	return formattedMessage.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
		return `<b>${p1.trim()}</b>`;
	});
};

const ChatMessage = ({ msg, user, selectedTab }: ChatMessageProps) => {
	let avatarSrc;
	let name;
	if (msg?.userId === user?.id) {
		avatarSrc = user?.avatar?.url;
		name = user?.name;
	} else if (selectedTab === 0) {
		avatarSrc = undefined;
		name = 'Асистент';
	} else {
		avatarSrc = msg.user?.avatar?.url;
		name = msg.user?.name;
	}
	const isCurrentUser = msg.userId === user?.id;

	return (
		<Stack
			direction={isCurrentUser ? 'row-reverse' : 'row'}
			alignItems={'flex-start'}
		>
			<Avatar
				src={avatarSrc}
				sx={{ m: '0px  8px', mt: '20px', width: 30, height: 30 }}
				alt="avatar"
			/>
			<Stack
				direction={'column'}
				sx={{
					backgroundColor: isCurrentUser ? '#dcf8c6' : '#c1d8f3',
					maxWidth: '60vw',
					borderRadius: '20px',
					alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
					mt: '10px',
					p: '4px'
				}}
			>
				<Typography
					sx={{
						fontSize: 14,
						fontWeight: 600,
						padding: '0px 10px',
						alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
						color: '#5c5c5c'
					}}
				>
					{name}
				</Typography>
				<Typography
					sx={{
						padding: '0px 10px',
						overflowWrap: 'break-word',
						overflow: 'hidden'
					}}
					dangerouslySetInnerHTML={{
						__html: formatMessage(msg.message)
					}}
				/>
			</Stack>
		</Stack>
	);
};

export default ChatMessage;
