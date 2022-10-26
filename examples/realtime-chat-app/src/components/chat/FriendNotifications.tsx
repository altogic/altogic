import { Button, Loading, UserAvatar } from '../index';
import { MdPeople } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFriendNotificationStore } from '../../store';
import altogic from '../../libs/altogic';
import { FriendNotification } from '../../types';
import { GroupController } from '../../controllers';
import { useNavigate } from 'react-router-dom';

export default function FriendNotifications() {
	const [isOpen, setIsOpen] = useState(false);
	const { notifications, addNotification } = useFriendNotificationStore();

	useEffect(() => {
		const handleNewNotification = (payload: any) => {
			addNotification(payload.message);
		};
		altogic.realtime.on('new-friend-notification', handleNewNotification);
		return () => altogic.realtime.off('new-friend-notification', handleNewNotification);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!notifications || notifications?.length === 0) return null;
	return (
		<div className="relative">
			<Button
				onClick={() => setIsOpen(true)}
				withIcon
				className="ext-panel-header-icon-light relative dark:text-panel-header-icon-dark"
			>
				<MdPeople size={22} />
				{notifications.length > 0 && (
					<span className="absolute top-0 -right-0.5 grid h-[20px] w-[20px] place-items-center rounded-full bg-unread-marker-background-light text-[12px] tabular-nums text-unread-marker-text-light dark:bg-unread-marker-background-dark dark:text-unread-marker-text-dark">
						{notifications.length}
					</span>
				)}
			</Button>
			{isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-transparent" />}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{
							y: -10,
							opacity: 0,
						}}
						animate={{
							y: 0,
							opacity: 1,
						}}
						exit={{
							y: -10,
							opacity: 0,
						}}
						transition={{ type: 'tween' }}
						className="my-shadow absolute left-0 top-full z-50 w-[350px] translate-y-2 bg-dropdown-background-light dark:bg-dropdown-background-dark"
					>
						{notifications.map(item => (
							<NotificationItem item={item} key={item._id} />
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
function NotificationItem({ item }: { item: FriendNotification }) {
	const { removeNotification } = useFriendNotificationStore();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const acceptHandler = async () => {
		setLoading(true);
		console.log(item);
		const { errors } = await altogic.endpoint.post('/invite/accept', {
			requester: item.requester._id,
		});
		if (!errors) {
			const group = await GroupController.createGroupWithParticipants('private chat', [item.requester._id], true);
			removeNotification(item._id);
			setLoading(false);
			if (group) navigate(`/group/${group._id}`);
		}
	};
	const rejectHandler = async () => {
		const { errors, data } = await altogic.db
			.model('friendNotifications')
			.filter(`belongsTo == '${item.belongsTo._id}' && requester == '${item.requester._id}'`)
			.delete();
		if (!errors && data.deleted > 0) removeNotification(item._id);
	};
	return (
		<div className="flex items-center justify-between gap-2 p-4">
			<div className="flex items-center gap-2 overflow-hidden">
				<UserAvatar
					className="[&>.image-container]:h-[40px] [&>.image-container]:w-[40px]"
					name={item?.requester?.name}
					image={item?.requester?.profilePicture}
				/>
				<span className="max-w-full whitespace-nowrap font-medium text-primary-light dark:text-primary-dark">
					{item?.requester?.name}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<Button onClick={acceptHandler} className="relative !p-2 text-sm">
					<span className={loading ? 'opacity-0' : ''}>Accept</span>
					{loading && (
						<Loading className="absolute inset-0 m-auto h-8 w-8 text-icon-light dark:text-icon-dark" />
					)}
				</Button>
				<Button onClick={rejectHandler} className="!p-2 text-sm">
					Reject
				</Button>
			</div>
		</div>
	);
}
