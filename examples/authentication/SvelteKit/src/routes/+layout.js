import altogic from '../libs/altogic.js';

export const load = ({ data: { user, token, allSessions } }) => {
	altogic.auth.setSession({ token });
	altogic.auth.setUser(user);
	return { user, token, allSessions };
};
