import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
	const { access_token } = getQuery(event);

	const { errors, user, session } = await altogic.auth.getAuthGrant(access_token.toString());

	if (errors) {
		return { errors };
	}

	altogic.auth.setSessionCookie(session.token, event.req, event.res);
	altogic.auth.setSession(session);
	return { user, session };
});
