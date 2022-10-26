import { format, isToday, intlFormatDistance } from 'date-fns';
import { _Message } from '../../types';
import { useAuthStore } from '../../store';
import { Dropdown } from '../index';
import { ArrowDownIcon } from '../icon';
import { MessageController } from '../../controllers';
import { useEffect, useRef, useState } from 'react';

interface ChatMessageBubbleProps {
	message: _Message;
	showAuthor?: boolean;
	onClick?: () => void;
}

export default function ChatMessageBubble({ message, showAuthor, onClick }: ChatMessageBubbleProps) {
	const { user } = useAuthStore();
	const messageRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
	const _date = new Date(message.createdAt);
	const isMine = message.sender._id === user?._id;
	const hasMedia = !!message.media?.url;
	const isImage = hasMedia && message.media?.type.startsWith('image/');
	const deleteMessage = () => MessageController.deleteMessage(message.group, message._id);

	useEffect(() => {
		if (!messageRef.current) return;
		const parent = messageRef.current.parentElement;
		if (parent?.firstElementChild === messageRef.current) {
			setPosition('top');
		}
	}, []);

	const dropdownOptions = [
		{
			title: 'Delete message',
			onClick: deleteMessage,
		},
	];

	return (
		<article
			ref={messageRef}
			className={`group relative min-h-[33px] min-w-[100px] max-w-[75%] shrink-0 grow-0 rounded bg-gray-100 p-[3px] leading-none
			${
				isMine
					? 'self-end rounded-tr-none bg-outgoing-background-light dark:bg-outgoing-background-dark'
					: 'self-start rounded-tl-none bg-incoming-background-light dark:bg-incoming-background-dark'
			}`}
		>
			<span
				className={`absolute  top-0 h-[13px] w-[8px] ${
					isMine
						? '-right-[8px] text-outgoing-background-light dark:text-outgoing-background-dark'
						: '-left-[8px] text-incoming-background-light dark:text-incoming-background-dark'
				}`}
			>
				<svg className={!isMine ? '-scale-x-100' : ''} viewBox="0 0 8 13" width="8" height="13">
					<path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
					<path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" />
				</svg>
			</span>
			{showAuthor && !isMine && (
				<header className="py-1 pl-1 pr-2 text-[13px] font-bold text-teal-lighter-light">
					{message.sender.name}
				</header>
			)}
			<div
				style={{ overflowWrap: 'break-word' }}
				className="text-[14px] leading-5 text-message-primary-light dark:text-message-primary-dark"
			>
				{isImage && (
					<div
						onClick={onClick}
						className="mb-1 grid aspect-square h-[300px] max-h-[300px] cursor-pointer place-items-center overflow-hidden rounded-[5px] bg-white"
					>
						<img
							draggable={false}
							className="h-full w-full object-cover"
							src={message.media?.url}
							alt={message.sender.name}
						/>
					</div>
				)}
				<div className="px-1 pr-4">{message.content}</div>
			</div>
			<time className="float-right m-1 w-fit text-[.6875rem] text-bubble-meta-light dark:text-bubble-meta-dark">
				{isToday(_date) ? intlFormatDistance(_date, new Date()) : format(_date, 'PPpp')}
			</time>
			{isMine && (
				<div className="absolute right-0.5 top-0.5">
					<Dropdown
						onlyIcon
						locationX="right"
						locationY={position}
						className="z-[9999999998] translate-x-[100px] !bg-outgoing-background-light !outline-none transition duration-[400ms]  group-hover:translate-x-0 dark:!bg-outgoing-background-dark"
						data={dropdownOptions}
					>
						<ArrowDownIcon className="text-bubble-meta-icon-light dark:text-bubble-meta-icon-dark" />
					</Dropdown>
				</div>
			)}
		</article>
	);
}
