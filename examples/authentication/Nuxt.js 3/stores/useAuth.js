import altogic from '~/libs/altogic';

export const useAuthStore = defineStore('AuthStore', () => {
	const user = ref(null);
	const sessionToken = ref(null);

	const setUser = _user => {
		user.value = _user;
		altogic.auth.setUser(_user);
	};

	const setSession = _session => {
		sessionToken.value = _session;
		altogic.auth.setSession(typeof _session === 'string' ? { token: _session } : _session);
	};

	watchEffect(() => {
		altogic.auth.setUser(user.value);
		const token = typeof sessionToken.value === 'string' ? { token: sessionToken.value } : sessionToken.value;
		altogic.auth.setSession(token);
	});

	return {
		user,
		sessionToken,
		setUser,
		setSession,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
