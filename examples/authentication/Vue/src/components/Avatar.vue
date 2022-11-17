<script setup>
import { useAuthStore } from '@/stores/auth';
import altogic from '@/libs/altogic';
import { computed, ref } from 'vue';
const auth = useAuthStore();
const loading = ref(false);
const errors = ref(null);

const userPicture = computed(() => {
	return auth.user.profilePicture || `https://ui-avatars.com/api/?name=${auth.user.name}&background=0D8ABC&color=fff`;
});

async function changeHandler(e) {
	const file = e.target.files[0];
	e.target.value = null;
	if (!file) return;
	loading.value = true;
	errors.value = null;
	try {
		const { publicPath } = await uploadAvatar(file);
		const user = await updateUser({ profilePicture: publicPath });
		auth.setUser(user);
	} catch (error) {
		errors.value = error.message;
	} finally {
		loading.value = false;
	}
}

async function uploadAvatar(file) {
	const { data, errors } = await altogic.storage.bucket('root').upload(`user_${auth.user_id}`, file);
	if (errors) {
		throw new Error("Couldn't upload avatar, please try again later");
	}
	return data;
}
async function updateUser(data) {
	const { data: user, errors } = await altogic.db.model('users').object(auth.user._id).update(data);
	if (errors) {
		throw new Error("Couldn't update user, please try again later");
	}
	return user;
}
</script>

<template>
	<div>
		<figure class="flex flex-col gap-4 items-center justify-center py-2">
			<picture class="border rounded-full w-24 h-24 overflow-hidden">
				<img class="object-cover w-full h-full" :src="userPicture" :alt="auth.user.name" />
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
