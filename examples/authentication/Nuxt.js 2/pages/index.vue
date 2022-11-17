<script>
export default {
	middleware: ['guest'],
	head() {
		return {
			title: 'Altogic Auth Sample With Nuxt2',
		};
	},
};
</script>

<template>
	<div class="flex items-center justify-center gap-4 h-screen">
		<NuxtLink class="border px-4 py-2 font-medium text-xl" to="/login-with-magic-link"
			>Login With Magic Link</NuxtLink
		>
		<NuxtLink class="border px-4 py-2 font-medium text-xl" to="/login">Login</NuxtLink>
		<NuxtLink class="border px-4 py-2 font-medium text-xl" to="/register">Register</NuxtLink>
	</div>
</template>
