<template>
	<div class="flex items-center justify-center gap-4 h-screen">
		<router-link class="border px-4 py-2 font-medium text-xl" :to="{ name: 'magic-login' }">Login With Magic Link</router-link>
		<router-link class="border px-4 py-2 font-medium text-xl" :to="{ name: 'login' }">Login</router-link>
		<router-link class="border px-4 py-2 font-medium text-xl" :to="{ name: 'register' }">Register</router-link>
	</div>
</template>
