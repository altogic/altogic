import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class GuestGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.authService.user) {
			this.router.navigate(['profile']);
			return false;
		}
		return true;
	}
}
