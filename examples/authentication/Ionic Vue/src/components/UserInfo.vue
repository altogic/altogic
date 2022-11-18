<script lang="ts">
import { ref, defineComponent } from 'vue';
import altogic from '../libs/altogic';
import { useAuthStore } from '@/store/auth';
import { User } from 'altogic';

export default defineComponent({
	name: 'UserInfoComponents',
	setup() {
		const auth = useAuthStore();
		const username = ref(auth?.user?.name);
		const loading = ref(false);
		const inputRef = ref<HTMLInputElement>();
		const changeMode = ref(false);
		const errors = ref<string | null>(null);

		function openChangeMode() {
			changeMode.value = true;
			setTimeout(() => {
				inputRef.value?.focus();
			}, 100);
		}

		async function saveName() {
			loading.value = true;
			errors.value = null;

			let { data, errors: apiErrors } = await altogic.db
				.model('users')
				.object(auth.user?._id)
				.update({ name: username.value });
			let user = data as User;

			if (apiErrors) {
				errors.value = apiErrors.items[0].message;
				return;
			} else {
				username.value = user.name;
				auth.setUser(user);
			}

			loading.value = false;
			changeMode.value = false;
		}

		return {
			auth,
			username,
			loading,
			inputRef,
			changeMode,
			errors,
			openChangeMode,
			saveName,
		};
	},
});
</script>

<template>
	<section class="border p-4 w-full">
		<div class="flex items-center justify-center" v-if="changeMode">
			<input
				@keyup.enter="saveName"
				ref="inputRef"
				type="text"
				v-model="username"
				class="bg-transparent text-white border-none text-3xl text-center"
			/>
		</div>
		<div class="space-y-4 flex flex-col items-center" v-else>
			<h1 class="text-3xl text-center">Hello, {{ auth.user?.name }}</h1>
			<button @click="openChangeMode" class="bg-white text-black p-2">Change name</button>
		</div>
		<div v-if="errors">
			{{ errors }}
		</div>
	</section>
</template>
