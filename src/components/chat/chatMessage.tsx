import { UserRoundIcon } from 'lucide-react';
import Image from 'next/image';

import { Message } from '@/data/dto/chat/chat.response';
import { UserResponse } from '@/data/dto/user/userInfo';
import { cn } from '@/lib/utils';

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
		<div
			className={cn(
				'flex items-start',
				{ 'flex-row-reverse': isCurrentUser },
				{ 'flex-row': !isCurrentUser }
			)}
		>
			<div className="flex relative my-0 mx-2 mt-5 w-8 h-8 bg-slate-300 text-white rounded-full justify-center items-center">
				{avatarSrc ? (
					<Image
						src={avatarSrc}
						alt="avatar"
						fill
						className="object-cover rounded-full"
					/>
				) : (
					<UserRoundIcon />
				)}
			</div>
			<div
				className={cn(
					'flex flex-col max-w-[60vw] border rounded-2xl mt-3 p-1',
					{ 'bg-[#c1d8f3]': !isCurrentUser },
					{ 'bg-[#dcf8c6]': isCurrentUser },
					{ 'flex-start': !isCurrentUser },
					{ 'flex-end': isCurrentUser }
				)}
			>
				<p
					className={cn(
						'font-semibold px-3',
						{ 'flex-end': isCurrentUser },
						{ 'flex-start': !isCurrentUser }
					)}
				>
					{name}
				</p>
				<p
					className="px-2 overflow-wrap-break-word overflow-hidden"
					dangerouslySetInnerHTML={{
						__html: formatMessage(msg.message)
					}}
				/>
				{msg?.createdAt && (
					<p
						className={cn(
							'text-sm  px-3',
							{ 'flex-end': isCurrentUser },
							{ 'flex-start': !isCurrentUser }
						)}
					>
						{new Intl.DateTimeFormat('en-GB', {
							dateStyle: 'short',
							timeStyle: 'short'
						})
							.format(new Date(msg?.createdAt))
							.replaceAll('/', '.')}
					</p>
				)}
			</div>
		</div>
	);
};

export default ChatMessage;
