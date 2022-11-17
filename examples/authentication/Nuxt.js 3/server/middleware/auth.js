import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
	const token = getCookie(event, 'session_token');

	const { user } = await altogic.auth.getUserFromDBbyCookie(event.req, event.res);

	if (user) {
		event.context.user = user;
		event.context.session_token = token;
	}
});
