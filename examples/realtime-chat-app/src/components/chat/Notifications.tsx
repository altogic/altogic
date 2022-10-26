import { Button } from '../index';
import { MdNotifications } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore, useNotificationStore } from '../../store';
import { Notification } from '../../types';
import { NotificationService } from '../../services';
import altogic from '../../libs/altogic';
import { intlFormatDistance } from 'date-fns';

export default function Notifications() {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useAuthStore();
	const { notifications, addNotification, markAllAsRead } = useNotificationStore();
	const count = notifications.filter(n => !n.isRead).length;

	useEffect(() => {
		const handler = (payload: any) => addNotification(payload.message);
		altogic.realtime.on('new-notification', handler);
		return () => altogic.realtime.off('new-notification', handler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onClickHandler = async () => {
		setIsOpen(true);
		if (user && count > 0) {
			const { errors } = await NotificationService.markAllAsRead(user?._id);
			if (!errors) {
				markAllAsRead();
			}
		}
	};
	if (notifications.length === 0) return null;
	return (
		<div className="relative">
			<Button
				onClick={onClickHandler}
				withIcon
				className="ext-panel-header-icon-light relative dark:text-panel-header-icon-dark"
			>
				<MdNotifications size={22} />
				{count > 0 && (
					<span className="absolute top-0 -right-0.5 grid h-[20px] w-[20px] place-items-center rounded-full bg-unread-marker-background-light text-[12px] tabular-nums text-unread-marker-text-light dark:bg-unread-marker-background-dark dark:text-unread-marker-text-dark">
						{count}
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
						className="my-shadow absolute left-0 top-full z-50 max-h-[400px] w-[350px] translate-y-2 overflow-auto bg-dropdown-background-light dark:bg-dropdown-background-dark"
					>
						{notifications.map(notification => (
							<NotificationItem key={notification._id} item={notification} />
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
function NotificationItem({ item }: { item: Notification }) {
	return (
		<div className="flex flex-col border-b border-b-background-default-hover-light p-4 dark:border-b-background-default-hover-dark">
			<div className="font-medium">{item.message}</div>
			<time className="self-end">{intlFormatDistance(new Date(item.createdAt), new Date())}</time>
		</div>
	);
}
