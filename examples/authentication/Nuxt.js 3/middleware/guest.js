import { useAuthStore } from '~/stores/useAuth';

export default defineNuxtRouteMiddleware(() => {
	const cookie = useCookie('session_token');
	const store = useAuthStore();

	if (cookie.value || store.user) return '/profile';
});
