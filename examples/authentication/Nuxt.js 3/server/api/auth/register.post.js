import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
	const { email, password, ...rest } = await readBody(event);
	const { user, errors, session } = await altogic.auth.signUpWithEmail(email, password, rest);

	if (errors) {
		return { errors };
	}

	if (session) {
		altogic.auth.setSessionCookie(session.token, event.req, event.res);
		altogic.auth.setSession(session);
		return { user, session };
	}

	return { user };
});
