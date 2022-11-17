<script>
export default {
	middleware: ['guest'],
	data() {
		return {
			email: '',
			name: '',
			password: '',
			loading: false,
			errors: null,
			isNeedToVerify: false,
		};
	},
	methods: {
		async registerHandler() {
			this.loading = true;
			this.errors = null;
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: this.email,
					password: this.password,
					name: this.name,
				}),
			});
			const { user, session, errors: apiErrors } = await res.json();
			this.loading = false;
			if (apiErrors) {
				this.errors = apiErrors;
				return;
			}
			this.email = '';
			this.password = '';
			this.name = '';

			if (!session) {
				this.isNeedToVerify = true;
				return;
			}

			this.$store.commit('setUser', user);
			this.$store.commit('setSession', session);
			await this.$router.push('/profile');
		},
	},
};
</script>
<template>
	<section class="flex flex-col items-center justify-center h-96 gap-4 px-2">
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
