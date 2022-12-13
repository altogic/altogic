import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/HomeView.vue'),
		},
		{
			path: '/dashboard',
			component: () => import('../views/DashboardView.vue'),
			meta: { requiresAuth: true },
			children: [
				{
					name: 'dashboard',
					path: '',
					component: () => import('../views/RootFolderView.vue'),
				},
				{
					path: 'folder/:slug',
					name: 'folder',
					component: () => import('../views/FolderView.vue'),
				},
			],
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
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
			name: 'dashboard',
		};
	}
});

export default router;
