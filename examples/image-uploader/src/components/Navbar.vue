<template>
	<nav class="h-[70px] min-h-[70px]: bg-primary flex sticky top-0 z-[50]">
		<div class="flex items-center justify-between w-full px-4 lg:px-8">
			<div class="flex items-center gap-4">
				<router-link
					to="/"
					class="text-white font-bold whitespace-nowrap md:text-lg xl:text-2xl"
					>Image Uploader</router-link
				>
			</div>
			<div class="flex items-center lg:gap-1" v-if="!isAuthenticated">
				<router-link active-class="active" to="/login" class="menu-item"
					>Sign in</router-link
				>
				<router-link active-class="active" to="/register" class="menu-item"
					>Sign up</router-link
				>
			</div>
			<div class="flex items-center lg:gap-1" v-else>
				<router-link active-class="active" to="/dashboard" class="menu-item"
					>Dashboard</router-link
				>
				<a @click.prevent="store.logout()" class="menu-item">Logout</a>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const store = useAuthStore();
const isAuthenticated = computed(() => store.isAuthenticated);
</script>

<style scoped>
nav {
	--h: 70px;
	height: var(--h);
	max-height: var(--h);
	min-height: var(--h);
}
.menu-item {
	@apply text-[12px] whitespace-nowrap lg:text-base text-white font-medium rounded-md px-2 lg:px-4 py-2 transition hover:bg-white hover:text-gray-900 cursor-pointer;
}
.menu-item.active {
	@apply bg-white text-gray-900;
}
</style>
