import { redirect } from '@sveltejs/kit';
import altogic from '../../../libs/altogic.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	const token = cookies.get('session_token');
	await altogic.auth.signOut(token);
	cookies.set('session_token', '', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'Strict'
	});
	throw redirect(303, '/sign-in');
}
