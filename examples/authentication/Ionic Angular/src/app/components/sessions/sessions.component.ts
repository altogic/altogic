import { Component, HostBinding, OnInit } from '@angular/core';
import { APIError, Session } from 'altogic';
import altogic from '../../libs/altogic';
import { AuthService } from '../../shared/auth.service';

interface SessionData extends Session {
	isCurrent: boolean;
}

@Component({
	selector: 'app-sessions',
	templateUrl: './sessions.component.html',
})
export class SessionsComponent implements OnInit {
	sessions: SessionData[] | null = null;
	errors: APIError | null = null;
	constructor(private authService: AuthService) {}
	@HostBinding('class.w-full')
	ngOnInit(): void {
		this.getSessions();
	}

	// @ts-ignore
  async getSessions() {
		const { sessions, errors } = await altogic.auth.getAllSessions();

		if (errors) {
			this.errors = errors;
			return;
		}

		this.sessions = sessions?.map((session: Session) => {
      return {
				...session,
				isCurrent: session.token === this.authService.session?.token,
        // @ts-ignore
				creationDtm: new Date(session.creationDtm).toLocaleDateString('en-US'),
			};
		}) as SessionData[];
	}

	async logoutSession(session: Session) {
		const { errors } = await altogic.auth.signOut(session.token);
		if (!errors) {
			// @ts-ignore
      this.sessions = this.sessions?.filter(s => s.token !== session.token) as SessionData[];
		}
	}
}
