import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import altogic from '../../libs/altogic';
import { APIError } from 'altogic';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
	loginForm = this.fb.group({
		email: ['', Validators.required],
		password: ['', Validators.required],
	});
	errors: APIError | null = null;
	loading = false;

	constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}
	ngOnInit(): void {}

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
