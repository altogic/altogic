import { createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import altogic from '../libs/altogic';

const defaultState = {
	user: altogic.auth.getUser(),
	session: altogic.auth.getSession(),
};

const AuthContext = createContext([
	defaultState,
	{
		setUser: () => undefined,
		setSession: () => undefined,
	},
]);

export const AuthProvider = props => {
	const [state, setState] = createStore(defaultState);

	const setUser = user => {
		setState('user', user);
		altogic.auth.setUser(user);
	};
	const setSession = session => {
		setState('session', session);
		altogic.auth.setSession(session);
	};

	return <AuthContext.Provider value={[state, { setUser, setSession }]}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
