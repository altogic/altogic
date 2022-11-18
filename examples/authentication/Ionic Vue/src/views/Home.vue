<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

export default defineComponent({
	name: 'HomePage',
	components: { IonContent, IonPage },
});
</script>

<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="flex justify-center gap-2 h-screen items-center">
				<router-link class="border px-4 py-2 font-medium text-sm" to="/login-with-magic-link">
					Login With Magic Link
				</router-link>
				<router-link class="border px-4 py-2 font-medium text-sm" to="/login">Login</router-link>
				<router-link class="border px-4 py-2 font-medium text-sm" to="/register">Register</router-link>
			</div>
		</ion-content>
	</ion-page>
</template>
