import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: { requiresGuest: true },
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import('../views/ProfileView.vue'),
			meta: { requiresAuth: true },
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
			meta: { requiresGuest: true },
		},
		{
			path: '/login-with-magic-link',
			name: 'magic-login',
			component: () => import('../views/LoginWithMagicLinkView.vue'),
			meta: { requiresGuest: true },
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegisterView.vue'),
			meta: { requiresGuest: true },
		},
		{
			path: '/auth-redirect',
			name: 'auth-redirect',
			component: () => import('../views/AuthRedirectView.vue'),
			meta: { requiresGuest: true },
		},
	],
});
router.beforeEach((to, from) => {
	const auth = useAuthStore();
	if (to.meta.requiresAuth && !auth.user) {
		return {
			name: 'login',
		};
	}
	if (to.meta.requiresGuest && auth.user) {
		return {
			name: 'profile',
		};
	}
});

export default router;
