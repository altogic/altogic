import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '../types/altogic';
import altogic from '../libs/altogic';
import { Session } from 'altogic';
import { redirect } from 'react-router-dom';

interface AuthState {
	user: User | null;
	session: Session | null;
	setUser: (user: User | null) => void;
	setSession: (session: Session | null) => void;
	logout: () => void;
}

const useAuthStore = create<AuthState>()(
	devtools(
		set => ({
			user: altogic.auth.getUser() as User | null,
			session: altogic.auth.getSession(),
			setUser(user) {
				set({ user });
				if (user) altogic.auth.setUser(user);
			},
			setSession(session) {
				set({ session });
				if (session) altogic.auth.setSession(session);
			},
			async logout() {
				set({ user: null, session: null });
				await altogic.auth.signOut();
				redirect('/auth/login');
			}
		}),
		{
			name: 'auth-storage'
		}
	)
);

export default useAuthStore;
