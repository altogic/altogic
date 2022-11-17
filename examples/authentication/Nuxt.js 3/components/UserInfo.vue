<script setup>
import { useAuthStore } from '~/stores/useAuth';
import altogic from '~/libs/altogic';
const auth = useAuthStore();

const username = ref(auth?.user?.name);
const loading = ref(false);
const inputRef = ref(null);
const changeMode = ref(false);
const errors = ref(null);

function openChangeMode() {
	changeMode.value = true;
	setTimeout(() => {
		inputRef.value.focus();
	}, 100);
}

async function saveName() {
	loading.value = true;
	errors.value = null;

	const { data, errors: apiErrors } = await altogic.db
		.model('users')
		.object(auth.user._id)
		.update({ name: username.value });

	if (apiErrors) {
		errors.value = apiErrors[0].message;
	} else {
		username.value = data.name;
		auth.setUser(data);
	}

	loading.value = false;
	changeMode.value = false;
}
</script>

<template>
	<section class="border p-4 w-full">
		<div class="flex items-center justify-center" v-if="changeMode">
			<input
				@keyup.enter="saveName"
				ref="inputRef"
				type="text"
				v-model="username"
				class="border-none text-3xl text-center"
			/>
		</div>
		<div class="space-y-4" v-else>
			<h1 class="text-3xl">Hello, {{ auth?.user?.name }}</h1>
			<button @click="openChangeMode" class="border p-2">Change name</button>
		</div>
		<div v-if="errors">
			{{ errors }}
		</div>
	</section>
</template>
