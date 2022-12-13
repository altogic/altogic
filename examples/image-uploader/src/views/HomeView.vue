<template>
	<Navbar />
	<div class="flex flex-1 flex-col items-center justify-center gap-4 p-4">
		<div class="w-[70%] md:w-[300px]">
			<WelcomeLogo class="max-w-full h-72 lg:h-56 aspect-square" />
		</div>
		<Uploader />
		<div
			v-if="!store.isAuthenticated"
			class="flex items-center gap-2 p-4 rounded bg-amber-500 text-white"
		>
			<Icon class="shrink-0" name="bulb" :size="25" />
			<span
				>You can see the history of your uploads by
				<router-link class="font-medium underline" :to="{ name: 'register' }"
					>creating an account.</router-link
				></span
			>
		</div>
	</div>
</template>
<script setup>
import Uploader from '@/components/Uploader.vue';
import Navbar from '@/components/Navbar.vue';
import Icon from '@/components/Icon.vue';
import { useAuthStore } from '@/stores/auth';
import { useHead } from '@vueuse/head';
import WelcomeLogo from '@/components/WelcomeLogo.vue';
const store = useAuthStore();
useHead({
	title: 'Home Page - Image Uploader',
});
</script>
