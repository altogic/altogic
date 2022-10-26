import altogic from '../libs/altogic';
import { Friend } from '../types';

class FriendService {
	static async getFriendsById(userId: string) {
		return altogic.db.model('users').filter(`_id != '${userId}'`).get();
	}
	static async getFriendsByUserId(userId: string) {
		const res = await altogic.db
			.model('friends')
			.filter(`user._id == '${userId}'`)
			.lookup({
				field: 'friend',
			})
			.lookup({
				field: 'user',
			})
			.limit(200)
			.get();
		return {
			data: res.data as Friend[],
			errors: res.errors,
		};
	}
}

export default FriendService;
