import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { User } from 'altogic';
import altogic from '../../libs/altogic';

@Component({
	selector: 'app-user-info',
	templateUrl: './user-info.component.html',
})
export class UserInfoComponent implements OnInit {
	errors: null | string = null;
	changeMode = false;
	loading = false;
	name = new FormControl(this.getUserName(), [Validators.required]);
	constructor(private authService: AuthService) {}
	getUserName() {
		return this.authService.user?.name;
	}
	async saveName() {
		this.loading = true;
		this.errors = null;

		const { data, errors: apiErrors } = await altogic.db
			.model('users')
			.object(this.authService.user?._id)
			.update({ name: this.name.value });

		if (apiErrors) {
			this.errors = apiErrors.items[0].message;
		} else {
			this.authService.setUser(data as User);
		}

		this.loading = false;
		this.changeMode = false;
	}
	ngOnInit() {}
}
