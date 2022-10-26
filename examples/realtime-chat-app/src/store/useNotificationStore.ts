import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { Notification } from '../types';
import { APIError } from 'altogic';
import { NotificationService } from '../services';

interface NotificationStore {
	notifications: Notification[];
	loading: boolean;
	error: APIError | null;
	getNotifications: (userId: string) => Promise<void>;
	addNotification: (notification: Notification) => void;
	removeNotification: (notificationId: string) => void;
	markAllAsRead: () => void;
}
const useNotificationStore = create<NotificationStore>()(
	devtools(
		set => ({
			notifications: [],
			loading: false,
			error: null,
			getNotifications: async (userId: string) => {
				set({ loading: true, error: null });
				const { notifications, errors } = await NotificationService.getNotifications(userId);
				set({ loading: false, error: errors, notifications });
			},
			addNotification: (notification: Notification) => {
				set(state => ({ notifications: [notification, ...state.notifications] }));
			},
			removeNotification: (notificationId: string) => {
				set(state => ({
					notifications: state.notifications.filter(notification => notification._id !== notificationId),
				}));
			},
			markAllAsRead: () => {
				set(state => ({
					notifications: state.notifications.map(notification => ({ ...notification, isRead: true })),
				}));
			},
		}),
		{
			name: 'notification-storage',
		}
	)
);

export default useNotificationStore;
