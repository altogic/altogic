import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { APIError } from 'altogic';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import altogic from '../../libs/altogic';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
})
export class RegisterPage implements OnInit {
	registerForm = this.fb.group({
		name: ['', Validators.required],
		email: ['', Validators.required],
		password: ['', Validators.required],
	});
	errors: APIError | null = null;
	loading = false;
	isNeedToVerify = false;
	constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

	ngOnInit(): void {}

	// @ts-ignore
  async submitHandler() {
		const { email, password, name } = this.registerForm.value;
		if (!email || !password || !name) return;
		this.loading = true;
		this.errors = null;
		this.isNeedToVerify = false;

		const { user, session, errors } = await altogic.auth.signUpWithEmail(email, password, name);
		this.loading = false;

		if (errors) {
			this.errors = errors;
			return;
		}

		if (!session) {
			this.isNeedToVerify = true;
			this.registerForm.reset();
			return;
		}

		this.authService.setUserAndSession(user, session);
		await this.router.navigate(['profile']);
	}
}
