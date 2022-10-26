import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChatMessageBubble } from '../';
import { _Message } from '../../types';
import ImageViewer from 'react-simple-image-viewer';

interface MessagesProps {
	messages?: _Message[];
	isGroup?: boolean;
}
export default function Messages({ messages, isGroup }: MessagesProps) {
	const messageContainer = useRef<HTMLDivElement>(null);
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

	const images = useMemo(() => {
		return messages
			?.filter(message => message?.media?.type.startsWith('image/'))
			.map(message => message?.media?.url) as string[];
	}, [messages]);

	const openImageViewer = useCallback(
		(url?: string) => {
			if (!url) return;
			setCurrentImage(images?.findIndex(message => message === url) || 0);
			setIsViewerOpen(true);
		},
		[images]
	);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	useLayoutEffect(() => {
		if (!messageContainer.current) return;
		messageContainer.current.firstElementChild?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className="relative flex flex-col overflow-hidden border-l border-l-conversation-panel-border-light bg-conversation-panel-background-light bg-repeat dark:border-l-conversation-panel-border-dark dark:bg-conversation-panel-background-dark">
			<div
				className="-z-1 pointer-events-none absolute inset-0 opacity-40 dark:opacity-10"
				style={{
					backgroundImage: `url('${process.env.PUBLIC_URL}/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')`,
					backgroundAttachment: 'fixed',
				}}
			/>
			<div
				className="flex max-h-full flex-1 flex-col-reverse gap-4 overflow-y-auto overflow-x-hidden py-4 px-6"
				ref={messageContainer}
			>
				{messages?.map(message => (
					<ChatMessageBubble
						onClick={() => openImageViewer(message?.media?.url)}
						key={message._id}
						showAuthor={isGroup}
						message={message}
					/>
				))}
				{isViewerOpen && (
					<ImageViewer
						src={images}
						currentIndex={currentImage}
						onClose={closeImageViewer}
						disableScroll={false}
						closeOnClickOutside={true}
					/>
				)}
			</div>
		</div>
	);
}
