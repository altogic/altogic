<script>
import altogic from '~/libs/altogic';

export default {
	data() {
		return {
			loading: false,
			errors: null,
			email: '',
			successMessage: null,
		};
	},
	middleware: ['guest'],
	methods: {
		async loginHandler() {
			this.loading = true;
			this.errors = null;
			const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(this.email);
			this.loading = false;
			if (apiErrors) {
				this.errors = apiErrors;
			} else {
				this.email = '';
				this.successMessage = 'Email sent! Check your inbox.';
			}
		},
	},
};
</script>
<template>
	<section class="flex flex-col items-center justify-center h-96 gap-4 px-2">
		<form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
			<h1 class="self-start text-3xl font-bold">Login with magic link</h1>

			<div v-if="successMessage" class="bg-green-600 text-white text-[13px] p-2">
				{{ successMessage }}
			</div>

			<div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
				<p v-for="(error, index) in errors.items" :key="index">
					{{ error.message }}
				</p>
			</div>

			<input v-model="email" type="email" placeholder="Type your email" required />
			<div class="flex justify-between gap-4">
				<NuxtLink class="text-indigo-600" to="/register">Don't have an account? Register now</NuxtLink>
				<button
					:disabled="loading"
					type="submit"
					class="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
				>
					Send magic link
				</button>
			</div>
		</form>
	</section>
</template>
