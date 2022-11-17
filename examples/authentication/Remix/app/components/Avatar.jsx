import { useState } from 'react';
import altogic from '~/libs/altogic';

export default function Avatar({ user }) {
	const [_user, setUser] = useState(user);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const userPicture = _user?.profilePicture ?? `https://ui-avatars.com/api/?name=${_user?.name}`;

	async function handleChange(e) {
		const file = e.target.files[0];
		e.target.value = null;
		if (!file) return;
		try {
			setLoading(true);
			setErrorMessage(null);
			const { publicPath } = await updateProfilePicture(file);
			const user = await updateUser({ profilePicture: publicPath });
			setUser(user);
		} catch (e) {
			setErrorMessage(e.message);
		} finally {
			setLoading(false);
		}
	}
	async function updateProfilePicture(file) {
		const { data, errors } = await altogic.storage.bucket('root').upload(`user_${_user?._id}`, file);
		if (errors) throw new Error("Couldn't upload file");
		return data;
	}
	async function updateUser(data) {
		const { data: userFromDB, errors } = await altogic.db.model('users').object(_user?._id).update(data);
		if (errors) throw new Error("Couldn't update user");
		return userFromDB;
	}

	return (
		<div>
			<figure className="flex flex-col gap-4 items-center justify-center py-2">
				<picture className="border rounded-full w-24 h-24 overflow-hidden">
					<img className="object-cover w-full h-full" src={userPicture} alt={_user?.name} />
				</picture>
			</figure>
			<div className="flex flex-col gap-4 justify-center items-center">
				<label className="border p-2 cursor-pointer">
					<span>{loading ? 'Uploading...' : 'Change Avatar'}</span>
					<input
						onChange={handleChange}
						name="picture"
						disabled={loading}
						className="hidden"
						type="file"
						accept="image/*"
					/>
				</label>
				{errorMessage && <p className="text-red-500">{errorMessage}</p>}
			</div>
		</div>
	);
}
