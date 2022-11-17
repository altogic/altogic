<script>
export default {
	middleware: ['guest'],
	data() {
		return {
			errors: null,
		};
	},
	async fetch() {
		const { access_token } = this.$route.query;
		const res = await fetch(`/api/verify-user?access_token=${access_token}`);
		const { session, user, errors: apiErrors } = await res.json();
		if (apiErrors) {
			this.errors = apiErrors;
			return;
		}
		this.$store.commit('setUser', user);
		this.$store.commit('setSession', session);
		await this.$router.push('/profile');
	},
	fetchOnServer: false,
};
</script>

<template>
	<section class="h-screen flex flex-col gap-4 justify-center items-center">
		<div class="text-center" v-if="errors">
			<p class="text-red-500 text-3xl" :key="index" v-for="(error, index) in errors.items">
				{{ error.message }}
			</p>
		</div>
		<div class="text-center" v-else>
			<p class="text-6xl text-black">Please wait</p>
			<p class="text-3xl text-black">You're redirecting to your profile...</p>
		</div>
	</section>
</template>
