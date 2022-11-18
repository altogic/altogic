import { Component, OnInit } from '@angular/core';
import { User } from 'altogic';
import altogic from '../../libs/altogic';
import { AuthService } from '../../shared/auth.service';

@Component({
	selector: 'app-avatar',
	templateUrl: './avatar.component.html',
})
export class AvatarComponent implements OnInit {
	loading = false;
	errors = null;
	constructor(private authService: AuthService) {}

	getUserName() {
		return this.authService.user?.name;
	}

	getUserPhoto() {
		return (
			this.authService.user?.profilePicture ||
			`https://ui-avatars.com/api/?name=${this.getUserName()}&background=0D8ABC&color=fff`
		);
	}

	// @ts-ignore
  async onFileChange(event: any) {
		const [file] = event.target.files;
		event.target.value = null;
		if (!file) return;

		this.loading = true;
		this.errors = null;

		try {
			const profilePicture = await this.uploadAvatar(file);
			const user = await this.updateUser({ profilePicture });
			this.authService.setUser(user as User);
		} catch (error: any) {
			this.errors = error.message;
		} finally {
			this.loading = false;
		}
	}
	async uploadAvatar(file: any) {
		// @ts-ignore
		const { data, errors } = await altogic.storage.bucket('root').upload(`user_${this.authService.user?._id}`, file);
		if (errors) {
			// @ts-ignore
      throw new Error("Couldn't upload avatar, please try again later");
		}
		// @ts-ignore
		return data.publicPath;
	}
	// @ts-ignore
  async updateUser(data: Partial<User>) {
		const { data: user, errors } = await altogic.db.model('users').object(this.authService.user?._id).update(data);
		if (errors) {
			// @ts-ignore
      throw new Error("Couldn't update user, please try again later");
		}
		return user as User;
	}
	ngOnInit(): void {}
}
