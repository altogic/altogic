import { useEffect, useState } from 'react';
import { MessageController, UserController } from '../controllers';
import { Outlet, useParams } from 'react-router-dom';
import { Container, ChatLeftSide } from '../components';
import { _Message, User } from '../types';
import altogic from '../libs/altogic';
import { joinRoom, offMessage, onMessage, setProfile } from '../helpers/socket';
import {
	useAuthStore,
	useFriendNotificationStore,
	useFriendStore,
	useGroupStore,
	useMessageStore,
	useNotificationStore,
	useUnreadMessageCountStore,
} from '../store';

let timeout: number;

export default function Home() {
	const { groupId } = useParams();
	const [reConnectionCount, setReConnectionCount] = useState(0);
	const { user, session } = useAuthStore();
	const { addMessage, deleteMessage } = useMessageStore();
	const { increment } = useUnreadMessageCountStore();
	const { setUserOnlineStatus } = useFriendStore();
	const { getFriendsByUserId } = useFriendStore();
	const { getNotifications } = useNotificationStore();
	const { getFriendNotifications } = useFriendNotificationStore();
	const [socketConnected, setSocketConnected] = useState(altogic.realtime.isConnected());
	const { groups, fetchGroups } = useGroupStore();
	const {
		addGroup,
		setGroupMemberLastSeenAt,
		updateGroupPicture,
		updateGroupName,
		setGroupMemberName,
		setGroupMemberProfilePicture,
		removeMember,
		removeGroup,
		addMember,
	} = useGroupStore();

	useEffect(() => {
		socketListeners();
		return () => {
			socketListenersOff();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		timeout = window.setTimeout(() => {
			if (!socketConnected) {
				init('reconnect attempt');
				altogic.realtime.open();
			}
		}, 3000);
		return () => {
			clearTimeout(timeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socketConnected]);

	useEffect(() => {
		joinRoom(groups?.map(item => item.group._id));
	}, [groups]);

	useEffect(() => {
		init('first init');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	useEffect(() => {
		if (reConnectionCount > 1) init('Reconnecting init');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reConnectionCount]);

	useEffect(() => {
		onMessage(onMessageHandler);
		return () => {
			offMessage(onMessageHandler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupId]);

	function init(from: string) {
		if (!user || !session) return;
		console.info(`%c${from}`, 'color: yellow; font-size:18px');
		MessageController.calculateUnreadMessagesFromDB();
		setProfile(user);
		joinRoom(user._id);
		fetchGroups(user._id);
		getFriendsByUserId(user._id);
		getFriendNotifications(user._id);
		getNotifications(user._id);
	}
	function socketListeners() {
		if (!user || !session) return;
		altogic.realtime.onConnect(onConnectHandler);
		altogic.realtime.onDisconnect(onDisconnectHandler);
		altogic.realtime.onError(onErrorHandler);
		altogic.realtime.onReconnectAttempt(attemptNumber);
		altogic.realtime.onJoin(onJoinHandler);
		altogic.realtime.onLeave(onLeaveHandler);
		altogic.realtime.onUpdate(onUpdateHandler);
		altogic.realtime.on('new-group', newGroupHandler);
		altogic.realtime.on('new-friend', newFriendHandler);
		altogic.realtime.on('group-name-updated', updateGroupNameHandler);
		altogic.realtime.on('group-picture-updated', updateGroupPictureHandler);
		altogic.realtime.on('message-deleted', deleteMessageHandler);
		altogic.realtime.on('group-left', userLeftRoomHandler);
		altogic.realtime.on('group-deleted', deletedGroupHandler);
		altogic.realtime.on('added-participants', addedParticipantsHandler);
		altogic.realtime.on('reload-groups', reloadGroupsHandler);
	}
	function socketListenersOff() {
		altogic.realtime.off('new-group', newGroupHandler);
		altogic.realtime.off('new-friend', newFriendHandler);
		altogic.realtime.off('group-name-updated', updateGroupNameHandler);
		altogic.realtime.off('group-picture-updated', updateGroupPictureHandler);
		altogic.realtime.off('message-deleted', deleteMessageHandler);
		altogic.realtime.off('group-left', userLeftRoomHandler);
		altogic.realtime.off('group-deleted', deletedGroupHandler);
		altogic.realtime.off('added-participants', addedParticipantsHandler);
		altogic.realtime.off('reload-groups', reloadGroupsHandler);
	}
	function onMessageHandler(data: any) {
		const message = data.message as _Message;
		const channel = data.channel as string;
		addMessage(message);
		if (channel !== groupId && message.sender._id !== user?._id) {
			increment(channel);
		}
	}
	function onLeaveHandler(payload: any) {
		const user = payload.message.data as User;
		setUserOnlineStatus(user._id, false);
	}
	function onJoinHandler(payload: any) {
		const user = payload.message.data as User;
		setUserOnlineStatus(user._id, true);
	}
	function newGroupHandler(payload: any) {
		addGroup(payload.message);
	}
	function newFriendHandler(payload: any) {
		getFriendsByUserId(payload.channel);
	}
	function updateGroupNameHandler(payload: any) {
		updateGroupName(payload.channel, payload.message);
	}
	function updateGroupPictureHandler(payload: any) {
		updateGroupPicture(payload.channel, payload.message);
	}
	function onUpdateHandler(payload: any) {
		const user = payload.message.data as User;
		setGroupMemberLastSeenAt(user._id, user.lastSeenAt);
		user.name && setGroupMemberName(user._id, user.name);
		user.profilePicture && setGroupMemberProfilePicture(user._id, user.profilePicture);
	}
	function onConnectHandler() {
		console.info('%cConnected to socket', 'color: green; font-size:20px');
		setReConnectionCount(prev => prev + 1);
		setSocketConnected(altogic.realtime.isConnected());
		UserController.updateLastSeen();
	}
	function onDisconnectHandler() {
		console.info('%cDisconnected from socket', 'color: red; font-size:20px');
		setSocketConnected(altogic.realtime.isConnected);
	}
	function onErrorHandler(cause: any) {
		console.error('Socket error', cause);
	}
	function attemptNumber(attemptNumber: number) {
		console.info('Reconnecting attempt number: ', attemptNumber);
	}
	function deleteMessageHandler(payload: any) {
		deleteMessage(payload.message);
	}
	function userLeftRoomHandler(payload: any) {
		removeMember(payload.channel, payload.message);
	}
	function deletedGroupHandler(payload: any) {
		removeGroup(payload.channel);
	}
	function addedParticipantsHandler(payload: any) {
		addMember(payload.channel, payload.message);
	}
	function reloadGroupsHandler() {
		const userId = user?._id;
		if (!userId) return;
		fetchGroups(userId);
	}

	return (
		<Container>
			<div className="dark:my-shadow grid w-full grid-cols-[300px_1fr] grid-rows-1 overflow-hidden bg-white transition lg:h-[calc(100vh_-_2rem)] lg:grid-cols-[minmax(200px,400px)_1fr] xl:grid-cols-[420px_1fr]">
				<ChatLeftSide />
				<div>
					<Outlet />
				</div>
			</div>
		</Container>
	);
}
