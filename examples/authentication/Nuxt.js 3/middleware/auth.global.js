import { useAuthStore } from '~/stores/useAuth';

export default defineNuxtRouteMiddleware(() => {
	const store = useAuthStore();
	const event = useRequestEvent();

	if (process.server && event.context.user && event.context.session_token) {
		store.setUser(event.context.user);
		store.setSession(event.context.session_token);
	}
});
