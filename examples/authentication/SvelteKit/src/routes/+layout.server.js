import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSessionUser, token, getAllSessions }, url }) {
	const user = await getSessionUser();
	const allSessions = await getAllSessions();

	if (['/', '/sign-in', '/sign-up', 'magic-link'].includes(url.pathname) && user) {
		throw redirect(303, '/profile');
	}
	if (!user && url.pathname === '/profile') {
		throw redirect(303, '/sign-in');
	}

	return {
		user,
		token,
		allSessions
	};
}
