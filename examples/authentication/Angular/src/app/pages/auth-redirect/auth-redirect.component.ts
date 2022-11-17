import { Component, OnInit } from '@angular/core';
import altogic from '../../libs/altogic';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { APIError } from 'altogic';

@Component({
	selector: 'app-auth-redirect',
	templateUrl: './auth-redirect.component.html',
})
export class AuthRedirectComponent implements OnInit {
	errors: APIError | null = null;
	noToken = false;
	constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

	ngOnInit(): void {
		this.verifyUser();
	}
	async verifyUser() {
		const token = this.route.snapshot.queryParamMap.get('access_token');

		if (!token) {
			this.noToken = true;
			return;
		}

		const { user, session, errors } = await altogic.auth.getAuthGrant(token);

		if (errors) {
			this.errors = errors;
			return;
		}

		this.authService.setUserAndSession(user, session);
		await this.router.navigate(['profile']);
	}
}
