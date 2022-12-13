<script setup>
import { ref } from 'vue';
import altogic, { createBucket } from '@/libs/altogic';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useHead } from '@vueuse/head';

useHead({ title: 'Create an account' });

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const email = ref('');
const name = ref('');
const password = ref('');
const errors = ref(null);
const isNeedToVerify = ref(false);

async function registerHandler() {
	loading.value = true;
	errors.value = null;
	isNeedToVerify.value = false;

	const {
		user,
		session,
		errors: apiErrors,
	} = await altogic.auth.signUpWithEmail(email.value, password.value, name.value);
	loading.value = false;

	if (apiErrors) {
		errors.value = apiErrors;
		return;
	}

	password.value = '';
	name.value = '';

	createBucket(user.email).catch(err => {
		console.error(err);
		toast.error('Something went wrong while creating your bucket');
	});

	if (!session) {
		isNeedToVerify.value = true;
		return;
	}

	auth.setSession(session);
	auth.setUser(user);
	await router.push({ name: 'dashboard' });
}

async function resend() {
	if (loading.value) return;
	loading.value = true;
	const { errors } = await altogic.auth.resendVerificationEmail(email.value);
	loading.value = false;
	if (errors) {
		toast.error("We couldn't resend, please try again.", {
			position: 'top-right',
			timeout: 3000,
		});
	} else {
		toast.success('Verification email sent.', {
			position: 'top-right',
			timeout: 3000,
		});
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
		<div
			v-if="isNeedToVerify"
			class="h-full p-5 lg:p-14 flex justify-center flex-col w-full"
		>
			<h1>Verify your email ✉️</h1>
			<p class="verify-email-text">
				Account activation link sent to your email address:
				<span>{{ email }}</span> Please follow the link inside to continue.
			</p>
			<router-link class="mt-5 link" :to="{ name: 'login' }"
				>Go To Login Page</router-link
			>
			<p class="info text-center mt-3" v-if="!loading">
				Didn't receive an email?
				<a class="cursor-pointer" @click.prevent="resend">Resend</a>
			</p>
		</div>
		<div v-else class="h-full p-5 lg:p-14 flex justify-center flex-col w-full">
			<h1>Create An Account</h1>
			<h2>Make your storage easy and safe!</h2>
			<form @submit.prevent="registerHandler" class="flex flex-col gap-3">
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
					<label for="name">Full Name</label>
					<input
						id="name"
						class="border-[#D8D6DE] rounded w-full"
						v-model="name"
						type="text"
						required
					/>
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
						autocomplete="new-password"
						required
					/>
				</div>
				<button :disabled="loading" type="submit">Sign Up</button>
				<div class="info text-center">
					Already have an account?
					<router-link :to="{ name: 'login' }">Sign in instead</router-link>
				</div>
			</form>
		</div>
	</section>
</template>

<style scoped>
.verify-email-text {
	font-weight: 400;
	font-size: 14px;
	line-height: 21px;
	color: #6e6b7b;
}
.verify-email-text span {
	font-weight: 600;
}

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
button,
.link {
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
