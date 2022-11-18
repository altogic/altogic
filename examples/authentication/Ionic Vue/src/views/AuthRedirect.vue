<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import altogic from '@/libs/altogic';
import { APIError } from 'altogic';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { IonPage, IonContent } from '@ionic/vue';

export default defineComponent({
	name: 'AuthRedirectPage',
	components: { IonPage, IonContent },
	setup() {
		const auth = useAuthStore();
		const { access_token } = useRoute().query;
		const router = useRouter();
		const errors = ref<APIError | null>(null);

		onMounted(() => {
			loginWithToken();
		});

		async function loginWithToken() {
			const { user, session, errors: apiErrors } = await altogic.auth.getAuthGrant(access_token?.toString());
			if (!apiErrors) {
				auth.setSession(session);
				auth.setUser(user);
				await router.push('/profile');
			} else {
				errors.value = apiErrors;
			}
		}
		return {
			auth,
			errors,
		};
	},
});
</script>
<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<section class="h-screen flex flex-col gap-4 justify-center items-center">
				<div class="text-center" v-if="!errors">
					<p class="text-6xl">Please wait</p>
					<p class="text-3xl">You're redirecting to your profile...</p>
				</div>
				<div class="text-center text-red-500 text-3xl" v-else>
					<p :key="index" v-for="(error, index) in errors.items">{{ error.message }}</p>
				</div>
			</section>
		</ion-content>
	</ion-page>
</template>
