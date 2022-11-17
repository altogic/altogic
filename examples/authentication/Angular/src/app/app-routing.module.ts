import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginWithMagicLinkComponent } from './pages/login-with-magic-link/login-with-magic-link.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './shared/auth.guard';
import { GuestGuard } from './shared/guest.guard';
import { AuthRedirectComponent } from './pages/auth-redirect/auth-redirect.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		canActivate: [GuestGuard],
	},
	{
		path: 'profile',
		component: ProfileComponent,
		title: 'Profile Page',
		canActivate: [AuthGuard],
	},
	{
		path: 'login',
		component: LoginComponent,
		title: 'Login Page',
		canActivate: [GuestGuard],
	},
	{
		path: 'auth-redirect',
		component: AuthRedirectComponent,
		title: 'Auth Redirect Page',
	},
	{
		path: 'login-with-magic-link',
		component: LoginWithMagicLinkComponent,
		title: 'Login with Magic Link Page',
		canActivate: [GuestGuard],
	},
	{
		path: 'register',
		component: RegisterComponent,
		title: 'Register Page',
		canActivate: [GuestGuard],
	},
	{
		path: '**',
		redirectTo: '/',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
