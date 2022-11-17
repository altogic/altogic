import altogic from '~/libs/altogic';

export default defineEventHandler(async event => {
	const token = getCookie(event, 'session_token');
	const { sessions, errors } = await altogic.auth.getAllSessions();

	if (errors) {
		return { errors };
	}

	return sessions.map(session => {
		return {
			...session,
			isCurrent: session.token === token,
		};
	});
});
