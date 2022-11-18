<script lang="ts">
import { defineComponent, ref } from 'vue';
import { APIError } from 'altogic';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';
import altogic from '@/libs/altogic';
import { IonPage, IonContent } from '@ionic/vue';

export default defineComponent({
	name: 'RegisterPage',
	components: { IonPage, IonContent },
	setup() {
		const email = ref('');
		const password = ref('');
		const name = ref('');
		const errors = ref<APIError | null>(null);
		const loading = ref(false);
		const isNeedToVerify = ref(false);
		const auth = useAuthStore();
		const router = useRouter();

		async function registerHandler() {
			loading.value = true;
			errors.value = null;
			const {
				errors: apiErrors,
				user,
				session,
			} = await altogic.auth.signUpWithEmail(email.value, password.value, name.value);
			loading.value = false;

			if (apiErrors) {
				errors.value = apiErrors;
				return;
			}

			email.value = '';
			password.value = '';
			name.value = '';

			if (!session) {
				isNeedToVerify.value = true;
				return;
			}

			auth.setUser(user);
			auth.setSession(session);
			await router.push('/profile');
		}

		return {
			isNeedToVerify,
			email,
			name,
			password,
			loading,
			errors,
			registerHandler,
		};
	},
});
</script>

<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<section class="container mx-auto px-4 flex flex-col items-center justify-center h-96 gap-4">
				<form @submit.prevent="registerHandler" class="flex flex-col gap-2 w-full md:w-96">
					<h1 class="self-start text-3xl font-bold">Create an account</h1>

					<div v-if="isNeedToVerify" class="bg-green-500 text-white p-2">
						Your account has been created. Please check your email to verify your account.
					</div>

					<div v-if="errors" class="bg-red-600 text-white text-[13px] p-2">
						<p v-for="(error, index) in errors.items" :key="index">{{ error.message }}</p>
					</div>

					<input class="text-black" v-model="email" type="email" placeholder="Type your email" required />
					<input class="text-black" v-model="name" type="text" placeholder="Type your name" required />
					<input
						class="text-black"
						v-model="password"
						type="password"
						placeholder="Type your password"
						required
					/>
					<div class="flex justify-between gap-4">
						<router-link class="text-indigo-400" to="/login">Already have an account?</router-link>
						<button type="submit" class="bg-white text-black py-2 px-3 transition shrink-0">
							Register
						</button>
					</div>
				</form>
			</section>
		</ion-content>
	</ion-page>
</template>
