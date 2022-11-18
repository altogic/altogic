<template>
	<ion-app>
		<ion-router-outlet />
	</ion-app>
</template>

<script lang="ts">
import { IonRouterOutlet, IonApp } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
	name: 'App',
	components: {
		IonApp,
		IonRouterOutlet,
	},
});
</script>
