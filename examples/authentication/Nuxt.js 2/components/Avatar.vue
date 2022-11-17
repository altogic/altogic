<script>
import altogic from '../libs/altogic';

export default {
	data() {
		return {
			loading: false,
			errors: null,
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
		userPicture() {
			return (
				this.user?.profilePicture || 'https://ui-avatars.com/api/?name=' + this.user?.name
			);
		},
	},
	methods: {
		async changeHandler(e) {
			const file = e.target.files[0];
			e.target.value = null;
			if (!file) return;
			try {
				this.loading = true;
				this.errors = null;
				const { publicPath } = await this.updateProfilePicture(file);
				const user = await this.updateUser({ profilePicture: publicPath });
				this.$store.commit('setUser', user);
			} catch (e) {
				this.errors = e.message;
			} finally {
				this.loading = false;
			}
		},
		async updateProfilePicture(file) {
			const { data, errors } = await altogic.storage.bucket('root').upload(`user_${this.user._id}`, file);
			if (errors) throw new Error("Couldn't upload file");
			return data;
		},
		async updateUser(data) {
			const { data: user, errors } = await altogic.db.model('users').object(this.user._id).update(data);
			if (errors) throw new Error("Couldn't update user");
			return user;
		},
	},
};
</script>

<template>
	<div>
		<figure class="flex flex-col gap-4 items-center justify-center py-2">
			<picture class="border rounded-full w-24 h-24 overflow-hidden">
				<img class="object-cover w-full h-full" :src="userPicture" :alt="user?.name" />
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
