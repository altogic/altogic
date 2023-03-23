import altogic from './libs/altogic.js';

/** @type {import('@sveltejs/kit').Handle} */
export function handle({ event, resolve }) {
	const token = event.cookies.get('session_token');
	event.locals.token = token;

	event.locals.getSessionUser = async (_token) => {
		const token = _token ?? event.locals.token;
		if (!token) return null;
		altogic.auth.setSession({ token });
		const { user } = await altogic.auth.getUserFromDB();
		return user ?? null;
	};

	event.locals.getAllSessions = async (_token) => {
		const token = _token ?? event.locals.token;
		altogic.auth.setSession({ token });
		const { sessions } = await altogic.auth.getAllSessions();
		return sessions?.map((session) => ({
			...session,
			isCurrent: token === session.token
		}));
	};

	return resolve(event);
}
