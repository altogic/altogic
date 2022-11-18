<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useAuthStore } from '@/store/auth';
import Avatar from '@/components/Avatar.vue';
import Sessions from '@/components/Sessions.vue';
import UserInfo from '@/components/UserInfo.vue';
export default defineComponent({
	name: 'ProfilePage',
	components: { IonContent, IonPage, Avatar, Sessions, UserInfo },
	setup() {
		const auth = useAuthStore();
		return {
			auth,
		};
	},
});
</script>

<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="max-w-full px-4 flex flex-col gap-4">
				<Avatar />
				<UserInfo />
				<Sessions />
				<button @click="auth.logout" class="bg-gray-600 rounded py-2 px-3 text-white">Logout</button>
			</div>
		</ion-content>
	</ion-page>
</template>
