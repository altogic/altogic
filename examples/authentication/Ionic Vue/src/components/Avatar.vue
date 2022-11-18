<script lang="ts">
import altogic from '@/libs/altogic';
import { defineComponent, computed, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { User } from 'altogic';

export default defineComponent({
	name: 'AvatarComponent',
	setup() {
		const auth = useAuthStore();
		const loading = ref(false);
		const errors = ref<string | null>(null);
		const userPicture = computed(
			() => auth.user?.profilePicture || `https://ui-avatars.com/api/?name=${auth.user?.name}`
		);
		async function changeHandler(e: any) {
			const file = e.target.files[0];
			e.target.value = null;
			if (!file) return;
			loading.value = true;
			errors.value = null;
			try {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const { publicPath } = await uploadAvatar(file);
				const user = await updateUser({ profilePicture: publicPath });
				auth.setUser(user);
			} catch (error: any) {
				errors.value = error.message;
			} finally {
				loading.value = false;
			}
		}

		async function uploadAvatar(file: File) {
			const { data, errors } = await altogic.storage.bucket('root').upload(`user_${auth.user?._id}`, file);
			if (errors) {
				throw new Error("Couldn't upload avatar, please try again later");
			}
			return data;
		}
		async function updateUser(data: Partial<User>) {
			const { data: user, errors } = await altogic.db.model('users').object(auth.user?._id).update(data);
			if (errors) {
				throw new Error("Couldn't update user, please try again later");
			}
			return user as User;
		}

		return {
			auth,
			loading,
			errors,
			userPicture,
			changeHandler,
		};
	},
});
</script>
<template>
	<div>
		<figure class="flex flex-col gap-4 items-center justify-center py-2">
			<picture class="border rounded-full w-24 h-24 overflow-hidden">
				<img class="object-cover w-full h-full" :src="userPicture" :alt="auth.user?.name" />
			</picture>
		</figure>
		<div class="flex flex-col gap-4 justify-center items-center">
			<label class="border p-2 cursor-pointer">
				<span v-if="loading">Uploading...</span>
				<span v-else>Change Avatar</span>
				<input :disabled="loading" class="hidden" type="file" accept="image/*" @change="changeHandler" />
			</label>
			<div class="bg-red-500 p-2 text-white" v-if="errors">
				{{ errors }}
			</div>
		</div>
	</div>
</template>
