import create from 'zustand';
import { devtools } from 'zustand/middleware';
import type { APIError } from 'altogic';
import { FriendController } from '../controllers';
import { Friend } from '../types';

interface FriendStore {
	friends: Friend[];
	loading: boolean;
	errors: APIError | null;
	getFriendsByUserId: (userId: string) => Promise<void>;
	setUserOnlineStatus: (userId: string, status: boolean) => void;
	setFriends: (friends: Friend[]) => void;
}
const useFriendStore = create<FriendStore>()(
	devtools(
		set => ({
			friends: [],
			loading: false,
			errors: null,
			getFriendsByUserId: userId => {
				return FriendController.getFriendsByUserId(userId);
			},
			setUserOnlineStatus: (userId: string, status: boolean) => {
				set(state => {
					return {
						friends: state.friends.map(user => {
							if (user.friend._id === userId) {
								user.isOnline = status;
							}
							return user;
						}),
					};
				});
			},
			setFriends: friends => {
				set({ friends });
			},
		}),
		{
			name: 'friend-storage',
		}
	)
);

export default useFriendStore;
