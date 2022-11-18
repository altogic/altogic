<script lang="ts">
import { defineComponent, ref } from 'vue';
import altogic from '@/libs/altogic';
import { APIError } from 'altogic';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';

export default defineComponent({
	name: 'LoginPage',
	components: { IonPage, IonContent },
	setup() {
		const email = ref('');
		const password = ref('');
		const errors = ref<APIError | null>(null);
		const loading = ref(false);
		const auth = useAuthStore();
		const router = useRouter();

		async function loginHandler() {
			loading.value = true;
			errors.value = null;
			const {
				errors: apiErrors,
				user,
				session,
			} = await altogic.auth.signInWithEmail(email.value, password.value);
			loading.value = false;

			if (apiErrors) {
				errors.value = apiErrors;
				return;
			}

			email.value = '';
			password.value = '';

			auth.setUser(user);
			auth.setSession(session);
			await router.push('/profile');
		}

		return {
			email,
			password,
			loading,
			errors,
			loginHandler,
		};
	},
});
</script>

<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<section class="container px-4 mx-auto flex flex-col items-center justify-center h-96 gap-4">
				<form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
					<h1 class="self-start text-3xl font-bold">Login to your account</h1>

					<div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
						<p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
					</div>

					<input class="text-black" v-model="email" type="email" placeholder="Type your email" required />
					<input
						class="text-black"
						v-model="password"
						type="password"
						placeholder="Type your password"
						required
					/>
					<div class="flex justify-between gap-4 items-start">
						<router-link class="text-indigo-400" to="/register">
							Don't have an account? Register now
						</router-link>
						<button
							:disabled="loading"
							type="submit"
							class="bg-white text-black py-2 px-3 transition shrink-0"
						>
							Login
						</button>
					</div>
				</form>
			</section>
		</ion-content>
	</ion-page>
</template>
