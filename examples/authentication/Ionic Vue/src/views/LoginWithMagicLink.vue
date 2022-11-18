<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import altogic from '@/libs/altogic';
import { APIError } from 'altogic';

export default defineComponent({
	name: 'LoginPage',
	components: {
		IonContent,
		IonPage,
	},
	setup() {
		const successMessage = ref('');
		const loading = ref(false);
		const email = ref('');
		const errors = ref<APIError | null>(null);

		async function loginHandler() {
			loading.value = true;
			errors.value = null;
			const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(email.value);
			loading.value = false;
			if (apiErrors) {
				errors.value = apiErrors;
			} else {
				email.value = '';
				successMessage.value = 'Email sent! Check your inbox.';
			}
		}
		return {
			email,
			errors,
			loginHandler,
			loading,
			successMessage,
		};
	},
});
</script>

<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<section class="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
				<form @submit.prevent="loginHandler" class="flex flex-col gap-2 w-full md:w-96">
					<h1 class="self-start text-3xl font-bold">Login with magic link</h1>
					<div v-if="successMessage" class="bg-green-600 text-white text-[13px] p-2">
						{{ successMessage }}
					</div>
					<div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
						<p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
					</div>

					<input class="text-black" v-model="email" type="email" placeholder="Type your email" required />
					<div class="flex justify-between gap-4 items-start">
						<router-link class="text-indigo-400" to="/register">
							Don't have an account? Register now
						</router-link>
						<button
							:disabled="loading"
							type="submit"
							class="text-black py-2 px-3 bg-white transition shrink-0"
						>
							Send magic link
						</button>
					</div>
				</form>
			</section>
		</ion-content>
	</ion-page>
</template>
