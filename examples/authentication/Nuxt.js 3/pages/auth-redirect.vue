<script setup>
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const errors = ref(null);
const { access_token } = route.query;

useHead({
	title: 'Verify your account',
});

onMounted(async () => {
	const { errors: apiErrors, user, session } = await $fetch(`/api/auth/verify-user?access_token=${access_token}`);
	if (apiErrors) {
		errors.value = apiErrors;
		return;
	}
	auth.setUser(user);
	auth.setSession(session);
	await router.push('/profile');
});
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
