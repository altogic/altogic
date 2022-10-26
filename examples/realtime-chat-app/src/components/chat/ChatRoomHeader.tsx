import { UserAvatar } from '../index';
import { UserWithTyping } from '../../types';
import { useAuthStore, useFriendStore } from '../../store';
import { useMemo } from 'react';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatRoomHeaderProps {
	roomName?: string;
	roomAvatar?: string;
	onClick?: () => void;
	members?: UserWithTyping[];
	isGroup?: boolean;
}
const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
export default function ChatRoomHeader({ roomName, roomAvatar, onClick, members, isGroup }: ChatRoomHeaderProps) {
	const { friends } = useFriendStore();
	const { user } = useAuthStore();

	const currentUser = useMemo(() => {
		if (!user) return;
		const member = members?.find(member => member._id !== user._id);
		const friend = friends.find(item => item.friend._id === member?._id);
		const date = member?.lastSeenAt && new Date(member?.lastSeenAt);
		return {
			isOnline: friend?.isOnline,
			lastSeen:
				date &&
				(isToday(date)
					? `today at ${format(date, 'HH:mm')}`
					: isYesterday(date)
					? `yesterday at ${format(date, 'HH:mm')}`
					: `at ${format(date, 'dd.MM.yyyy HH:mm')}`),
		};
	}, [user, friends, members]);

	const typingUsers = useMemo(() => {
		const membersExceptMe = members
			?.filter(member => member._id !== user?._id && member.isTyping)
			.map(member => member.name) as string[];
		if (!membersExceptMe?.length) return;

		const pluralOrSingular = membersExceptMe?.length > 1 ? 'are' : 'is';
		return isGroup ? `${formatter.format(membersExceptMe)} ${pluralOrSingular} typing...` : 'typing...';
	}, [members, isGroup, user]);

	const status = () => {
		if (isGroup) return typingUsers;
		if (currentUser?.isOnline) {
			if (typingUsers) return typingUsers;
			return 'online';
		}
		return `last seen ${currentUser?.lastSeen}`;
	};
	return (
		<>
			<header
				className="flex h-h-pane-header items-center border-l border-l-conversation-header-border-light px-4 py-[10px] dark:border-l-conversation-header-border-dark"
				onClick={onClick}
			>
				{roomName && (
					<UserAvatar
						className="[&>*:first-child]:h-[40px] [&>*:first-child]:w-[40px]"
						name={roomName}
						image={roomAvatar}
						status={status()}
						showName
					/>
				)}
			</header>
		</>
	);
}
