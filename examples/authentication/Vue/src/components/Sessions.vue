<script setup>
import altogic from '../libs/altogic';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
const sessions = ref([]);
const auth = useAuthStore();

onMounted(() => {
	altogic.auth.getAllSessions().then(({ sessions: _sessions, errors }) => {
		if (!errors) {
			sessions.value = _sessions.map(session => {
				return {
					...session,
					isCurrent: session.token === auth.session.token,
				};
			});
		}
	});
});
async function logoutSession(session) {
	const { errors } = await altogic.auth.signOut(session.token);
	if (!errors) {
		sessions.value = sessions.value.filter(s => s.token !== session.token);
	}
}
</script>

<template>
	<div class="border p-4 space-y-4">
		<p class="text-3xl">All Sessions</p>
		<ul class="flex flex-col gap-2">
			<li :key="session.token" class="flex justify-between gap-12" v-for="session in sessions">
				<div>
					<span v-if="session?.isCurrent"> Current Session </span>
					<span v-else> <strong>Device name: </strong>{{ session?.userAgent?.device?.family }}</span>
				</div>
				<div class="flex items-center gap-2">
					<span>{{ new Date(session.creationDtm).toLocaleDateString('en-US') }}</span>
					<button
						v-if="!session?.isCurrent"
						@click="logoutSession(session)"
						class="border grid place-items-center p-2 h-8 w-8 aspect-square leading-none"
					>
						X
					</button>
				</div>
			</li>
		</ul>
	</div>
</template>
