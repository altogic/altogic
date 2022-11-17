import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
	loading = false;
	constructor(private router: Router, private authService: AuthService) {}
	ngOnInit(): void {}

	async logout() {
		this.loading = true;
		await this.authService.logout();
		this.loading = false;
		await this.router.navigate(['/login']);
	}
}
