import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import altogic from '@/libs/altogic';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
	const _user = ref(altogic.auth.getUser());
	const _session = ref(altogic.auth.getSession());

	function setUser(user) {
		_user.value = user;
		altogic.auth.setUser(user);
	}
	function setSession(session) {
		_session.value = session;
		altogic.auth.setSession(session);
	}
	async function logout() {
		await altogic.auth.signOut();
		setUser(null);
		setSession(null);
		await router.push({ name: 'login' });
	}

	const user = computed(() => _user.value);
	const session = computed(() => _session.value);

	return { user, session, setUser, setSession, logout };
});
