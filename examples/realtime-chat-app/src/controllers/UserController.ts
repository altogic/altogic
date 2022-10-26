import { UserService } from '../services';
import { useAuthStore } from '../store';
import { setProfile } from '../helpers/socket';

export default class UserController {
	/**
	 * Updating user last seen
	 */
	static async updateLastSeen() {
		const userId = useAuthStore.getState().user?._id;
		if (!userId) throw new Error('User not found');
		const { user, errors } = await UserService.updateUser(userId, { lastSeenAt: new Date().toISOString() });
		if (!errors) setProfile(user);
	}
}
