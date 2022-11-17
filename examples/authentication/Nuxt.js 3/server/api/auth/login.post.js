import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
	const { email, password } = await readBody(event);
	const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);

	if (errors) {
		return { errors };
	}

	altogic.auth.setSessionCookie(session.token, event.req, event.res);
	altogic.auth.setSession(session);
	return { user, session };
});
