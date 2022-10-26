import create from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Session, User } from 'altogic';
import altogic from '../libs/altogic';

interface AuthStore {
	user: User | null;
	session: Session | null;
	setUser: (user: User | null) => void;
	setSession: (session: Session | null) => void;
	reset: () => void;
}
const useAuthStore = create<AuthStore>()(
	devtools(
		set => ({
			user: altogic.auth.getUser(),
			session: altogic.auth.getSession(),
			setUser: user => {
				set({ user });
				if (user) altogic.auth.setUser(user);
			},
			setSession: session => {
				set({ session });
				if (session) altogic.auth.setSession(session);
			},
			reset: () => {
				set({ user: null, session: null });
				altogic.auth.clearLocalData();
			},
		}),
		{
			name: 'auth-storage',
		}
	)
);

export default useAuthStore;
