export default {
	modules: ['@nuxtjs/tailwindcss'],
	serverMiddleware: [{ path: '/api', handler: '~/api/index.js' }],
};
