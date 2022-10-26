import { useNavigate, useParams } from 'react-router-dom';
import { ChatDetailDrawer, ChatRoomFooter, ChatRoomHeader, Messages } from '../components';
import { useEffect, useMemo, useState } from 'react';
import { useAuthStore, useFriendStore, useGroupStore, useMessageStore } from '../store';
import { _Message, GroupParticipant, User } from '../types';
import altogic from '../libs/altogic';
import { offTyping, onTyping } from '../helpers/socket';

export default function ChatRoom() {
	const { groupId } = useParams();
	const { messages, markAllMessagesAsRead } = useMessageStore();
	const { user } = useAuthStore();
	const { groups, groupsCount, setGroupMemberTyping } = useGroupStore();
	const { setUserOnlineStatus } = useFriendStore();
	const navigate = useNavigate();
	const [chatDetails, setChatDetails] = useState<GroupParticipant>();
	const [currentMessages, setCurrentMessages] = useState<_Message[]>();
	const [isGroup, setIsGroup] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!groupId) return;
		//getMessages(groupId);
		altogic.realtime.getMembers(groupId).then(users => {
			users.forEach(user => {
				const _user = user.data as User;
				setUserOnlineStatus(_user._id, true);
			});
		});
		markAllMessagesAsRead(groupId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId]);

	useEffect(() => {
		const onTypingHandler = (data: any) => {
			setGroupMemberTyping(data.channel, data.message.user._id, data.message.typing);
		};
		onTyping(onTypingHandler);
		return () => offTyping(onTypingHandler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const found = groups?.find(chat => chat.group?._id === groupId || chat.group?._id === groupId);
		if (groupsCount > 0 && !found) return navigate('/');
		setChatDetails(found);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId, groups]);

	useEffect(() => {
		setIsGroup(!Boolean(chatDetails?.group?.isPrivate));
	}, [chatDetails]);

	useEffect(() => {
		setCurrentMessages(messages?.filter(message => message.group === groupId));
	}, [messages, groupId]);

	const member = useMemo(() => chatDetails?.members?.find(member => member._id !== user?._id), [chatDetails, user]);
	const roomName = isGroup ? chatDetails?.group.name : member?.name;
	const roomAvatar = isGroup ? chatDetails?.group.profilePicture : member?.profilePicture;

	return (
		<section className="relative grid h-full w-full grid-rows-[auto_1fr_auto] bg-panel-header-background-light dark:bg-panel-header-background-dark">
			<ChatDetailDrawer
				isGroup={isGroup}
				chatDetail={chatDetails}
				isOpen={isOpen}
				close={() => setIsOpen(false)}
			/>
			<ChatRoomHeader
				onClick={() => setIsOpen(state => !state)}
				roomAvatar={roomAvatar}
				roomName={roomName}
				members={chatDetails?.members}
				isGroup={isGroup}
			/>
			<Messages isGroup={isGroup} messages={currentMessages} />
			<ChatRoomFooter groupId={groupId} />
		</section>
	);
}
