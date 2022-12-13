<script setup>
import { ref } from 'vue';
import altogic from '@/libs/altogic';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';

useHead({ title: 'Login to your account' });

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const email = ref('');
const password = ref('');
const errors = ref(null);

async function loginHandler() {
	loading.value = true;
	errors.value = null;
	const {
		user,
		session,
		errors: apiErrors,
	} = await altogic.auth.signInWithEmail(email.value, password.value);
	if (apiErrors) {
		errors.value = apiErrors;
		loading.value = false;
	} else {
		auth.setUser(user);
		auth.setSession(session);
		await router.push({ name: 'dashboard' });
	}
}
</script>

<template>
	<section
		class="flex-1 grid justify-items-center md:justify-items-stretch grid-cols-1 md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_500px]"
	>
		<div class="h-full px-4 bg-[#F8F8F8] justify-center items-center hidden md:flex">
			<img
				class="max-w-[300px] lg:max-w-[400px]"
				draggable="false"
				src="/img/auth.png"
				alt="auth"
			/>
		</div>
		<div class="h-full p-5 lg:p-14 flex justify-center flex-col w-full">
			<h1>Welcome to Storage! 👋🏻</h1>
			<h2>Please sign-in to your account</h2>
			<form @submit.prevent="loginHandler" class="flex flex-col gap-3">
				<div v-if="errors" class="bg-red-500 rounded text-white p-3">
					<p
						class="text-base"
						v-for="(error, index) in errors.items"
						:key="index"
					>
						{{ error.message }}
					</p>
				</div>
				<div>
					<label for="email">Email</label>
					<input
						id="email"
						class="border-[#D8D6DE] rounded w-full"
						v-model="email"
						type="email"
						required
					/>
				</div>
				<div>
					<label for="password">Password</label>
					<input
						id="password"
						class="border-[#D8D6DE] rounded w-full"
						v-model="password"
						type="password"
						required
					/>
				</div>
				<button :disabled="loading" type="submit">Login</button>
				<div class="info text-center">
					New on our platform?
					<router-link :to="{ name: 'register' }"
						>Create an account</router-link
					>
				</div>
			</form>
		</div>
	</section>
</template>

<style scoped>
label {
	font-weight: 400;
	font-size: 12px;
	line-height: 15px;
	color: #5e5873;
}
h1 {
	font-weight: 600;
	font-size: 24px;
	line-height: 29px;
	color: #5e5873;
	margin-bottom: 10px;
}
h2 {
	font-weight: 400;
	font-size: 14px;
	line-height: 21px;
	color: #6e6b7b;
	margin-bottom: 44px;
}
button[type='submit'] {
	background: #0085ff;
	border-radius: 5px;
	color: #fff;
	padding: 13px 0;
	font-weight: 500;
	font-size: 14px;
	line-height: 17px;
	display: flex;
	align-items: center;
	justify-content: center;
	@apply relative active:top-0.5;
}
.info {
	font-weight: 400;
	font-size: 14px;
	line-height: 21px;
	color: #6e6b7b;
}
.info a {
	color: #0085ff;
}
</style>
