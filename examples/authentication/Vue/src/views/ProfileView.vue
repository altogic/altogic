<script setup>
import { useAuthStore } from '../stores/auth';
import Avatar from '../components/Avatar.vue';
import UserInfo from '../components/UserInfo.vue';
import Sessions from '../components/Sessions.vue';
const auth = useAuthStore();
</script>

<template>
	<section class="h-screen py-4 space-y-4 flex flex-col text-center items-center">
		<Avatar />
		<UserInfo />
		<Sessions />
		<button @click="auth.logout" class="bg-gray-400 rounded py-2 px-3 text-white">Logout</button>
	</section>
</template>
