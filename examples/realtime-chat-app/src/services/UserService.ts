import { User } from '../types';
import altogic from '../libs/altogic';

class UserService {
	static async getUserById(id: string) {
		const { data, errors } = await altogic.db.model('users').filter(`_id == '${id}'`).getSingle();
		return { user: data as User, errors };
	}
	static async getUserByEmail(email: string) {
		const { data, errors } = await altogic.db.model('users').filter(`email == '${email}'`).getSingle();
		return { user: data as User, errors };
	}
	static async updateUser(id: string, data: Partial<User>) {
		const { data: user, errors } = await altogic.db.model('users').object(id).update(data);
		return { user: user as User, errors };
	}
}

export default UserService;
