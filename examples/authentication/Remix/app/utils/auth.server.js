import { createCookieSessionStorage, json, redirect } from '@remix-run/node';
import altogic from '~/libs/altogic';

export async function logout(request) {
	const session = await getUserSession(request);
	const token = session.get('token');

	altogic.auth.setSession({ token });
	await altogic.auth.signOut(token);

	return redirect('/login', {
		headers: {
			'Set-Cookie': await storage.destroySession(session),
		},
	});
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error('SESSION_SECRET must be set in your environment');
}

const storage = createCookieSessionStorage({
	cookie: {
		name: 'session',
		secure: process.env.NODE_ENV === 'production',
		secrets: [sessionSecret],
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
});

function getUserSession(request) {
	return storage.getSession(request.headers.get('Cookie'));
}
export async function getToken(request) {
	const session = await getUserSession(request);
	const token = session.get('token');
	if (!token) return null;
	return token;
}
export async function requireAuth(request) {
	const session = await getUserSession(request);
	const token = session.get('token');
	if (!token) {
		throw redirect(`/login`);
	}
	return token;
}
export async function requireNoAuth(request) {
	const session = await getUserSession(request);
	const token = session.get('token');
	if (token) {
		throw redirect(`/profile`);
	}
	return null;
}
export async function createUserSession(token, redirectTo) {
	const session = await storage.getSession();
	session.set('token', token);
	throw redirect(redirectTo, {
		headers: {
			'Set-Cookie': await storage.commitSession(session),
		},
	});
}

export async function getUserFromDbAndWriteToSession(request, needAuth = false) {
	const session = await getUserSession(request);
	const { user } = await getUserByToken(session.get('token'));

	session.set('user', user);

	if (needAuth && !user) {
		return redirect('/login', {
			headers: {
				'Set-Cookie': await storage.destroySession(session),
			},
		});
	}

	return json(user, {
		headers: {
			'Set-Cookie': await storage.commitSession(session),
		},
	});
}

export async function getAllSessions(request) {
	const { sessions, errors } = await altogic.auth.getAllSessions();
	const token = await getToken(request);

	if (errors) {
		return { errors };
	}

	return {
		sessions: sessions.map(session => ({
			...session,
			isCurrent: session.token === token,
		})),
	};
}

export async function updateUser(request, data) {
	const { user, errors } = await getUserByToken(await getToken(request));
	if (errors) throw errors;
	return altogic.db.model("users").object(user._id).update(data);
}

export function getUserByToken(token) {
	altogic.auth.setSession({ token });
	return altogic.auth.getUserFromDB();
}
