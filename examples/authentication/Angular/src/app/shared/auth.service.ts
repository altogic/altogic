import { Injectable } from '@angular/core';
import { Session, User } from 'altogic';
import altogic from '../libs/altogic';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	user: User | null = altogic.auth.getUser();
	session: Session | null = altogic.auth.getSession();

	async logout() {
		await altogic.auth.signOut();
		this.setUserAndSession(null, null);
	}

	setUserAndSession(user: User | null, session: Session | null) {
		this.user = user;
		this.session = session;

		if (session && user) {
			altogic.auth.setUser(user);
			altogic.auth.setSession(session);
		}
	}

	setUser(user: User | null) {
		this.user = user;
		if (user) altogic.auth.setUser(user);
	}
}
