import { createRouter, createWebHistory } from '@ionic/vue-router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import Home from '@/views/Home.vue';
import { useAuthStore } from '@/store/auth';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: Home,
		meta: {
			requiresGuest: true,
		},
	},
	{
		path: '/login',
		component: () => import('@/views/Login.vue'),
		meta: {
			requiresGuest: true,
		},
	},
	{
		path: '/profile',
		component: () => import('@/views/Profile.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/register',
		component: () => import('@/views/Register.vue'),
		meta: {
			requiresGuest: true,
		},
	},
	{
		path: '/login-with-magic-link',
		component: () => import('@/views/LoginWithMagicLink.vue'),
		meta: {
			requiresGuest: true,
		},
	},
	{
		path: '/auth-redirect',
		component: () => import('@/views/AuthRedirect.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	const auth = useAuthStore();
	if (to.meta.requiresAuth && !auth.user) {
		return next('/login');
	}
	if (to.meta.requiresGuest && auth.user) {
		return next('/profile');
	}
	next();
});

export default router;
