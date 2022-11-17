import altogic from '../libs/altogic';
import { createMemo, createSignal } from 'solid-js';
import { useAuth } from '../context/AuthContext';

export default function Avatar() {
	const [loading, setLoading] = createSignal(false);
	const [errorMessage, setErrorMessage] = createSignal(null);
	const [{ user }, { setUser }] = useAuth();

	const userPicture = createMemo(() => user?.profilePicture ?? `https://ui-avatars.com/api/?name=${user?.name}`);

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
		const { data, errors } = await altogic.storage.bucket('root').upload(`user_${user?._id}`, file);
		if (errors) throw new Error("Couldn't upload file");
		return data;
	}
	async function updateUser(data) {
		const { data: userFromDB, errors } = await altogic.db.model('users').object(user?._id).update(data);
		if (errors) throw new Error("Couldn't update user");
		return userFromDB;
	}
	return (
		<div>
			<figure class="flex flex-col gap-4 items-center justify-center py-2">
				<picture class="border rounded-full w-24 h-24 overflow-hidden">
					<img class="object-cover w-full h-full" src={userPicture()} alt={user?.name} />
				</picture>
			</figure>
			<div class="flex flex-col gap-4 justify-center items-center">
				<label class="border p-2 cursor-pointer">
					<span>{loading() ? 'Uploading...' : 'Change Avatar'}</span>
					<input
						onChange={handleChange}
						name="picture"
						disabled={loading()}
						class="hidden"
						type="file"
						accept="image/*"
					/>
				</label>
				{errorMessage() && <p class="text-red-500">{errorMessage()}</p>}
			</div>
		</div>
	);
}
