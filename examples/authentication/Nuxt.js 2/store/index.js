import altogic from '~/libs/altogic';

export const index = () => ({
	user: null,
	session: null,
	allSessions: [],
	sessionToken: null,
});

export const mutations = {
	setUser(state, user) {
		state.user = user;
		altogic.auth.setSession(user);
	},
	setSession(state, session) {
		state.session = session;
		altogic.auth.setSession(session);
	},
	setSessionToken(state, token) {
		state.sessionToken = token;
	},
};

export const actions = {
	async nuxtServerInit({ commit }, { req, res }) {
		const { session_token } = parseCookies(req);
		const { user } = await altogic.auth.getUserFromDBbyCookie(req, res);
		if (user) {
			commit('setUser', user);
			commit('setSessionToken', session_token);
		}
	},
};

function parseCookies(req) {
	const list = {},
		rc = req.headers.cookie;

	rc &&
		rc.split(';').forEach(cookie => {
			const parts = cookie.split('=');
			list[parts.shift().trim()] = decodeURI(parts.join('='));
		});

	return list;
}
