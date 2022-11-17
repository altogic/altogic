import express from 'express';
import altogic from '../libs/altogic';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const { errors, session, user } = await altogic.auth.signInWithEmail(email, password);

	if (errors) {
		return res.json({ errors });
	}

	altogic.auth.setSession(session);
	altogic.auth.setSessionCookie(session.token, req, res);

	return res.json({
		session,
		user,
	});
});
app.post('/register', async (req, res) => {
	const { email, password, ...rest } = req.body;
	const { user, errors, session } = await altogic.auth.signUpWithEmail(email, password, rest);

	if (errors) {
		return res.json({ errors });
	}

	if (session) {
		altogic.auth.setSessionCookie(session.token, req, res);
		altogic.auth.setSession(session);
		return res.json({ user, session });
	}

	return res.json({ user });
});
app.get('/verify-user', async (req, res) => {
	const { access_token } = req.query;

	const { errors, user, session } = await altogic.auth.getAuthGrant(access_token);

	if (errors) {
		return res.json({ errors });
	}

	altogic.auth.setSessionCookie(session.token, req, res);
	altogic.auth.setSession(session);
	return res.json({ user, session });
});
app.get('/logout', async (req, res) => {
	const { session_token } = req.cookies;
	await altogic.auth.signOut(session_token);
	altogic.auth.removeSessionCookie(req, res);
	res.redirect('/login');
});

export default app;
