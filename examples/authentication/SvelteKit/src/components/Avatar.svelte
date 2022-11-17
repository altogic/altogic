<script>
	import { authStore } from '../store/auth.store';
	import { altogic } from '../configs/altogic';

	let errors = null;
	let loading = false;

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		e.target.value = null;
		if (!file) return;
		try {
			loading = true;
			errors = null;
			const { publicPath } = await updateProfilePicture(file);
			const updatedUser = await updateUser({ profilePicture: publicPath });
			authStore.set(updatedUser);
		} catch (e) {
			errors = e.message;
		} finally {
			loading = false;
		}
	};
	const updateProfilePicture = async (file) => {
		const { data, errors } = await altogic.storage
			.bucket('root')
			.upload(`user_${$authStore._id}`, file);
		if (errors) throw new Error("Couldn't upload file");
		return data;
	};
	const updateUser = async (data) => {
		const { data: updatedUser, errors } = await altogic.db
			.model('users')
			.object($authStore._id)
			.update(data);
		if (errors) throw new Error("Couldn't update user");
		return updatedUser;
	};
</script>

<div>
	<figure class="flex flex-col gap-4 items-center justify-center py-2">
		<picture class="border rounded-full w-24 h-24 overflow-hidden">
			<img
				class="object-cover w-full h-full"
				src={$authStore?.profilePicture ||
					`https://ui-avatars.com/api/?name=${$authStore?.name}&background=0D8ABC&color=fff`}
				alt={$authStore?.name}
			/>
		</picture>
	</figure>
	<div class="flex flex-col gap-4 justify-center items-center">
		<label class="border p-2 cursor-pointer">
			<span>{loading ? 'Uploading...' : 'Change Avatar'}</span>

			<input
				class="hidden"
				type="file"
				accept="image/*"
				disabled={loading}
				on:change={handleFileChange}
			/>
		</label>
		{#if errors}<div>{errors}</div>{/if}
	</div>
</div>
