import { FriendService } from '../services';
import { useFriendStore } from '../store';
import altogic from '../libs/altogic';

class FriendController {
	/**
	 * Get all friends of the current user
	 */
	static async getFriendsByUserId(userId: string) {
		useFriendStore.setState({ loading: true, errors: null });
		const { data, errors } = await FriendService.getFriendsByUserId(userId);
		useFriendStore.setState({ loading: true, errors, friends: data });
	}
	/**
	 * Sending a friend request to another user with email
	 */
	static sendFriendRequest(email: string) {
		return altogic.endpoint.post('/send-invite', {
			email,
		});
	}
}

export default FriendController;
