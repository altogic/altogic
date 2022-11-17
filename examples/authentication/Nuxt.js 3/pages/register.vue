<script setup lang="ts">
import { useAuthStore } from '~/stores/useAuth';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const name = ref('');
const password = ref('');
const errors = ref(null);
const isNeedToVerify = ref(false);
const loading = ref(false);

definePageMeta({
	middleware: ['guest'],
});
useHead({
	title: 'Register',
});

async function registerHandler() {
	loading.value = true;
	errors.value = null;
	const {
		user,
		errors: apiErrors,
		session,
	} = await $fetch('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({
			email: email.value,
			password: password.value,
			name: name.value,
		}),
	});
	if (apiErrors) {
		errors.value = apiErrors;
		return;
	}
	email.value = '';
	password.value = '';
	name.value = '';

	if (!session) {
		isNeedToVerify.value = true;
		return;
	}

	auth.setUser(user);
	auth.setSession(session);
	router.push({ name: 'profile' });
}
</script>

<template>
	<section class="flex flex-col items-center justify-center h-96 gap-4">
		<form @submit.prevent="registerHandler" class="flex flex-col gap-2 w-full md:w-96">
			<h1 class="self-start text-3xl font-bold">Create an account</h1>

			<div v-if="isNeedToVerify" class="bg-green-500 text-white p-2">
				Your account has been created. Please check your email to verify your account.
			</div>

			<div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
				<p v-for="(error, index) in errors.items" :key="index">
					{{ error.message }}
				</p>
			</div>

			<input v-model="email" type="email" placeholder="Type your email" required />
			<input v-model="name" type="text" placeholder="Type your name" required />
			<input
				v-model="password"
				type="password"
				autocomplete="new-password"
				placeholder="Type your password"
				required
			/>
			<div class="flex justify-between gap-4">
				<NuxtLink class="text-indigo-600" to="/login">Already have an account?</NuxtLink>
				<button
					type="submit"
					:disabled="loading"
					class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
				>
					Register
				</button>
			</div>
		</form>
	</section>
</template>
