import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { FriendNotification } from '../types';
import altogic from '../libs/altogic';
import { APIError } from 'altogic';

interface FriendNotificationStore {
	notifications: FriendNotification[];
	loading: boolean;
	error: APIError | null;
	getFriendNotifications: (userId: string) => Promise<void>;
	addNotification: (notification: FriendNotification) => void;
	removeNotification: (notificationId: string) => void;
}
const useFriendNotificationStore = create<FriendNotificationStore>()(
	devtools(
		set => ({
			notifications: [],
			loading: false,
			error: null,
			getFriendNotifications: async userId => {
				set({ loading: true, error: null });
				let { data, errors } = await altogic.db
					.model('friendNotifications')
					.filter(`belongsTo == '${userId}' && isAccepted == false`)
					.lookup({ field: 'requester' })
					.get();
				set({ loading: false, notifications: data as FriendNotification[], error: errors });
			},
			addNotification: notification => {
				set(state => ({ notifications: [notification, ...state.notifications] }));
			},
			removeNotification: notificationId => {
				set(state => ({
					notifications: state.notifications.filter(notification => notification._id !== notificationId),
				}));
			},
		}),
		{
			name: 'friend-notification-storage',
		}
	)
);

export default useFriendNotificationStore;
