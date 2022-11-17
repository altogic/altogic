<script setup lang="ts">
import { useAuthStore } from '~/stores/useAuth';

const router = useRouter();
const auth = useAuthStore();
const email = ref('');
const password = ref('');
const errors = ref(null);
const loading = ref(false);

definePageMeta({
	middleware: ['guest'],
});
useHead({
	title: 'Login',
});

async function loginHandler() {
	loading.value = true;
	errors.value = null;
	const {
		user,
		errors: apiErrors,
		session,
	} = await $fetch('/api/auth/login', {
		method: 'POST',
		body: JSON.stringify({
			email: email.value,
			password: password.value,
		}),
	});
	loading.value = false;
	if (apiErrors) {
		errors.value = apiErrors;
	} else {
		auth.setUser(user);
		auth.setSession(session);
		router.push('/profile');
	}
}
</script>

<template>
	<section class="flex flex-col items-center justify-center h-96 gap-4">
		<form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
			<h1 class="self-start text-3xl font-bold">Login to your account</h1>

			<div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
				<p v-for="(error, index) in errors.items" :key="index">
					{{ error.message }}
				</p>
			</div>

			<input v-model="email" type="email" placeholder="Type your email" required />
			<input v-model="password" type="password" placeholder="Type your password" required />
			<div class="flex justify-between gap-4">
				<NuxtLink class="text-indigo-600" to="/register">Don't have an account? Register now</NuxtLink>
				<button
					:disabled="loading"
					type="submit"
					class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
				>
					Login
				</button>
			</div>
		</form>
	</section>
</template>
