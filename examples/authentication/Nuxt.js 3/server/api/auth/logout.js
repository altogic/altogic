import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
	const token = getCookie(event, 'session_token');
	await altogic.auth.signOut(token);
	altogic.auth.removeSessionCookie(event.req, event.res);
	await sendRedirect(event, '/login');
});
