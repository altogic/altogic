import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { APIError } from 'altogic';
import altogic from '../../libs/altogic';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
})
export class LoginPage implements OnInit {
	loginForm = this.fb.group({
		email: ['', Validators.required],
		password: ['', Validators.required],
	});
	errors: APIError | null = null;
	loading = false;

	constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}
	ngOnInit(): void {}

	// @ts-ignore
  async submitHandler() {
		const { email, password } = this.loginForm.value;
		if (!email || !password) return;
		this.loading = true;
		this.errors = null;

		const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);
		this.loading = false;

		if (errors) {
			this.errors = errors;
			return;
		}

		this.authService.setUserAndSession(user, session);
		await this.router.navigate(['profile']);
	}
}
