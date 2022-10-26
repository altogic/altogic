import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface UnreadMessageCountStore {
	unreadMessageCount: { [key: string]: number };
	markAsRead: (key: string) => void;
	increment: (key: string) => void;
}
const useUnreadMessageCountStore = create<UnreadMessageCountStore>()(
	devtools(
		set => ({
			unreadMessageCount: {},
			markAsRead: (key: string) => {
				set(state => ({
					unreadMessageCount: {
						...state.unreadMessageCount,
						[key]: 0,
					},
				}));
			},
			increment: (key: string) => {
				console.log('incrementing');
				set(state => ({
					unreadMessageCount: {
						...state.unreadMessageCount,
						[key]: (state.unreadMessageCount[key] ?? 0) + 1,
					},
				}));
			},
		}),
		{
			name: 'unread-messages-storage',
		}
	)
);

export default useUnreadMessageCountStore;
