import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import altogic from '../../libs/altogic';
import { APIError } from 'altogic';

@Component({
	selector: 'app-login-with-magic-link',
	templateUrl: './login-with-magic-link.component.html',
})
export class LoginWithMagicLinkComponent implements OnInit {
	magicForm = this.fb.group({
		email: ['', Validators.required],
	});
	errors: APIError | null = null;
	loading = false;
	showMessage = false;
	constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {}

	ngOnInit(): void {}

	async submitHandler() {
		const { email } = this.magicForm.value;
		if (!email) return;
		this.loading = true;
		this.errors = null;
		this.showMessage = false;

		const { errors } = await altogic.auth.sendMagicLinkEmail(email);
		this.loading = false;

		if (errors) {
			this.errors = errors;
			return;
		}

		this.showMessage = true;
		this.magicForm.reset();
	}
}
