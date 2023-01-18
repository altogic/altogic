import altogic from '../libs/altogic';
import { Address, User } from '../types/altogic';
import { APIError } from 'altogic';

export default class UserService {
	static async updateProfilePicture(userId: string, image: File) {
		const { data, errors: uploadErrors } = (await altogic.storage.root.upload(image.name, image, {
			isPublic: true,
			onProgress() {}
		})) as { data: { publicPath: string }; errors: APIError };

		if (uploadErrors) throw uploadErrors;
		return UserService.update(userId, { profilePicture: data.publicPath });
	}
	static async update(userId: string, data: Partial<User>) {
		const { data: user, errors } = await altogic.db.model('users').object(userId).update(data);

		if (errors) throw errors;

		return user as User;
	}
	static async updateAddress(address: Address) {
		const { data, errors } = await altogic.endpoint.post('/address', address);
		if (errors) throw errors;

		return data as User;
	}
}
