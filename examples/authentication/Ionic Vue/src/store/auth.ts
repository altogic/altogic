import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import router from '../router';
import altogic from '@/libs/altogic';
import { Session, User } from 'altogic';

export const useAuthStore = defineStore('auth', () => {
	const _user = ref(altogic.auth.getUser());
	const _session = ref(altogic.auth.getSession());

	function setUser(user: User | null) {
		_user.value = user;
		if (user) altogic.auth.setUser(user);
	}
	function setSession(session: Session | null) {
		_session.value = session;
		if (session) altogic.auth.setSession(session);
	}
	async function logout() {
		await altogic.auth.signOut();
		setUser(null);
		setSession(null);
		await router.push('/login');
	}

	const user = computed(() => _user.value);
	const session = computed(() => _session.value);
	return { user, session, setUser, setSession, logout };
});
